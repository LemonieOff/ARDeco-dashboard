const puppeteer = require('puppeteer');

describe('Test de connexion', () => {
  let navigateur;
  let page;

  beforeAll(async () => {
    navigateur = await puppeteer.launch();
    page = await navigateur.newPage();
  });

  afterAll(async () => {
    await navigateur.close();
  });

  test('Connexion réussie avec des identifiants valides', async () => {
    await page.goto('http://localhost:3001');
    
    
    await page.type('input[name="email"]', 'louis@lv.com');
    await page.type('input[name="password"]', 'coucou');
    
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    // Vérifier si le localStorage a été mis à jour avec le JWT
    const jwt = await page.evaluate(() => localStorage.getItem('jwt'));
    expect(jwt).toBeTruthy();

    const url = page.url();
    expect(url).toBe('http://localhost:3001/dashboard');
  }, 20000);
});

