import asyncio
from pyppeteer import launch

async def login_to_kmit_netra(mobile_number):
    # Launch the browser in headless mode
    browser = await launch(headless=True)
    page = await browser.newPage()

    try:
        # 1. Go to login page
        print("🌐 Opening KMIT Netra login page...")
        await page.goto("http://kmit-netra.teleuniv.in/", waitUntil="load")

        # 2. Wait for mobile number input
        print("📱 Entering credentials...")
        await page.waitForSelector('#login_mobilenumber', timeout=10000)
        await page.type('#login_mobilenumber', mobile_number)
        await page.type('#login_password', 'Kmit123$')  # Replace with secure password handling

        # 3. Click login
        await page.click('button[type="submit"]')
        await page.waitForNavigation({'waitUntil': 'networkidle2'})
        print("✅ Logged in successfully!")

        # 4. Navigate to dashboard
        print("\n📖 Navigating to dashboard...")
        await page.goto("http://kmit-netra.teleuniv.in/student", waitUntil="networkidle2")
        await page.waitForSelector('.ant-page-header-heading-title', timeout=10000)  # Wait for dashboard title

        # 5. Extract attendance details
        await extract_attendance(page)

        # 6. Navigate to timetable page
        print("\n📅 Extracting timetable details...")
        await page.goto("http://kmit-netra.teleuniv.in/student/time-table", waitUntil="networkidle2", timeout=60000)
        await page.waitForSelector('.ant-page-header-heading-title', timeout=10000)  # Wait for timetable page title

        # 7. Extract timetable details
        await extract_timetable(page)

    except Exception as e:
        print(f"❌ An error occurred: {e}")

    finally:
        # Close the browser
        await browser.close()


async def extract_attendance(page):
    print("\n📅 Extracting attendance details...")

    try:
        # Extract attendance statuses for each session
        attendance_statuses = await page.evaluate('''() => {
            const sessions = Array.from(document.querySelectorAll('div.ant-card-body span'));
            return sessions.map(session => {
                const svg = session.querySelector('svg');
                if (!svg) return 'Not Marked';
                const fill = svg.getAttribute('fill');
                if (fill === 'green') return 'Present';
                if (fill === 'red') return 'Absent';
                return 'Not Marked'; // Default for unknown cases
            });
        }''')

        # Extract timestamp
        timestamp = await page.evaluate('''() => {
            const timestampElement = document.querySelector('div.ant-card-body p');
            return timestampElement ? timestampElement.innerText.trim() : "Timestamp not found";
        }''')

        print(f"📅 Attendance Timestamp: {timestamp}")
        print("\n📅 Attendance Status for Each Period:")
        for idx, status in enumerate(attendance_statuses, start=1):
            print(f"Session {idx}: {status}")

    except Exception as e:
        print(f"⚠️ Could not extract attendance details: {e}")


async def extract_timetable(page):
    print("\n📅 Extracting timetable details...")

    try:
        # Expand all collapsible sections (days of the week)
        print("🔄 Expanding all collapsible sections...")
        collapsible_headers_xpath = '//div[contains(@class, "ant-collapse-header")]'
        collapsible_headers = await page.xpath(collapsible_headers_xpath)
        for header in collapsible_headers:
            await header.click()
            await page.waitForSelector('div.ant-collapse-content-active')  # Wait for content to load
            await asyncio.sleep(2)  # Additional wait for dynamic content to load

        # Debugging: Take a screenshot to verify the DOM structure
        await page.screenshot({'path': 'timetable_expanded.png'})

        # Extract timetable data
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

        # Print extracted timetable data
        print("\n📅 Timetable:")
        for day in timetable_data:
            print(f"\nDay: {day['header']}")
            for row in day['rows']:
                print(" | ".join(row))

    except Exception as e:
        print(f"⚠️ Could not extract timetable details: {e}")


if __name__ == "__main__":
    mobile_number = input("📱 Enter your mobile number: ")
    asyncio.get_event_loop().run_until_complete(login_to_kmit_netra(mobile_number))