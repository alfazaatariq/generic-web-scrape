import * as fs from "fs";

/**
 * Creates a JSON file with the given name and object.
 *
 * @param {string} name - The name of the JSON file.
 * @param {object} obj - The object to be converted to JSON.
 * @return {void} - This function does not return a value.
 */

export const createJSON = (name, obj) => {
  fs.writeFile(`${name}.json`, JSON.stringify(obj), (err) => {
    if (err) throw err;
    console.log("JSON FILE CREATED SUCCESSFULLY!");
  });
};
