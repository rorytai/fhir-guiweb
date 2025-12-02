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
  name: "pasOrganization_config",
  version: "1.0.0",
  fhirServerBaseUrl: "https://hapi.fhir.tw/fhir",
  action: "return",
  fhir_version: "R4",
  validate: false
};
    
module.exports.globalResource = {
  Organization: {
    resourceType: "Organization",
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
              code: "PRN"
            }
          ]
        },
        system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/organization-identifier-tw"
      }
    ],
    type: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/organization-type",
            code: "prov"
          }
        ]
      }
    ]
  }
};

module.exports.fields = [
  {
    source: "hospId",
    target: "Organization.identifier[0].value"
  },
  {
    source: "hosp_name",
    target: "Organization.name"
  },
  {
    source: "genOrg",
    target: "OrganizationGene.identifier[0].value"
  },
  {
    source: "Organization_div",
    target: "Organization.text.div"
  },
  {
    source: "OrganizationGene_div",
    target: "OrganizationGene.text.div"
  }
];

module.exports.beforeProcess = (data) => {

    return data;
}

// Add a global post-processor to add Organization resource
module.exports.afterProcess = (bundle) => {
    
    return bundle;
}
