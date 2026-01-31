// generate a PDF buffer from HTML template
import puppeteer from 'puppeteer';

export async function generateEscrowPdf(invoice, escrow) {
  const html = "/* render your HTML template with data */";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const buffer = await page.pdf({ format: 'A4' });
  await browser.close();
  return buffer;
}
