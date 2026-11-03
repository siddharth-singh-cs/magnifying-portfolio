import sys
import os
import time
from playwright.sync_api import sync_playwright

def run_tests():
    os.makedirs("test_screenshots", exist_ok=True)
    html_path = os.path.abspath("index.html")
    file_url = f"file:///{html_path.replace(os.sep, '/')}"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # Test 1: Desktop 1440x900
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto(file_url)
        page.wait_for_timeout(1000)
        page.screenshot(path="test_screenshots/desktop_1440x900.png")
        print("Desktop screenshot captured")

        # Test 2: Tablet 768x1024
        page_tablet = browser.new_page(viewport={"width": 768, "height": 1024})
        page_tablet.goto(file_url)
        page_tablet.wait_for_timeout(1000)
        page_tablet.screenshot(path="test_screenshots/tablet_768x1024.png")
        print("Tablet screenshot captured")

        # Test 3: Mobile 390x844
        page_mobile = browser.new_page(viewport={"width": 390, "height": 844})
        page_mobile.goto(file_url)
        page_mobile.wait_for_timeout(1000)
        page_mobile.screenshot(path="test_screenshots/mobile_390x844.png")
        print("Mobile screenshot captured")

        # Test 4: Open Work Dialog on Desktop
        page.click("#btn-see-work")
        page.wait_for_timeout(500)
        page.screenshot(path="test_screenshots/dialog_work.png")
        print("Work dialog screenshot captured")

        # Close Work dialog
        page.keyboard.press("Escape")
        page.wait_for_timeout(300)

        # Test 5: Move magnifier to uncover secrets
        # Move mouse to secret area
        secret_box = page.locator("#secret-item-0").bounding_box()
        if secret_box:
            page.mouse.move(secret_box["x"] + secret_box["width"]/2, secret_box["y"] + secret_box["height"]/2)
            page.wait_for_timeout(600)
            page.screenshot(path="test_screenshots/magnifier_on_secret.png")
            print("Magnifier on secret screenshot captured")

        browser.close()
        print("All tests completed successfully!")

if __name__ == "__main__":
    run_tests()

