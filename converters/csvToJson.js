const fs = require('fs');
const csv = require('csv-parser');

function convertCsvToJson(csvFilePath, fieldMappings) {
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
        resolve(results);
      })
      .on('error', reject);
  });
}

const csvFilePath = 'path/to/your/csvfile.csv';
const fieldMappings = {
  jsonFieldName1: 'CSVColumnName1',
  jsonFieldName2: 'CSVColumnName2',
};

convertCsvToJson(csvFilePath, fieldMappings)
  .then(jsonData => console.log(jsonData))
  .catch(error => console.error('Error:', error));
