const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Desktop
  await page.setViewportSize({ width: 1280, height: 2500 });
  await page.goto('http://localhost:8000/index.html');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'final_desktop_review.png', fullPage: true });

  // Mobile
  await page.setViewportSize({ width: 375, height: 2500 });
  await page.goto('http://localhost:8000/index.html');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'final_mobile_review.png', fullPage: true });

  await browser.close();
})();
