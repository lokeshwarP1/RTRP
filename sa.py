# from flask import Flask, request, jsonify
# import asyncio
# from playwright.async_api import async_playwright
# import json
# from flask_cors import CORS  # Import CORS

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# @app.route('/api/update-dashboard', methods=['POST'])
# def update_dashboard():
#     try:
#         # Get the mobile number from the request body
#         data = request.get_json()
#         mobile_number = data.get('mobile_number')
#         if not mobile_number:
#             return jsonify({"error": "Mobile number is required"}), 400

#         # Fetch data from the KMIT Netra Portal
#         scraped_data = asyncio.run(login_to_kmit_netra(mobile_number))

#         # Save the retrieved data to a JSON file
#         if scraped_data:
#             with open('kmit_data.json', 'w') as json_file:
#                 json.dump(scraped_data, json_file, indent=4)

#         # Return the scraped data as a JSON response
#         return jsonify(scraped_data), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# async def login_to_kmit_netra(mobile_number):
#     async with async_playwright() as p:
#         browser = await p.chromium.launch(headless=True)
#         page = await browser.new_page()
#         data = {"attendance": [], "sessions": [], "timetable": []}

#         try:
#             # Navigate to the login page and log in
#             await page.goto("http://kmit-netra.teleuniv.in/", wait_until="load")
#             await page.wait_for_selector('#login_mobilenumber', timeout=3000)
#             await page.fill('#login_mobilenumber', mobile_number)
#             await page.fill('#login_password', 'Kmit123$')  # Replace securely in real use
#             await page.click('button[type="submit"]')
#             await page.wait_for_load_state('networkidle')

#             # Fetch attendance data
#             await page.goto("http://kmit-netra.teleuniv.in/student/attendance", wait_until="networkidle")
#             await page.wait_for_selector('.ant-page-header-heading-title', timeout=3000)
#             data['attendance'], data['sessions'] = await extract_attendance(page)

#             # Fetch timetable data
#             await page.goto("http://kmit-netra.teleuniv.in/student/time-table", wait_until="networkidle")
#             await page.wait_for_selector('.ant-page-header-heading-title', timeout=3000)
#             data['timetable'] = await extract_timetable(page)

#         except Exception as e:
#             print("❌ Error:", e)

#         finally:
#             await browser.close()
#             return data


# async def extract_attendance(page):
#     try:
#         overall_xpath = '//div[contains(@class, "ant-collapse-header") and .//h4[text()="Overall"]]'
#         await page.wait_for_selector(overall_xpath, timeout=3000)
#         await page.click(overall_xpath)
#         await page.wait_for_timeout(1000)
#     except:
#         pass

#     attendance = await page.evaluate('''() => {
#         const rows = Array.from(document.querySelectorAll('div.ant-collapse-content-active table tr'));
#         return rows.map(row => {
#             const cols = row.querySelectorAll('td, th');
#             return Array.from(cols).map(col => col.innerText.trim());
#         });
#     }''')

#     session_data = await page.evaluate('''() => {
#         const sessions = Array.from(document.querySelectorAll('div.ant-collapse-content-active span > svg'));
#         return sessions.map(svg => svg.getAttribute('fill') === 'green' ? 'Present' : 'Absent');
#     }''')

#     return attendance, session_data


# async def extract_timetable(page):
#     try:
#         collapsible_headers = await page.query_selector_all('//div[contains(@class, "ant-collapse-header")]')
#         for header in collapsible_headers:
#             await header.click()
#             await page.wait_for_timeout(1000)
#     except:
#         pass

#     timetable_data = await page.evaluate('''() => {
#         const days = Array.from(document.querySelectorAll('div.ant-collapse-item'));
#         return days.map(day => {
#             const header = day.querySelector('.ant-collapse-header').innerText.trim();
#             const rows = Array.from(day.querySelectorAll('div.ant-collapse-content-box table tr')).map(row => {
#                 const cols = row.querySelectorAll('td, th');
#                 return Array.from(cols).map(col => col.innerText.trim());
#             });
#             return { header, rows };
#         });
#     }''')

#     return timetable_data


# if __name__ == '__main__':
#     app.run(debug=True, port=3000)

