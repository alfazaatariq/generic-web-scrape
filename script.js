import puppeteer from "puppeteer";
import * as fs from "fs";
import { schema, createSchema } from "./schema.js";

const run = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

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
        // Get all label elements with attribute for == id of the input element
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
        const elementValue = await page.evaluate(
          (el) => el.value,
          inputElement
        );
        const dataType = isNaN(parseFloat(elementValue)) ? "string" : "number";

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

    console.log(schema);
    // create the json
    fs.writeFile("scraped.json", JSON.stringify(schema), (err) => {
      if (err) throw err;
      console.log("file saved");
    });

    browser.close();
  } catch (error) {
    console.error(error);
  }
};
