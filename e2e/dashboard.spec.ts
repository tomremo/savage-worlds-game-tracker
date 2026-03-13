import { test, expect } from '@playwright/test';

test.describe('Wild Card Manager UI', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page before each test
    await page.goto('http://localhost:3000');
  });

  test('should display the character name and bennies', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Astreus Helvetica');
    // Check if Bennie tokens are present (Astreus has 3)
    const bennies = page.locator('div:text("B")');
    await expect(bennies).toHaveCount(3);
  });

  test('should open the roll overlay when clicking a trait', async ({ page }) => {
    // Click on Fighting skill
    await page.getByText('Fighting').click();

    // Check if the overlay appears
    await expect(page.getByText('Fighting Roll')).toBeVisible();
    await expect(page.getByText('Trait Die')).toBeVisible();
    
    // Close the overlay
    await page.getByText('Close').click();
    await expect(page.getByText('Fighting Roll')).not.toBeVisible();
  });

  test('should switch tabs correctly', async ({ page }) => {
    // Click on Gear tab
    await page.getByText('Gear').click();
    await expect(page.getByText('Equipment & Wealth')).toBeVisible();
    await expect(page.getByText('Bastard Sword')).toBeVisible();

    // Click on Edges tab
    await page.getByText('Edges').click();
    await expect(page.getByText('Edges')).toHaveCount(2); // Section title + tab label? No, check specific content
    await expect(page.getByText('Alertness')).toBeVisible();
  });
});
