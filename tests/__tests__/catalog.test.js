const puppeteer = require('puppeteer');

describe('Tests de la page du catalogue', () => {
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

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
        page.click('a[href="/catalog"]')
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

  test('Vérification des éléments principaux de la page du catalogue', async () => {
    try {
      await page.waitForSelector('.card h2');
      const title = await page.$eval('.card h2', el => el.textContent);
      expect(title).toBe('Catalogue');

      await page.waitForSelector('#filter-btn');
      const filterBtnText = await page.$eval('#filter-btn', el => el.textContent);
      expect(filterBtnText).toContain('Filtres');

      await page.waitForSelector('#catalog');
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
      await page.waitForSelector('#color-filters');
      await page.waitForSelector('#room-filters');

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

  test('Vérification de l\'ajout d\'un nouveau produit', async () => {
    try {
        await page.waitForSelector('#catalog', { 
            visible: true,
            timeout: 60000 
        });

        await page.waitForTimeout(2000);

        const addButton = await page.waitForSelector('#add-btn', { 
            visible: true,
            timeout: 60000 
        });
        
        await addButton.click();
        
        await page.waitForTimeout(1000);
        console.log('test');
        
        await page.select('#add-company-id', '160');
        await page.type('#add-name', 'Test Produit');
        await page.type('#add-price', '199');
        await page.type('#add-height', '100');
        await page.type('#add-width', '50');
        await page.type('#add-depth', '50');
        await page.type('#add-object-id', 'TEST123');
        await page.type('#add-company-name', 'Test Company');


        const styleTag = await page.$('#add-styles .tag');
        await styleTag.click();

        const roomTag = await page.$('#add-rooms .tag');
        await roomTag.click();

        const colorTag = await page.$('#add-colors .tag');
        await colorTag.click();
        await page.type('#add-colors-model-id-' + await colorTag.evaluate(el => el.textContent), '1');

        await page.click('.modal-footer button');
    } catch (error) {
        console.error('Erreur dans le test d\'ajout:', error);
        throw error;
    }
  }, 60000);

  test('Vérification du changement de visibilité d\'un produit', async () => {
    try {
      await page.waitForSelector('button[onclick*="changeVisibility"]');
      const visibilityButton = await page.$('button[onclick*="changeVisibility"]');
      const initialText = await visibilityButton.evaluate(el => el.textContent);
      
      await visibilityButton.click();
      await page.waitForTimeout(1000);

      const updatedButton = await page.$('button[onclick*="changeVisibility"]');
      const updatedText = await updatedButton.evaluate(el => el.textContent);
      
      expect(updatedText).not.toBe(initialText);

    } catch (error) {
      console.error('Erreur dans le test de changement de visibilité:', error);
      throw error;
    }
  }, 60000);

  test('Vérification de l\'archivage d\'un produit', async () => {
    try {
      await page.waitForSelector('button[onclick*="archiverProduit"]');
      const archiveButton = await page.$('button[onclick*="archiverProduit"]');
      
      page.on('dialog', async dialog => {
        await dialog.accept();
      });

      await archiveButton.click();
      await page.waitForTimeout(1000);

      const archivedProduct = await page.$eval('.product', el => el.innerHTML);
      expect(archivedProduct).toContain('Archivé');

    } catch (error) {
      console.error('Erreur dans le test d\'archivage:', error);
      throw error;
    }
  }, 60000);

  test('Vérification du mode sombre', async () => {
    try {
      await page.waitForSelector('#mode-toggle');
      await page.click('#mode-toggle');
      
      const isDarkMode = await page.$eval('body', el => 
        el.classList.contains('dark-mode')
      );
      expect(isDarkMode).toBe(true);

      // Revenir au mode clair
      await page.click('#mode-toggle');
      const isLightMode = await page.$eval('body', el => 
        !el.classList.contains('dark-mode')
      );
      expect(isLightMode).toBe(true);

    } catch (error) {
      console.error('Erreur dans le test du mode sombre:', error);
      throw error;
    }
  }, 60000);
}); 