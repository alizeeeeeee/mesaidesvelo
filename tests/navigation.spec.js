import { test, expect } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test('Navigation scenario', async ({ page }) => {
	await page.goto(baseUrl);

	await page.click('[placeholder*="Commune"]');
	await page.fill('[placeholder*="Commune"]', 'stra');
	await page.click('.autocomplete-list-item:first-child');
	await expect(page).toHaveURL(baseUrl + '/ville/strasbourg');

	// Hide evaporate animation
	await page.addStyleTag({
		content: '.evaporate { display: none !important; }'
	});

	await page.click('text=Achat d’un vélo électrique');
	const totalAides = page.locator('text=Total des aides >> ..');
	await expect(totalAides).toHaveText('Total des aides 700 €', { useInnerText: true });

	await page.click('label:last-child');
	await expect(totalAides).toHaveText('Total des aides 300 €', { useInnerText: true });

	await page.fill('input:below(label:text("Prix du vélo"))', '100');
	await expect(totalAides).toHaveText('Total des aides 50 €', { useInnerText: true });
});

test('Liste aides do not crash', async ({ page }) => {
	await page.goto(baseUrl + '/liste-aides');
	await expect(page.locator('h1')).toHaveText('Les aides intégrées sur le site');
});
