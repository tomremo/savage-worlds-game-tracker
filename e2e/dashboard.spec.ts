import { test, expect } from '@playwright/test';

test.describe('Wild Card Manager UI', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page before each test
    await page.goto('http://localhost:3000');
  });

  test('should display the character name and bennies', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Astreus Helvetica');
    // Check if Bennie tokens are present (Astreus has 3)
    const bennies = page.locator('div:text-is("B")');
    await expect(bennies).toHaveCount(3);
  });

  test('should open the roll overlay when clicking a trait', async ({ page }) => {
    // Click on Fighting skill specifically
    await page.getByText('Fighting:', { exact: true }).click();

    // Check if the overlay appears
    await expect(page.getByText('Fighting Roll')).toBeVisible();
    await expect(page.getByText('Trait Die')).toBeVisible();
    
    // Close the overlay
    await page.getByText('Accept Result').click();
    await expect(page.getByText('Fighting Roll')).not.toBeVisible();
  });

  test('should switch page views correctly', async ({ page }) => {
    // 1. By default we are on Page 1 (Front Side)
    await expect(page.getByText('Skills', { exact: true })).toBeVisible();
    await expect(page.getByText('Special Abilities', { exact: true })).not.toBeVisible();

    // 2. Click "Page 2: Back Side"
    await page.getByRole('button', { name: 'Page 2: Back Side' }).click();
    await expect(page.getByText('Special Abilities', { exact: true })).toBeVisible();
    await expect(page.getByText('Skills', { exact: true })).not.toBeVisible();

    // 3. Click "Side-By-Side View"
    await page.getByRole('button', { name: 'Side-By-Side View' }).click();
    await expect(page.getByText('Skills', { exact: true })).toBeVisible();
    await expect(page.getByText('Special Abilities', { exact: true })).toBeVisible();
  });
});
