import puppeteer from "puppeteer";

export const run = async (url, config) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  await browser.close();
};

run("https://google.com");
