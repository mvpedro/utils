const fs = require('fs');
const csv = require('csv-parser');

function convertCsvToJson(csvFilePath, fieldMappings, jsonOutputPath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => {
        const jsonData = {};
        for (const [jsonField, csvColumn] of Object.entries(fieldMappings)) {
          jsonData[jsonField] = data[csvColumn];
        }
        results.push(jsonData);
      })
      .on('end', () => {
        fs.writeFile(jsonOutputPath, JSON.stringify(results, null, 2), (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(`JSON data saved to ${jsonOutputPath}`);
          }
        });
      })
      .on('error', reject);
  });
}

const csvFilePath = 'path/to/your/csvfile.csv'; 
const fieldMappings = {
  jsonFieldName1: 'CSVColumnName1',
  jsonFieldName2: 'CSVColumnName2',
};
const jsonOutputPath = 'output.json'; 

convertCsvToJson(csvFilePath, fieldMappings, jsonOutputPath)
  .then(message => console.log(message))
  .catch(error => console.error('Error:', error));
