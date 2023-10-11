import puppeteer from "puppeteer";
import * as fs from "fs";

const run = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url); // visit page

  const inputElements = await page.$$(
    "input:not([type='hidden']):not([type='submit']):not([type='button'])"
  );
  const selectElements = await page.$$("select");

  const inputInfo = {
    components: {
      schemas: {},
    },
  };

  for (const inputElement of inputElements) {
    const name = await page.evaluate((el) => el.id, inputElement);
    const type = await page.evaluate((el) => el.type, inputElement);
    inputInfo.components.schemas[name] = { type };
  }

  for (const selectElement of selectElements) {
    const name = await page.evaluate((el) => el.id, selectElement);
    inputInfo.components.schemas[name] = { type: "select" };
  }

  console.log(inputInfo);
  fs.writeFile("scraped.json", JSON.stringify(inputInfo), (err) => {
    if (err) throw err;
    console.log("file saved");
  });
  browser.close();
};

run("https://www.calculator.net/bmi-calculator.html");
// run("http://127.0.0.1:5500/input.html");
// run("https://quotes.toscrape.com/search.aspx");