from flask import Flask, request, jsonify
import asyncio
from playwright.async_api import async_playwright
import json  # Add this import
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/api/update-dashboard', methods=['POST'])
def update_dashboard():
    try:
        # Get the mobile number from the request body
        data = request.get_json()
        mobile_number = data.get('mobile_number')
        if not mobile_number:
            return jsonify({"error": "Mobile number is required"}), 400

        # Fetch data from the KMIT Netra Portal
        scraped_data = asyncio.run(login_to_kmit_netra(mobile_number))

        # Save the retrieved data to a JSON file
        if scraped_data:
            with open('kmit_data.json', 'w') as json_file:
                json.dump(scraped_data, json_file, indent=4)

        # Return the scraped data as a JSON response
        return jsonify(scraped_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


async def login_to_kmit_netra(mobile_number):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)  # Set headless=False for debugging
        page = await browser.new_page()
        data = {
            "attendance": [],
            "sessions": [],
            "overall_attendance_percentage": None,
            "timetable": []
        }

        try:
            # 1. Go to login page
            print("🌐 Opening KMIT Netra login page...")
            await page.goto("http://kmit-netra.teleuniv.in/", wait_until="load")

            # 2. Wait for mobile number input (10s timeout)
            try:
                await page.wait_for_selector('#login_mobilenumber', timeout=3000)
                await page.fill('#login_mobilenumber', mobile_number)
                await page.fill('#login_password', 'Kmit123$')  # Replace with secure password handling
            except Exception as e:
                print("❌ Error: Could not find login inputs.")
                await page.screenshot(path='error_login_page.png')
                await browser.close()
                return data

            # 3. Click login
            await page.click('button[type="submit"]')
            await page.wait_for_load_state('networkidle')
            print("✅ Logged in successfully!")

            # 4. Navigate to attendance page
            print("\n📖 Navigating to attendance page...")
            await page.goto("http://kmit-netra.teleuniv.in/student/attendance", wait_until="networkidle")
            
            # Debugging: Log the page content to verify the HTML structure
            print(await page.content())

            try:
                # Wait for the header to load with an increased timeout
                print("⏳ Waiting for attendance page header...")
                await page.wait_for_selector('.ant-page-header-heading-title', timeout=3000)
            except Exception as e:
                print("⚠ Could not find attendance page header:", e)
                await page.screenshot(path='error_attendance_page.png')
                await browser.close()
                return data

            # 5. Extract attendance details
            attendance_data = await extract_attendance(page)
            data['attendance'] = attendance_data['attendance']
            data['sessions'] = attendance_data['sessions']
            data['overall_attendance_percentage'] = attendance_data['overall_attendance_percentage']

            # 6. Navigate to timetable page
            print("\n📅 Navigating to timetable page...")
            await page.goto("http://kmit-netra.teleuniv.in/student/time-table", wait_until="networkidle")
            await page.wait_for_selector('.ant-page-header-heading-title', timeout=3000)

            # 7. Extract timetable details
            timetable_data = await extract_timetable(page)
            data['timetable'] = timetable_data

        except Exception as e:
            print(f"❌ An error occurred: {e}")
            await page.screenshot(path='error_final.png')

        finally:
            await browser.close()
            return data


async def extract_attendance(page):
    print("\n📅 Extracting attendance details...")

    # Initialize data structure
    data = {
        "attendance": [],
        "sessions": [],
        "overall_attendance_percentage": None
    }

    # 1. Expand collapsible sections ("Last 2 Weeks" and "Overall")
    try:
        print("🔄 Expanding 'Overall' section...")
        overall_xpath = '//div[contains(@class, "ant-collapse-header") and .//h4[text()="Overall"]]'
        await page.wait_for_selector(overall_xpath, timeout=3000)
        await page.click(overall_xpath)
        await page.wait_for_selector('div.ant-collapse-content-active')  # Wait for content to load
        await page.wait_for_timeout(1000)  # Additional wait for dynamic content to load
    except Exception as e:
        print("⚠ Error expanding 'Overall' section:", e)

    # 2. Extract Overall Attendance Percentage
    try:
        print("📝 Extracting Overall Attendance Percentage...")
        overall_percentage = await page.evaluate('''() => {
            const progressBg = document.querySelector('.ant-progress-bg');
            if (progressBg) {
                const style = progressBg.getAttribute('style');
                const widthMatch = style.match(/width:\s*([\d.]+)%/);
                return widthMatch ? parseFloat(widthMatch[1]) : null;
            }
            return null;
        }''')

        data['overall_attendance_percentage'] = overall_percentage

        if overall_percentage is not None:
            print(f"\n📊 Overall Attendance Percentage: {overall_percentage}%")
        else:
            print("⚠ Could not extract Overall Attendance Percentage.")
    except Exception as e:
        print("⚠ Could not extract Overall Attendance Percentage:", e)

    # 3. Extract Attendance for Each Period on the Last Working Day
    try:
        print("📝 Extracting Today's Attendance...")
        today_attendance = await page.evaluate('''() => {
            const sessions = Array.from(document.querySelectorAll('div.ant-collapse-content-active span > svg'));
            return sessions.map(svg => svg.getAttribute('fill') === 'green' ? 'Present' : 'Absent');
        }''')

        data['sessions'] = today_attendance

        print("\n📅 Attendance for Each Period on the Last Working Day:")
        for idx, status in enumerate(today_attendance, start=1):
            print(f"Session {idx}: {status}")
    except Exception as e:
        print("⚠ Could not extract Today's Attendance:", e)

    return data


async def extract_timetable(page):
    print("\n📚 Extracting timetable details...")

    # Initialize data structure
    timetable_data = []

    try:
        # Expand all collapsible sections in the timetable
        print("🔄 Expanding all collapsible sections...")
        collapsible_headers = await page.query_selector_all('//div[contains(@class, "ant-collapse-header")]')
        for header in collapsible_headers:
            await header.click()
            await page.wait_for_timeout(1000)  # Wait for content to load

        # Extract timetable data for each day
        timetable_data = await page.evaluate('''() => {
            const days = Array.from(document.querySelectorAll('div.ant-collapse-item'));
            return days.map(day => {
                const header = day.querySelector('.ant-collapse-header').innerText.trim();
                const rows = Array.from(day.querySelectorAll('div.ant-collapse-content-box table tr')).map(row => {
                    const cols = row.querySelectorAll('td, th');
                    return Array.from(cols).map(col => col.innerText.trim());
                });
                return { header, rows };
            });
        }''')

        print("\n📅 Timetable Data:")
        for day in timetable_data:
            print(f"Day: {day['header']}")
            for row in day['rows']:
                print(f"  {row}")

    except Exception as e:
        print("⚠ Could not extract timetable data:", e)

    return timetable_data


if __name__ == '__main__':
    app.run(debug=True, port=3000)