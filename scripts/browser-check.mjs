import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto(process.env.TEST_BASE_URL || 'http://127.0.0.1:5188', { waitUntil: 'domcontentloaded' });
await page.locator('.package-card').first().waitFor();
await page.evaluate(() => document.fonts.ready);
await page.locator('img[src^="/"]').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
await page.waitForFunction(() => [...document.querySelectorAll('img[src^="/"]')].every(image => image.complete));
await page.screenshot({ path: 'artifacts/desktop.png', fullPage: true });
assert.equal(await page.locator('h1').count(), 1);
assert.equal(await page.locator('.package-card').count(), 3);
await page.getByRole('tab', { name: 'Gold 5 Star', exact: true }).click();
assert.equal(await page.locator('.package-card').count(), 1);
await page.getByRole('button', { name: 'View details of The Golden Journey' }).click();
await page.getByRole('dialog').waitFor();
await page.getByRole('button', { name: 'Request this journey' }).click();
assert.equal(await page.locator('select[name=service]').inputValue(), 'Group Umrah');
assert.match(await page.getByLabel('Journey details').inputValue(), /Golden Journey/);
await page.getByRole('button', { name: 'Prepare my quote request' }).click();
assert.equal(await page.locator('[aria-invalid="true"]').count(), 3);
await page.getByLabel('Full name', { exact: false }).fill('Test Traveller');
await page.getByLabel('Email address', { exact: false }).fill('traveller@example.com');
await page.getByLabel('Phone number', { exact: false }).fill('+92 300 1234567');
await page.getByRole('button', { name: 'Prepare my quote request' }).click();
await page.getByRole('heading', { name: 'Your request is ready to send' }).waitFor();
const whatsapp = new URL(await page.getByRole('link', { name: 'Send via WhatsApp' }).getAttribute('href'));
assert.equal(whatsapp.hostname, 'wa.me');
assert.match(whatsapp.searchParams.get('text'), /Test Traveller/);
await page.locator('.catalog-search > summary').click();
await page.getByLabel('Departure month', { exact: true }).selectOption('2027-03');
await page.getByRole('tab', { name: 'Platinum 5 Star', exact: true }).click();
await page.getByRole('button', { name: 'Show all packages' }).waitFor();
await page.getByRole('button', { name: 'Show all packages' }).click();
assert.equal(await page.locator('.package-card').count(), 3);
await page.getByRole('button', { name: 'View all packages' }).click();
assert.equal(await page.locator('.package-card').count(), 4);

await page.getByRole('tab', { name: 'Flights & Visa', exact: true }).click();
await page.getByRole('heading', { name: 'Flight and visa planning' }).waitFor();
await page.getByRole('tab', { name: 'Flights & Visa', exact: true }).press('ArrowRight');
await page.getByRole('heading', { name: 'Travel comfortably between destinations' }).waitFor();
await page.getByRole('tab', { name: 'Hotels', exact: true }).click();
await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('button', { name: 'Umrah', exact: true }).click();
await page.getByRole('link', { name: 'Silver 4 Star Umrah', exact: true }).click();
assert.equal(await page.locator('.package-card').count(), 1);
await page.getByRole('tab', { name: 'All Packages', exact: true }).click();
const sectionOrder = await page.locator('main h2').allTextContents();
assert.deepEqual(sectionOrder.slice(0, 7), ['All Upcoming Umrah Packages', 'Explore our Umrah Services', 'Upcoming Special Umrah Packages', 'Stories from our Travellers', 'Plan ahead for Hajj 2027', 'Why Choose Rihla?', 'Let’s plan your next journey']);

for (const width of [1440, 1024, 768, 390, 320]) {
  await page.setViewportSize({ width, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  assert.ok(dimensions.scroll <= dimensions.viewport, `Overflow at ${width}px: ${dimensions.scroll}`);
  if (width === 390) {
    await page.screenshot({ path: 'artifacts/mobile.png', fullPage: true });
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Hajj 2027' }).click();
    await page.getByRole('button', { name: 'Register interest for Hajj 2027' }).click();
    assert.equal(await page.locator('select[name=service]').inputValue(), 'Hajj 2027');
    await page.getByRole('button', { name: 'Open quick actions' }).click();
    await page.getByRole('button', { name: 'Custom Umrah Request' }).click();
    assert.equal(await page.locator('select[name=service]').inputValue(), 'Custom Umrah');
  }
}
assert.deepEqual(errors, [], 'No browser runtime errors');
await browser.close();
console.log('Browser checks passed: package filters, dialog handoff, validation, WhatsApp, service tabs/keyboard navigation, Umrah dropdown, section order, mobile navigation, floating CTAs, and overflow at 5 widths.');

