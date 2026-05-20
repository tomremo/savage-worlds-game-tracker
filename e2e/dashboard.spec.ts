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

  test('should toggle 3D dice rolling ON and OFF', async ({ page }) => {
    const toggleBtn = page.getByRole('button', { name: /3D Dice:/ });
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toContainText('3D Dice: ON');

    // Click to toggle OFF
    await toggleBtn.click();
    await expect(toggleBtn).toContainText('3D Dice: OFF');

    // Click to toggle ON again
    await toggleBtn.click();
    await expect(toggleBtn).toContainText('3D Dice: ON');
  });

  test('should display 3D canvas and tumbling indicator when 3D dice is ON', async ({ page }) => {
    // Ensure 3D dice is ON (default state)
    const toggleBtn = page.getByRole('button', { name: /3D Dice:/ });
    await expect(toggleBtn).toContainText('3D Dice: ON');

    // Click on Fighting skill specifically
    await page.getByText('Fighting:', { exact: true }).click();

    // Check if the overlay and canvas appear during rolling phase
    await expect(page.getByText('Fighting Roll')).toBeVisible();
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.getByText('Tumbling Dice...')).toBeVisible();

    // After animation finishes (1.2s), the final result and accept button should appear
    await expect(page.getByRole('button', { name: 'Accept Result' })).toBeVisible({ timeout: 4000 });
    
    // Close the overlay
    await page.getByRole('button', { name: 'Accept Result' }).click();
    await expect(page.getByText('Fighting Roll')).not.toBeVisible();
  });

  test('should open the roll overlay instantly when 3D dice is OFF', async ({ page }) => {
    // Toggle 3D dice OFF
    const toggleBtn = page.getByRole('button', { name: /3D Dice:/ });
    await toggleBtn.click();
    await expect(toggleBtn).toContainText('3D Dice: OFF');

    // Click on Fighting skill specifically
    await page.getByText('Fighting:', { exact: true }).click();

    // Check if the overlay appears and Accept Result button is visible INSTANTLY
    await expect(page.getByText('Fighting Roll')).toBeVisible();
    await expect(page.locator('canvas')).not.toBeVisible();
    await expect(page.getByText('Tumbling Dice...')).not.toBeVisible();
    await expect(page.getByText('Trait Die')).toBeVisible();
    
    // Close the overlay
    await page.getByRole('button', { name: 'Accept Result' }).click();
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
