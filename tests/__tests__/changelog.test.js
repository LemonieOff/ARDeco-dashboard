const puppeteer = require('puppeteer');

describe('Tests de la page du changelog', () => {
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
        page.click('a[href="/changelog"]')
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

  test('Vérification des éléments principaux de la page du changelog', async () => {
    try {
      await page.waitForSelector('.changelog-container');
      const title = await page.$eval('.card h2', el => el.textContent);
      expect(title).toBe('Changelog');

      await page.waitForSelector('#createVersionBtn');
      const createBtnText = await page.$eval('#createVersionBtn', el => el.textContent);
      expect(createBtnText).toBe('Créer une nouvelle version');

      await page.waitForSelector('#versionsList');
    } catch (error) {
      console.error('Erreur dans le test des éléments principaux:', error);
      throw error;
    }
  }, 60000);

  test('Vérification de la création d\'une nouvelle version', async () => {
    try {
      await page.click('#createVersionBtn');
      await page.waitForTimeout(1000);


      await page.type('#versionNumber', '1.0.0');
      await page.type('#versionName', 'Version Test');
      await page.type('#versionChanges', 'Test changement 1\nTest changement 2');

      await page.click('#versionForm button[type="submit"]');
      
      await page.waitForTimeout(1000);

      await page.waitForSelector('.version-item');
      const versionTitle = await page.$eval('.version-title', el => el.textContent);
      expect(versionTitle).toContain('1.0.0');
    } catch (error) {
      console.error('Erreur dans le test de création:', error);
      throw error;
    }
  }, 60000);

  test('Vérification de l\'expansion des versions', async () => {
    try {
      await page.waitForSelector('.version-item');
      
      const firstVersion = await page.$('.version-header');
      await firstVersion.click();

      const content = await page.$eval('.version-content', el => 
        el.classList.contains('expanded')
      );
      expect(content).toBe(true);
    } catch (error) {
      console.error('Erreur dans le test d\'expansion:', error);
      throw error;
    }
  }, 60000);

});