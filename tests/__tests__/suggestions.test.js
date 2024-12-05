const puppeteer = require('puppeteer');

describe('Tests de la page des suggestions', () => {
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
    await page.setDefaultNavigationTimeout(60000);
  }, 60000);

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
        page.click('a[href="/suggestions"]')
      ]);
    } catch (error) {
      console.error('Erreur dans beforeEach:', error);
      throw error;
    }
  }, 60000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  }, 60000);

  test('Vérification des éléments principaux de la page des suggestions', async () => {
    try {
      await page.waitForSelector('.feedback-container h3');
      const title = await page.$eval('.feedback-container h3', el => el.textContent);
      expect(title).toBe('Suggestions');

      await page.waitForSelector('#suggestionsList');
    } catch (error) {
      console.error('Erreur dans le test des éléments principaux:', error);
      throw error;
    }
  }, 60000);

  test('Vérification de l\'affichage des détails d\'une suggestion', async () => {
    try {
      await page.waitForSelector('.feedback-item');
      
      const firstSuggestion = await page.$('.feedback-header');
      await firstSuggestion.click();

      const content = await page.$eval('.feedback-content', el => 
        el.classList.contains('expanded')
      );
      expect(content).toBe(true);
    } catch (error) {
      console.error('Erreur dans le test d\'affichage des détails:', error);
      throw error;
    }
  }, 60000);
}); 