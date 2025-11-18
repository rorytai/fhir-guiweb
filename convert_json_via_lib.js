
const { Convert } = require('@fhir-uck/fhir-converter-core');
const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')
const csvToJson = require('csvtojson');

//var args = process.argv.slice(2);
var args = process.argv.slice(2);
//const configObject = require('./config/fhir_iii_config');
const configObject = require('./config/'+ args[0])
const convert2 = new Convert(configObject);


const jsonFilePath = 'output.json'
//
//async function convertCsvToJson(csvFilePath, jsonFilePath) {
//	const jsonArray = await csvToJson().fromFile(csvFilePath);
//	fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));
//	console.log(`CSV file successfully converted to JSON: ${jsonFilePath}`);
//}
//convertCsvToJson(args[0], 'output.json');

async function convertCSVToJSON(csvFilePath, callback) {
	const results = [];
	fs.createReadStream(csvFilePath, {encoding: 'utf-8'})
		.pipe(csv())
		.on('data', (data) => results.push(data))
		.on('end', () => {
			callback(null, results);
		})
		.on('error', (error) => {
			callback(error, null);
		})
}


async function convertData(jsonData) {
	const result = await convert2.convert(jsonData);
	// If validation is enabled in config, result will include validationResults
	// Otherwise, result will only have the bundle field
	console.log(result);
	return(result)
}


//convertCSVToJSON(args[0], (err, jsonData) => {
//	if (err) {
//		console.err('Error reading CSV:', err);
//		return;
//	}
//	console.log('CSV converted to JSON:', jsonData);
//	convertData(jsonData).then(result => {
//		const outputPath = path.join(__dirname, 'fhir_convert_results.json');
//		fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
//		console.log(`Conversion results have been written to: ${outputPath}`);
//	}).catch(error => {
//		console.error('An error occurred during the conversion process:', error);
//	});
//});
// Execute conversion and write results to file

try {
	const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
	const jsonData = JSON.parse(fileContent);
	console.log(jsonData);

	convertData(jsonData).then(result => {
		const outputPath = path.join(__dirname, 'fhir_conversion_results.json');
		fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
		console.log(`Conversion results have been written to: ${outputPath}`);
	}).catch(error => {
		console.error('An error occurred during the conversion process:', error);
	});
	} catch (err) {
		console.error('Error reading file: ', err);
}


