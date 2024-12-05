const puppeteer = require('puppeteer');

describe('Tests du tableau de bord', () => {
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

  beforeEach(async () => {
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
  }, 30000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  }, 30000);

  test('Vérification de la présence de la sidebar', async () => {
    await page.waitForSelector('.sidebar', { visible: true });
    const sidebarTitle = await page.$eval('.sidebar h2', el => el.textContent);
    expect(sidebarTitle).toBe('ARDeco Administration');
  }, 30000);

  test('Vérification de la présence du contenu principal', async () => {
    await page.waitForSelector('.main-content', { visible: true });
  }, 30000);

  test('Vérification de la présence du graphique de priorité', async () => {
    await page.waitForSelector('#priority-chart');
  }, 30000);

  test('Vérification de la présence du graphique de la semaine', async () => {
    await page.waitForSelector('#week-chart');
  }, 30000);

  test('Vérification de la présence de la liste des tickets ouverts', async () => {
    await page.waitForSelector('#open-tickets-list');
  }, 30000);

  test('Vérification de la présence du bouton de déconnexion', async () => {
    const logoutButton = await page.$('#logoutButton');
    expect(logoutButton).not.toBeNull();
  }, 30000);

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