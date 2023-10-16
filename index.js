import scraper from "./script/script.js";
import { configDotenv } from "dotenv";
configDotenv();

/**
 * Executes the main function that calls the scraper function with the given parameters.
 *
 * @param {string} URL - The URL to scrape data from.
 * @param {string} JSONNAME - The name of the JSON file to store the scraped data.
 * @param {string} XLSXNAME - The name of the XLSX file to store the scraped data.
 * @param {number} ROWS - The number of rows to scrape from the URL.
 * @return {undefined} This function does not return a value.
 */

const main = () => {
  scraper(
    process.env.URL,
    process.env.JSONNAME,
    process.env.XLSXNAME,
    parseInt(process.env.ROWS)
  );
};

main();
