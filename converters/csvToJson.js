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

const csvFilePath = '../inputs/csv_alumni_db.csv'; 
const fieldMappings = {
    nome: 'Nome completo',
  email: 'e-mail',
  dataDeIngresso: 'Ano Ingresso',
  dataDeFormatura: 'Ano Formatura',
  empresaAtual: 'Qual a empresa/organização que está trabalhando agora?',  
};
const jsonOutputPath = '../outputs/csvToJson.json'; 

convertCsvToJson(csvFilePath, fieldMappings, jsonOutputPath)
  .then(message => console.log(message))
  .catch(error => console.error('Error:', error));
