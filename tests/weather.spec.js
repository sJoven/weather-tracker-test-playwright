const { test, expect } = require('@playwright/test');

test.describe('Weather Tracker App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Page loads successfully with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Weather Tracker App/);

    await expect(page.locator('h1')).toHaveText('Weather Tracker App');
    await expect(page.locator('#cityInput')).toBeVisible();
    await expect(page.locator('#searchBtn')).toBeVisible();
    await expect(page.locator('.recent-cities h3')).toHaveText('Recent Searches');
  });

  test('Searching for a valid city displays weather data', async ({ page }) => {
    await page.fill('#cityInput', 'Tokyo');
    await page.click('#searchBtn');

    await expect(page.locator('#weatherDisplay')).toBeVisible();

    await expect(page.locator('#cityName')).toHaveText('Tokyo');
    await expect(page.locator('#temperature')).toContainText('°C'); 
    await expect(page.locator('#description')).toBeVisible(); 
    await expect(page.locator('#humidity')).toContainText('Humidity:');
    await expect(page.locator('#windSpeed')).toContainText('Wind:'); 
    await expect(page.locator('#weatherIcon')).toBeVisible(); 
  });

  test('Searching for an invalid city displays an error message', async ({ page }) => {
    await page.fill('#cityInput', 'InvalidCity123');
    await page.click('#searchBtn');

    await expect(page.locator('#errorMsg')).toBeVisible();
    await expect(page.locator('#errorMsg')).toContainText(/City not found/);

    await expect(page.locator('#weatherDisplay')).toBeHidden();
  });

  test('Recent searches are saved and displayed as clickable buttons', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());

    await page.fill('#cityInput', 'London');
    await page.click('#searchBtn');
    await expect(page.locator('#weatherDisplay')).toBeVisible();

    await expect(page.locator('.recent-btn')).toHaveCount(1);
    await expect(page.locator('.recent-btn')).toHaveText('London');

    await page.fill('#cityInput', 'New York');
    await page.click('#searchBtn');
    await expect(page.locator('#weatherDisplay')).toBeVisible();

    await expect(page.locator('.recent-btn')).toHaveCount(2);
    await expect(page.locator('.recent-btn:nth-child(1)')).toHaveText('New York');
    await expect(page.locator('.recent-btn:nth-child(2)')).toHaveText('London');

    await page.fill('#cityInput', 'Paris');
    await page.click('#searchBtn');
    await expect(page.locator('#weatherDisplay')).toBeVisible();

    await expect(page.locator('.recent-btn')).toHaveCount(3);
    await expect(page.locator('.recent-btn:nth-child(1)')).toHaveText('Paris');
    await expect(page.locator('.recent-btn:nth-child(2)')).toHaveText('New York');
    await expect(page.locator('.recent-btn:nth-child(3)')).toHaveText('London');
  });

  test('Clicking a saved recent city reloads the correct weather data', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());

    await page.fill('#cityInput', 'Sydney');
    await page.click('#searchBtn');
    await expect(page.locator('#weatherDisplay')).toBeVisible();
    await expect(page.locator('#cityName')).toHaveText('Sydney');

    await page.click('.recent-btn');
    await expect(page.locator('#weatherDisplay')).toBeVisible();
    await expect(page.locator('#cityName')).toHaveText('Sydney'); 

    await expect(page.locator('#temperature')).toContainText('°C');
    await expect(page.locator('#description')).toBeVisible();
  });
});