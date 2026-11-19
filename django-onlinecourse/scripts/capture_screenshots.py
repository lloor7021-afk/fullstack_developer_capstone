"""Capture genuine screenshots by operating the live Django site in Chrome.

Executed in GitHub Actions after migrations, demo-data setup and server startup.
"""
import os
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE = os.environ.get('APP_URL', 'http://127.0.0.1:8000')
OUT = Path('evidence')
OUT.mkdir(exist_ok=True)
opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--no-sandbox')
opts.add_argument('--disable-dev-shm-usage')
opts.add_argument('--disable-gpu')
opts.add_argument('--window-size=1440,1100')
driver = webdriver.Chrome(options=opts)
wait = WebDriverWait(driver, 20)
try:
    driver.set_window_size(1440, 1100)
    driver.get(BASE + '/admin/login/?next=/admin/')
    wait.until(EC.visibility_of_element_located((By.NAME, 'username'))).send_keys(
        os.environ.get('DEMO_ADMIN_USERNAME', 'admin'))
    driver.find_element(By.NAME, 'password').send_keys(os.environ['DEMO_ADMIN_PASSWORD'])
    driver.find_element(By.CSS_SELECTOR, 'input[type=submit]').click()
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '#content')))
    if 'Authentication and Authorization' not in driver.page_source:
        raise RuntimeError('Django Admin auth section was not shown.')
    if 'OnlineCourse' not in driver.page_source:
        raise RuntimeError('Django Admin OnlineCourse section was not shown.')
    driver.save_screenshot(str(OUT / '03-admin-site.png'))
    print('Saved authentic admin screenshot:', OUT / '03-admin-site.png')

    # Explicitly log out of admin and log in as an ordinary learner.
    driver.get(BASE + '/admin/logout/')
    driver.delete_all_cookies()
    driver.get(BASE + '/onlinecourse/login/')
    wait.until(EC.visibility_of_element_located((By.NAME, 'username'))).send_keys('student')
    driver.find_element(By.NAME, 'psw').send_keys(os.environ['DEMO_STUDENT_PASSWORD'])
    driver.find_element(By.CSS_SELECTOR, 'button[type=submit], form button').click()
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.hero-panel')))
    # Demo course is seeded with 3 questions, with the first choice correct for each.
    driver.find_element(By.CSS_SELECTOR, 'a[href*="/onlinecourse/"][href$="/"]').click()
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'fieldset[data-question]')))
    for fieldset in driver.find_elements(By.CSS_SELECTOR, 'fieldset[data-question]'):
        fieldset.find_element(By.CSS_SELECTOR, 'input[type="checkbox"]').click()
    driver.find_element(By.XPATH, '//button[contains(., "Submit exam")]').click()
    wait.until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, '[role="status"]'), 'Congratulations!'))
    if '100%' not in driver.page_source or 'Exam results' not in driver.page_source:
        raise RuntimeError('Expected successful exam score and details were not shown.')
    time.sleep(0.75)
    driver.save_screenshot(str(OUT / '07-final.png'))
    print('Saved authentic passing result screenshot:', OUT / '07-final.png')
finally:
    driver.quit()
