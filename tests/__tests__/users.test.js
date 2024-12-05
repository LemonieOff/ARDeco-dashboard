const puppeteer = require('puppeteer');

describe('Tests de la page des utilisateurs', () => {
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
    await page.goto('http://localhost:3001/users');
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
        page.click('a[href="/users"]')
      ]);
    } catch (error) {
      console.error('Erreur dans beforeEach:', error);
      throw error;
    }
  }, 60000);

  afterAll(async () => {
    await browser.close();
  });

  test('Vérification de la présence de la liste des utilisateurs', async () => {
    await page.waitForSelector('#users-list');
  }, 30000);

  test('Vérification de la présence de la liste des entreprises', async () => {
    await page.waitForSelector('#company-list');
  }, 30000);

  test('Vérification de la présence du bouton de déconnexion', async () => {
    const logoutButton = await page.$('#logoutButton');
    expect(logoutButton).not.toBeNull();
  }, 30000);

  test('Vérification du clic sur un user et redirection vers le détail', async () => {
    try {
      await page.waitForSelector('#users-list li a', { timeout: 60000 });
      
      const firstUserHref = await page.$eval('#users-list li a', el => el.getAttribute('href'));
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
        page.click('#users-list li a')
      ]);

      const url = page.url();
      expect(url).toContain('/user/');
      expect(url).toBe(`http://localhost:3001${firstUserHref}`);
    } catch (error) {
      console.error('Erreur dans le test de clic:', error);
      throw error;
    }
  }, 60000);

  test('Vérification du bouton de déconnexion', async () => {
    try {
      await page.waitForSelector('#logoutButton', { visible: true });
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('#logoutButton')
      ]);

      const url = page.url();
      expect(url).toBe('http://localhost:3001/');

      const uid = await page.evaluate(() => localStorage.getItem('uid'));
      const jwt = await page.evaluate(() => localStorage.getItem('jwt'));
      expect(uid).toBeNull();
      expect(jwt).toBeNull();

    } catch (error) {
      console.error('Erreur durant le test de déconnexion:', error);
      throw error;
    }
  }, 60000);

}); 