import { configDotenv } from "dotenv";
import puppeteer from "puppeteer";
import { createSchema } from "../helpers/createSchema.js";
import { schema } from "../schema/schema.js";
import { createJSON } from "../helpers/createJSON.js";
import { generateXLSX } from "../helpers/generateXLSX.js";
import { isNumber } from "../helpers/isNumber.js";

configDotenv();

/**
 * Scrapes a web page for input and select elements, creates a JSON object
 * based on the scraped data, and generates an XLSX file.
 *
 * @param {string} url - The URL of the web page to scrape.
 * @param {string} [jsonName="output"] - The name of the JSON file to create (Default = "output").
 * @param {string} [xlsxName="output"] - The name of the XLSX file to create (Default = "output").
 * @param {number} [rows=2] - The number of rows to generate in the XLSX file (Default = 2).
 * @return {undefined} This function does not return a value.
 */

const run = async (url, jsonName = "output", xlsxName = "output", rows = 2) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // scrap the web
  try {
    await page.goto(url); // visit page

    // Get all <input> elements without hidden/submit/button type
    const inputElements = await page.$$(
      "input:not([type='hidden']):not([type='submit']):not([type='button'])"
    );

    const selectElements = await page.$$("select"); //Get all <select> elements

    // loop through the inputElements array
    for (const inputElement of inputElements) {
      const name = await page.evaluate((el) => el.name, inputElement); // get the input element name
      const id = await page.evaluate((el) => el.id, inputElement); // get the input element id
      const type = await page.evaluate((el) => el.type, inputElement); // get the input element type

      // check if the input element type is checkbox/radio
      if (type === "checkbox" || type === "radio") {
        // If it is, then get all label elements with attribute for == id of the input element
        const label = await page.evaluate(
          (id) => document.querySelector(`label[for="${id}"]`).textContent,
          id
        );
        // create inputSchema for the labels
        const inputSchema = createSchema("string", [label]);

        // check if the key is already exist in the schema
        if (schema.components.schemas[name]) {
          schema.components.schemas[name].values.push(label); // If exist, then add the values to the key
        } else {
          schema.components.schemas[name] = inputSchema; // else, create an initial type and values
        }
      } else {
        // check data type
        const inputElementValue = await page.evaluate(
          (el) => el.value,
          inputElement
        );

        const dataType = isNumber(inputElementValue) ? "number" : "string";

        schema.components.schemas[name] = { type: dataType }; // else, create data type only to the key
      }
    }

    // loop through the selectElements array
    for (const selectElement of selectElements) {
      const name = await page.evaluate((el) => el.name, selectElement); // get the select element name
      // Get <option> from select element
      const options = await page.$$eval(
        `select[name=${name}] option`,
        (option) => option.map((option) => option.value)
      );

      // create selectSchema for the labels
      const selectSchema = createSchema("string", options);

      schema.components.schemas[name] = selectSchema; // Add select element type to the schema
    }

    // create the json
    createJSON(jsonName, schema);

    browser.close();
  } catch (error) {
    console.error(error);
    browser.close();
    return;
  }

  // Generate XLSX
  generateXLSX(schema, rows, xlsxName);
};

export default run;
