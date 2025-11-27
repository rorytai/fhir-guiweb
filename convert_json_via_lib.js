
const { Convert } = require('@fhir-uck/fhir-converter-core');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const csvToJson = require('csvtojson');

// args[0] = output.json
// args[1] = pasbundle_config
const args = process.argv.slice(2);

if (args.length < 2) {
    console.error("Usage: node convert_json_via_lib.js <output.json> <configName>");
    process.exit(1);
}

const outputFileName = args[0];          // e.g. output.json
const configName = args[1];              // e.g. pasbundle_config

// Load config
const configObject = require('./config/' + configName);
const convert2 = new Convert(configObject);

// Replace original fixed output.json
const jsonFilePath = './convData/' + outputFileName;




async function convertData(jsonData) {
    const result = await convert2.convert(jsonData);
    console.log(result);
    return result;
}

try {
    const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
    const jsonData = JSON.parse(fileContent);

    console.log(jsonData);

    convertData(jsonData)
        .then(result => {
            const outputPath = path.join(__dirname, 'fhir_conversion_results.json');
            fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
            console.log(`Conversion results saved to: ${outputPath}`);
        })
        .catch(error => {
            console.error('Error occurred during conversion:', error);
        });

} catch (err) {
    console.error('Error reading input file: ', err);
}


