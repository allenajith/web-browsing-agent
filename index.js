const { chromium } = require('playwright');

(async () => {

    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://duckduckgo.com');
    //await page.fill('textarea[name = "q"]', 'best supercars 2024'); for google
    await page.click('input[name="q"]'); 
    await page.waitForTimeout(500);
    await page.keyboard.type('best supercars 2026',{delay: 100});
    await page.keyboard.press('Enter');
    await page.waitForSelector('h2 a');
    const results = await page.$$('h2 a');
    console.log('\nSearch results: \n');
    for (let i=0;i<results.length;i++) {
        const title = await results[i].innerText();
        const link = await results[i].getAttribute('href');

        console.log(`${i + 1}. ${title}`);
        console.log(`   ${link}\n`);
    }
    await browser.close();
})();