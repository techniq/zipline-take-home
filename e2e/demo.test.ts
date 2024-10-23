import { expect, test } from '@playwright/test';

test('home page has expected AppBar', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.AppBar')).toBeVisible();
});
