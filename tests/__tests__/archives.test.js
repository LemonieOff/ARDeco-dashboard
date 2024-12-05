const puppeteer = require('puppeteer');

describe('Tests de la page des archives', () => {
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
      ]
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3001/archives');
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    try {
      await page.goto('http://localhost:3001', {
        waitUntil: 'networkidle0',
        timeout: 60000
      });
      
      await page.waitForSelector('input[name="email"]');
      await page.waitForSelector('input[name="password"]');
      
      await page.type('input[name="email"]', 'louis@lv.com');
      await page.type('input[name="password"]', 'coucou');
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('button[type="submit"]')
      ]);

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('a[href="/archives"]')
      ]);
    } catch (error) {
      console.error('Erreur dans beforeEach:', error);
      throw error;
    }
  }, 60000);

  test('Vérification de la présence de la liste des companies et leur archives', async () => {
    await page.waitForSelector('#companies-list');
  });

  test('Vérification de la déconnexion', async () => {
    await page.waitForSelector('#logoutButton', { visible: true });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('#logoutButton')
    ]);
    const url = page.url();
    expect(url).toBe('http://localhost:3001/');
  }, 30000);
}); 