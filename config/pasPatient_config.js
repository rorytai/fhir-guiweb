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

module.exports.config = {
  name: "pasPatient_config",
  version: "1.0.0",
  fhirServerBaseUrl: "https://hapi.fhir.tw/fhir",
  action: "return",
  fhir_version: "R4",
  validate: false
};
    
module.exports.globalResource = {
  Patient: {
    resourceType: "Patient",
    text: {
      status: "generated"
    },
    identifier: [
      {
        use: "official",
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "NNxxx"
            }
          ]
        },
        system: "http://www.moi.gov.tw"
      },
      {
        use: "official",
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "PRC"
            }
          ]
        },
        system: "http://www.immigration.gov.tw"
      },
      {
        use: "official",
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "MR"
            }
          ]
        },
        system: "https://www.tph.mohw.gov.tw"
      }
    ],
    name: [
      {
        use: "usual"
      }
    ]
  }
};

module.exports.fields = [
  {
    source: "patId",
    target: "Patient.identifier[1].value"
  },
  {
    source: "name",
    target: "Patient.name[0].text"
  },
  {
    source: "idCard",
    target: "Patient.identifier[0].value"
  },
  {
    source: "birthday",
    target: "Patient.birthDate"
  },
  {
    source: "gender",
    target: "Patient.gender"
  },
  {
    source: "Patient_div",
    target: "Patient.text.div"
  }
];

module.exports.beforeProcess = (data) => {

    return data;
}

// Add a global post-processor to add Organization resource
module.exports.afterProcess = (bundle) => {
    
    return bundle;
}
