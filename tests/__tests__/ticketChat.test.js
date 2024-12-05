const puppeteer = require('puppeteer');

describe('Tests de la page ticket chat', () => {
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
      
      await page.waitForSelector('input[name="email"]', { timeout: 60000 });
      await page.waitForSelector('input[name="password"]', { timeout: 60000 });
      
      await page.type('input[name="email"]', 'louis@lv.com');
      await page.type('input[name="password"]', 'coucou');
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
        page.click('button[type="submit"]')
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

  test('Vérification du clic sur un ticket et redirection vers le chat', async () => {
    try {
      await page.waitForSelector('#open-tickets-list li a', { timeout: 60000 });
      
      const firstTicketHref = await page.$eval('#open-tickets-list li a', el => el.getAttribute('href'));
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
        page.click('#open-tickets-list li a')
      ]);

      const url = page.url();
      expect(url).toContain('/ticket/');
      expect(url).toBe(`http://localhost:3001${firstTicketHref}`);
    } catch (error) {
      console.error('Erreur dans le test de clic:', error);
      throw error;
    }
  }, 60000);

  test('Vérification des éléments de la page de chat', async () => {
    try {
      await page.waitForSelector('#open-tickets-list li a', { timeout: 60000 });
      const firstTicketHref = await page.$eval('#open-tickets-list li a', el => el.getAttribute('href'));
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
        page.click('#open-tickets-list li a')
      ]);

      await page.waitForSelector('.ticket-info', { timeout: 60000 });
      await page.waitForSelector('#messages-list', { timeout: 60000 });
      await page.waitForSelector('#answer', { timeout: 60000 });
      await page.waitForSelector('#sendButton', { timeout: 60000 });
      await page.waitForSelector('#closeButton', { timeout: 60000 });
      await page.waitForSelector('#deleteButton', { timeout: 60000 });

      const sendButtonText = await page.$eval('#sendButton', el => el.textContent);
      const closeButtonText = await page.$eval('#closeButton', el => el.textContent);
      const deleteButtonText = await page.$eval('#deleteButton', el => el.textContent);

      expect(sendButtonText).toBe('Répondre');
      expect(closeButtonText).toBe('Fermer le ticket');
      expect(deleteButtonText).toBe('Supprimer le ticket');
    } catch (error) {
      console.error('Erreur dans le test des éléments:', error);
      throw error;
    }
  }, 60000);

  test('Vérification de l\'envoi d\'un message', async () => {
    try {
      await page.waitForSelector('#open-tickets-list li a', { timeout: 60000 });
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
        page.click('#open-tickets-list li a')
      ]);

      const testMessage = 'Test message automatique';
      await page.waitForSelector('#answer', { timeout: 60000 });
      await page.type('#answer', testMessage);
      await page.click('#sendButton');

      await page.waitForTimeout(2000); 
      
      const messages = await page.$$eval('.message', msgs => 
        msgs.map(msg => msg.textContent)
      );
      
      const lastMessage = messages[messages.length - 1];
      expect(lastMessage).toContain(testMessage);
    } catch (error) {
      console.error('Erreur dans le test d\'envoi de message:', error);
      throw error;
    }
  }, 60000);
});