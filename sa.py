from flask import Flask, request, jsonify
import asyncio
from playwright.async_api import async_playwright
import json
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
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        data = {"attendance": [], "sessions": [], "timetable": []}

        try:
            # Navigate to the login page and log in
            await page.goto("http://kmit-netra.teleuniv.in/", wait_until="load")
            await page.wait_for_selector('#login_mobilenumber', timeout=10000)
            await page.fill('#login_mobilenumber', mobile_number)
            await page.fill('#login_password', 'Kmit123$')  # Replace securely in real use
            await page.click('button[type="submit"]')
            await page.wait_for_load_state('networkidle')

            # Fetch attendance data
            await page.goto("http://kmit-netra.teleuniv.in/student/attendance", wait_until="networkidle")
            await page.wait_for_selector('.ant-page-header-heading-title', timeout=10000)
            data['attendance'], data['sessions'] = await extract_attendance(page)

            # Fetch timetable data
            await page.goto("http://kmit-netra.teleuniv.in/student/time-table", wait_until="networkidle")
            await page.wait_for_selector('.ant-page-header-heading-title', timeout=10000)
            data['timetable'] = await extract_timetable(page)

        except Exception as e:
            print("❌ Error:", e)

        finally:
            await browser.close()
            return data


async def extract_attendance(page):
    try:
        overall_xpath = '//div[contains(@class, "ant-collapse-header") and .//h4[text()="Overall"]]'
        await page.wait_for_selector(overall_xpath, timeout=10000)
        await page.click(overall_xpath)
        await page.wait_for_timeout(3000)
    except:
        pass

    attendance = await page.evaluate('''() => {
        const rows = Array.from(document.querySelectorAll('div.ant-collapse-content-active table tr'));
        return rows.map(row => {
            const cols = row.querySelectorAll('td, th');
            return Array.from(cols).map(col => col.innerText.trim());
        });
    }''')

    session_data = await page.evaluate('''() => {
        const sessions = Array.from(document.querySelectorAll('div.ant-collapse-content-active span > svg'));
        return sessions.map(svg => svg.getAttribute('fill') === 'green' ? 'Present' : 'Absent');
    }''')

    return attendance, session_data


async def extract_timetable(page):
    try:
        collapsible_headers = await page.query_selector_all('//div[contains(@class, "ant-collapse-header")]')
        for header in collapsible_headers:
            await header.click()
            await page.wait_for_timeout(1000)
    except:
        pass

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

    return timetable_data


if __name__ == '__main__':
    app.run(debug=True, port=3000)