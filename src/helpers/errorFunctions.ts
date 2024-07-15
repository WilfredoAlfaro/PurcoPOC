import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotPath = path.join('screenshots', `${name}-${timestamp}.png`);
  await fs.promises.mkdir('screenshots', { recursive: true });
  await page.screenshot({ path: screenshotPath });
  console.log(`Screenshot saved: ${screenshotPath}`);
}