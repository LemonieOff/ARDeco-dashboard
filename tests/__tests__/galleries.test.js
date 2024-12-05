const puppeteer = require('puppeteer');

describe('Tests de la page des galeries', () => {
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
        page.click('a[href="/galleries"]')
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

  test('Vérification des éléments principaux de la page', async () => {
    try {
      await page.waitForSelector('.galleries-container h2');
      const title = await page.$eval('.galleries-container h2', el => el.textContent);
      expect(title).toBe('Galeries');

      await page.waitForSelector('#filter-btn');
      const filterBtnText = await page.$eval('#filter-btn', el => el.textContent);
      expect(filterBtnText).toContain('Filtres');

      await page.waitForSelector('#galleries-list');
    } catch (error) {
      console.error('Erreur dans le test des éléments principaux:', error);
      throw error;
    }
  }, 60000);

  test('Vérification du fonctionnement des filtres', async () => {
    try {
      await page.click('#filter-btn');
      await page.waitForSelector('.filter-popup', { visible: true });

      await page.waitForSelector('#style-filters');
      await page.waitForSelector('#room-filters');
      await page.waitForSelector('#reports-filter');

      const firstStyleTag = await page.$('#style-filters .tag');
      await firstStyleTag.click();
      expect(await firstStyleTag.evaluate(el => el.classList.contains('selected'))).toBe(true);

      await page.click('.filter-popup-content button');
      await page.waitForSelector('.filter-popup', { hidden: true });
    } catch (error) {
      console.error('Erreur dans le test des filtres:', error);
      throw error;
    }
  }, 60000);

  test('Vérification de l\'expansion des galeries', async () => {
    try {
      await page.waitForSelector('.gallery-item');
      
      const firstGallery = await page.$('.gallery-header');
      await firstGallery.click();

      const content = await page.$eval('.gallery-content', el => 
        el.classList.contains('expanded')
      );
      expect(content).toBe(true);
    } catch (error) {
      console.error('Erreur dans le test d\'expansion:', error);
      throw error;
    }
  }, 60000);

  test('Vérification des détails d\'une galerie', async () => {
    try {
      await page.waitForSelector('.gallery-item', { timeout: 60000 });
      
      const firstGalleryHeader = await page.waitForSelector('.gallery-header', { timeout: 60000 });
      await firstGalleryHeader.click();
      await page.waitForTimeout(1000);

      await page.waitForSelector('.gallery-content.expanded', { timeout: 60000 });
      const buttons = await page.$$('.gallery-content.expanded .gallery-button');
      let detailsButton = null;
      
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent);
        if (text.includes('Détails')) {
          detailsButton = button;
          break;
        }
      }

      if (!detailsButton) {
        throw new Error('Bouton Détails non trouvé');
      }

      await detailsButton.click();
      
      const modal = await page.waitForSelector('.modal', { 
        visible: true, 
        timeout: 60000 
      });

      if (!modal) {
        throw new Error('Modal non trouvée après le clic sur Détails');
      }

      const detailsContent = await page.$eval('#galleryDetails', el => el.innerHTML);
      expect(detailsContent).toContain('Détails de la galerie');

      const closeButton = await page.waitForSelector('.close', { timeout: 60000 });
      await closeButton.click();
      await page.waitForSelector('.modal', { hidden: true, timeout: 60000 });
    } catch (error) {
      console.error('Erreur dans le test des détails:', error);
      throw error;
    }
  }, 120000);

  test('Vérification du changement de visibilité', async () => {
    try {
      await page.waitForSelector('.gallery-item');
      
      await page.click('.gallery-header');
      
      const visibilityButton = await page.waitForSelector('button[onclick*="toggleVisibility"]');
      await visibilityButton.click();
      
      await page.waitForTimeout(1000);
      
      const galleryExists = await page.$('.gallery-item');
      expect(galleryExists).not.toBeNull();
    } catch (error) {
      console.error('Erreur dans le test de changement de visibilité:', error);
      throw error;
    }
  }, 60000);
}); 