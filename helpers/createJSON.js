import * as fs from "fs";

export const createJSON = (name, obj) => {
  fs.writeFile(`${name}.json`, JSON.stringify(obj), (err) => {
    if (err) throw err;
    console.log("JSON FILE CREATED SUCCESSFULLY!");
  });
};
