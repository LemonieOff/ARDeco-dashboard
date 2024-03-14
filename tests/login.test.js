const puppeteer = require('puppeteer');

describe('Page HTML Test', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('le titre de la page doit être correct', async () => {
        await page.goto('http://localhost:3001/');
        const title = await page.title();
        expect(title).toBe('Login');
    });

    test('fill the form wrong values and submit', async () => {
        await page.goto('http://localhost:3001/');
        await page.type('input[type="text"]', 'louis@lv.com'); // Modifier le sélecteur selon votre HTML
        await page.type('input[type="password"]', 'ezez'); // Modifier le sélecteur selon votre HTML
        await page.click('button[type=submit]');
        await page.waitForSelector('#errorDiv b', {timeout: 10000});
        const errorMessage = await page.$eval('#errorDiv b', e => e.innerHTML);
        expect(errorMessage).toBe('Admin login required');
    });
});
