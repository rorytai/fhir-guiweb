const uuid = require('uuid');
const organizationId = uuid.v4();


module.exports.config = {
    name: 'pasbundle_config',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
    action: 'return',
    fhir_version: 'R4',
    validate: false
}

module.exports.globalResource = {
}

module.exports.fields = [

]

// Global data pre-processor
module.exports.beforeProcess = (data) => {

    return data;
}

// Add a global post-processor to add Organization resource
module.exports.afterProcess = (bundle) => {
    
    return bundle;
}
