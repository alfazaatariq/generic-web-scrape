import pkg from "exceljs";
import { numberToExcelColumn } from "./numberToExcelColumn.js";

const { Workbook } = pkg;

export const generateXLSX = (data, rows, outputFile = "testing.xlsx") => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Data");

  const schemas = data.components.schemas; // access data schemas
  const headers = Object.keys(schemas); // get all keys from schemas and store it in an array

  worksheet.addRow(headers); // add headers to the first row

  const options = {}; // create an empty object to store values of each key

  // loop through the array of headers
  headers.forEach((key, columnIndex) => {
    const schema = schemas[key]; // get the schema for the key
    const column = numberToExcelColumn(columnIndex + 1); // convert the column index to Excel column name

    // Set data validation if "values" property is present and not empty
    if (schema.values && schema.values.length > 0) {
      // loop to add data validation to each n rows
      for (let i = 2; i <= rows + 1; i++) {
        const cell = worksheet.getCell(`${column}${i}`); // Target the cell to add data validation
        options[key] = schema.values; // Add the values to the object key

        // add data validation, in this case is a dropdown
        cell.dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ['"' + options[key].join(",") + '"'], // this will list all the options for the dropdown
        };
      }
    }
  });

  // save the workbook
  workbook.xlsx.writeFile(`${outputFile}.xlsx`).then(function () {
    console.log("EXCEL FILE CREATED SUCCESSFULLY!");
  });
};
