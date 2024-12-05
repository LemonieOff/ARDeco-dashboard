const puppeteer = require('puppeteer');

describe('Tests d\'authentification', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      ignoreHTTPSErrors: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-dev-shm-usage'
      ],
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    });
    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
  }, 30000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  }, 30000);

  test('Tentative de connexion avec des identifiants valides', async () => {
    try {
      await page.goto('http://localhost:3001', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      await page.waitForSelector('input[name="email"]');
      await page.waitForSelector('input[name="password"]');
      
      await page.type('input[name="email"]', 'louis@lv.com');
      await page.type('input[name="password"]', 'coucou');
      
      await page.click('button[type="submit"]');
      
      await page.waitForNavigation({
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      const url = page.url();
      expect(url).toContain('/dashboard');
    } catch (error) {
      console.error('Erreur durant le test:', error);
      throw error;
    }
  }, 30000);

  test('Tentative de connexion avec des identifiants invalides', async () => {
    try {
      await page.goto('http://localhost:3001', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      await page.waitForSelector('input[name="email"]');
      await page.waitForSelector('input[name="password"]');
      
      await page.type('input[name="email"]', 'test@invalid.com');
      await page.type('input[name="password"]', 'aze');
      
      await page.click('button[type="submit"]');
      
      await page.waitForSelector('#errorDiv b', { visible: true, timeout: 30000 });
      
      const errorMessage = await page.$eval('#errorDiv b', el => el.innerText);
      expect(errorMessage).toBe('Un compte administrateur est requis');
    } catch (error) {
      console.error('Erreur durant le test:', error);
      throw error;
    }
  }, 30000);
});