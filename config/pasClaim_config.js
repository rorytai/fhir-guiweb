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
  name: "pasClaim_config",
  version: "1.0.0",
  fhirServerBaseUrl: "https://hapi.fhir.tw/fhir",
  action: "return",
  fhir_version: "R4",
  validate: false
};
    
module.exports.globalResource = {
  Claim: {
    resourceType: "Claim",
    text: {
      status: "generated"
    },
    status: "active",
    type: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/claim-type",
          code: "institutional"
        }
      ]
    },
    subType: {
      coding: [
        {
          system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-apply-type"
        }
      ]
    },
    use: "preauthorization",
    patient: {
      reference: "#Patient"
    },
    enterer: {
      reference: "#Practitioner"
    },
    provider: {
      reference: "#Organization"
    },
    priority: {
      coding: [
        {
          system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-tmhb-type"
        }
      ]
    },
    supportingInfo: [
      {
        sequence: 1,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
              code: "weight"
            }
          ]
        },
        valueQuantity: {
          system: "http://unitsofmeasure.org",
          code: "kg"
        }
      },
      {
        sequence: 2,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "height"
            }
          ]
        },
        valueQuantity: {
          system: "http://unitsofmeasure.org",
          code: "cm"
        }
      },
      {
        sequence: 3,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "pregnancyBreastfeedingStatus"
            }
          ]
        }
      },
      {
        sequence: 4,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "imagingReport"
            }
          ]
        },
        valueReference: {
          reference: "#DiagnosticImgReport"
        }
      },
      {
        sequence: 5,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "cancerStage"
            }
          ]
        },
        valueReference: {
          reference: "#ObservationCancer"
        }
      },
      {
        sequence: 6,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "examinationReport"
            }
          ]
        },
        valueReference: {
          reference: "#DiagnosticReport"
        }
      },
      {
        sequence: 7,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "geneInfo"
            }
          ]
        },
        valueReference: {
          reference: "#ObservationDiagnostic"
        }
      },
      {
        sequence: 8,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "tests"
            }
          ]
        },
        valueReference: {
          reference: "#ObservationLab"
        }
      },
      {
        sequence: 9,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "tests"
            }
          ]
        }
      },
      {
        sequence: 10,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "patientAssessment"
            }
          ]
        },
        valueReference: {
          reference: "#ObservationPatNyha"
        }
      },
      {
        sequence: 11,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "medicationRequest"
            }
          ]
        },
        valueReference: {
          reference: "#MedicationRequest"
        }
      },
      {
        sequence: 12,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "radiotherapy"
            }
          ]
        },
        valueReference: {
          reference: "#MedicationRequest"
        }
      },
      {
        sequence: 13,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "carePlanDocument"
            }
          ]
        },
        valueReference: {
          reference: "#DocumentReferenceCareplan"
        }
      },
      {
        sequence: 14,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "medicalRecord"
            }
          ]
        },
        valueReference: {
          reference: "#DocumentReferenceMedical"
        }
      },
      {
        sequence: 15,
        category: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
              code: "treatmentAssessment"
            }
          ]
        },
        valueReference: {
          reference: "#DocumentReferenceMedical"
        }
      }
    ],
    diagnosis: [
      {
        extension: [
          {
            url: "http://hl7.org/fhir/us/davinci-pas/StructureDefinition/extension-diagnosisRecordedDate"
          }
        ],
        sequence: 1,
        diagnosisCodeableConcept: {
          coding: [
            {
              system: "https://twcore.mohw.gov.tw/ig/twcore/CodeSystem/icd-10-cm-2023-tw"
            }
          ]
        },
        type: [
          {}
        ]
      }
    ],
    procedure: [
      {
        sequence: 1,
        procedureCodeableConcept: {
          coding: [
            {
              system: "https://twcore.mohw.gov.tw/ig/twcore/CodeSystem/icd-10-pcs-2023-tw"
            }
          ]
        }
      }
    ],
    insurance: [
      {
        sequence: 1,
        focal: true,
        coverage: {
          reference: "Coverage/cov-min"
        }
      }
    ],
    item: [
      {
        extension: [
          {
            url: "https://nhicore.nhi.gov.tw/pas/StructureDefinition/extension-requestedService",
            valueReference: {
              reference: "MedicationRequest/medReq-apply"
            }
          }
        ],
        sequence: 1,
        productOrService: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-order-type"
            }
          ]
        },
        modifier: [
          {
            coding: [
              {
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-continuation-status"
              }
            ]
          },
          {
            coding: [
              {
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-line-of-therapy"
              }
            ]
          }
        ],
        programCode: [
          {}
        ],
        quantity: {
          system: "http://unitsofmeasure.org"
        },
        bodySite: {
          coding: [
            {
              system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-apply-side"
            }
          ]
        }
      }
    ]
  },
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
  },
  Practitioner: {
    resourceType: "Practitioner",
    text: {
      status: "generated"
    },
    identifier: [
      {
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "NNxxx"
            }
          ]
        },
        system: "http://www.moi.gov.tw"
      }
    ]
  },
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
  },
  DiagnosticImgReport: {
    resourceType: "DiagnosticReport",
    text: {
      status: "generated"
    },
    status: "final",
    category: [
      {
        coding: [
          {
            system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
            code: "imagingReport"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "https://twcore.mohw.gov.tw/ig/twcore/CodeSystem/icd-10-pcs-2023-tw"
        }
      ]
    },
    subject: {
      reference: "#Patient"
    },
    performer: [
      {
        reference: "#Practitioner"
      }
    ],
    presentedForm: [
      {
        contentType: "application/pdf",
        title: "影像報告"
      }
    ]
  },
  ObservationCancer: {
    resourceType: "Observation",
    text: {
      status: "generated"
    },
    status: "final",
    category: [
      {
        coding: [
          {
            system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
            code: "cancerStage"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "http://snomed.info/sct"
        }
      ]
    },
    subject: {
      reference: "#Patient"
    },
    performer: [
      {
        reference: "#Practitioner"
      }
    ],
    valueCodeableConcept: {
      coding: [
        {
          system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nci-thesaurus"
        }
      ]
    }
  },
  DiagnosticReport: {
    resourceType: "DiagnosticReport",
    text: {
      status: "generated"
    },
    status: "final",
    category: [
      {
        coding: [
          {
            system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
            code: "examinationReport"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "http://loinc.org"
        }
      ]
    },
    subject: {
      reference: "#Patient"
    },
    performer: [
      {
        reference: "#Practitioner"
      }
    ],
    presentedForm: [
      {
        contentType: "application/pdf"
      }
    ]
  },
  ObservationDiagnostic: {
    resourceType: "Observation",
    text: {
      status: "generated"
    },
    status: "final",
    category: [
      {
        coding: [
          {
            system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
            code: "geneInfo"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "http://loinc.org"
        }
      ]
    },
    subject: {
      reference: "#Patient"
    },
    performer: [
      {
        reference: "#OrganizationGene"
      }
    ],
    interpretation: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation"
          }
        ]
      }
    ],
    method: {
      coding: [
        {
          system: "http://loinc.org"
        }
      ]
    },
    specimen: {
      reference: "#Specimen"
    },
    derivedFrom: [
      {
        reference: "#DocumentReferenceGene"
      }
    ],
    component: [
      {
        code: {
          coding: [
            {
              system: "http://loinc.org"
            }
          ]
        },
        interpretation: [
          {
            coding: [
              {
                system: "http://loinc.org"
              }
            ]
          }
        ]
      }
    ]
  },
  OrganizationGene: {
    resourceType: "Organization",
    text: {
      status: "generated"
    },
    identifier: [
      {
        system: "https://dep.mohw.gov.tw"
      }
    ]
  },
  Specimen: {
    resourceType: "Specimen",
    text: {
      status: "generated"
    },
    type: {
      coding: [
        {
          system: "http://loinc.org"
        }
      ]
    },
    subject: {
      reference: "#Patient"
    }
  },
  DocumentReferenceGene: {
    resourceType: "DocumentReference",
    text: {
      status: "generated"
    },
    status: "current",
    category: [
      {
        coding: [
          {
            system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-pdf-type",
            code: "gene"
          }
        ]
      }
    ],
    subject: {
      reference: "#Patient"
    },
    content: [
      {
        attachment: {
          contentType: "application/pdf"
        }
      }
    ]
  },
  ObservationLab: {
    resourceType: "Observation",
    text: {
      status: "generated"
    },
    status: "final",
    category: [
      {
        coding: [
          {
            system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
            code: "tests"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "http://loinc.org"
        }
      ]
    },
    subject: {
      reference: "#Patient"
    },
    performer: [
      {
        reference: "#Practitioner"
      }
    ],
    valueQuantity: {
      unit: "mmol/l"
    },
    interpretation: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation"
          }
        ]
      }
    ],
    referenceRange: [
      {
        low: {
          unit: "mmol/l",
          system: "http://unitsofmeasure.org",
          code: "mmol/L"
        },
        high: {
          unit: "mmol/l",
          system: "http://unitsofmeasure.org",
          code: "mmol/L"
        }
      }
    ],
    derivedFrom: [
      {
        reference: "#DocumentReferenceTest"
      }
    ]
  },
  DocumentReferenceTest: {
    resourceType: "DocumentReference",
    text: {
      status: "generated"
    },
    status: "current",
    category: [
      {
        coding: [
          {
            system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-pdf-type",
            code: "test"
          }
        ]
      }
    ],
    subject: {
      reference: "Patient/pat-min"
    },
    content: [
      {
        attachment: {
          contentType: "application/pdf"
        }
      }
    ]
  },
  ObservationPatNyha: {
    resourceType: "Observation",
    text: {
      status: "generated"
    },
    status: "final",
    category: [
      {
        coding: [
          {
            system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
            code: "patientAssessment"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "http://loinc.org"
        }
      ]
    },
    subject: {
      reference: "#Patient"
    },
    performer: [
      {
        reference: "#Practitioner"
      }
    ]
  },
  MedicationRequest: {
    resourceType: "MedicationRequest",
    text: {
      status: "generated"
    },
    intent: "order",
    statusReason: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/medicationrequest-status-reason"
        }
      ]
    },
    category: [
      {
        coding: [
          {
            system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-drug-category"
          }
        ]
      }
    ],
    medicationCodeableConcept: {
      coding: [
        {
          system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-medication"
        }
      ]
    },
    subject: {
      reference: "#Patient"
    },
    dosageInstruction: [
      {
        timing: {
          repeat: {
            boundsPeriod: {}
          },
          code: {}
        },
        route: {
          coding: [
            {
              system: "http://snomed.info/sct"
            }
          ]
        },
        doseAndRate: [
          {
            doseQuantity: {
              system: "http://unitsofmeasure.org"
            }
          }
        ]
      }
    ]
  },
  DocumentReferenceCareplan: {
    resourceType: "DocumentReference",
    text: {
      status: "generated"
    },
    status: "current",
    category: [
      {
        coding: [
          {
            system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-pdf-type",
            code: "careplan"
          }
        ]
      }
    ],
    subject: {
      reference: "#Patient"
    },
    content: [
      {
        attachment: {
          contentType: "application/pdf"
        }
      }
    ]
  },
  DocumentReferenceMedical: {
    resourceType: "DocumentReference",
    text: {
      status: "generated"
    },
    status: "current",
    category: [
      {
        coding: [
          {
            system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-pdf-type",
            code: "medrec"
          }
        ]
      }
    ],
    subject: {
      reference: "#Patient"
    },
    content: [
      {
        attachment: {
          contentType: "application/pdf"
        }
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
    source: "applType",
    target: "Claim.subType.coding[0].code"
  },
  {
    source: "applType_text",
    target: "Claim.subType.coding[0].display"
  },
  {
    source: "applPrsnId",
    target: "Practitioner.identifier[0].value"
  },
  {
    source: "applDate",
    target: "Claim.created"
  },
  {
    source: "tmhbType",
    target: "Claim.priority.coding[0].code"
  },
  {
    source: "tmhbType_text",
    target: "Claim.priority.coding[0].display"
  },
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
    source: "weight",
    target: "Claim.supportingInfo[0].valueQuantity.value"
  },
  {
    source: "height",
    target: "Claim.supportingInfo[1].valueQuantity.value"
  },
  {
    source: "pregnant",
    target: "Claim.supportingInfo[2].valueBoolean"
  },
  {
    source: "icd10cmCode",
    target: "Claim.diagnosis[0].diagnosisCodeableConcept.coding[0].code"
  },
  {
    source: "icdcm_text",
    target: "Claim.diagnosis[0].diagnosisCodeableConcept.coding[0].display"
  },
  {
    source: "diagDate",
    target: "Claim.diagnosis[0].extension[0].valueDate"
  },
  {
    source: "diagCurrentStatus",
    target: "Claim.diagnosis[0].type[0].text"
  },
  {
    source: "medrec",
    target: "DocumentReferenceMedical.content[0].attachment.url"
  },
  {
    source: "medrecTitle",
    target: "DocumentReferenceMedical.content[0].attachment.title"
  },
  {
    source: "imgItem",
    target: "DiagnosticImgReport.code.coding[0].code"
  },
  {
    source: "imgResult",
    target: "DiagnosticImgReport.conclusion"
  },
  {
    source: "imgDate",
    target: "DiagnosticImgReport.effectiveDateTime"
  },
  {
    source: "imgBodySite",
    target: "DiagnosticImgReport.code.text"
  },
  {
    source: "assessItem",
    target: "ObservationCancer.code.coding[0].code"
  },
  {
    source: "assessItem_text",
    target: "ObservationCancer.code.coding[0].display"
  },
  {
    source: "assessScore",
    target: "ObservationCancer.valueCodeableConcept.coding[0].code"
  },
  {
    source: "assessScore_text",
    target: "ObservationCancer.valueCodeableConcept.coding[0].display"
  },
  {
    source: "assessDate",
    target: "ObservationCancer.effectiveDateTime"
  },
  {
    source: "reportType",
    target: "DiagnosticReport.code.coding[0].code"
  },
  {
    source: "reportType_text",
    target: "DiagnosticReport.code.coding[0].display"
  },
  {
    source: "speType",
    target: "DiagnosticReport.code.text"
  },
  {
    source: "reportResultString",
    target: "DiagnosticReport.conclusion"
  },
  {
    source: "reportResultPdf",
    target: "DiagnosticReport.presentedForm[0].url"
  },
  {
    source: "reportResultPdfTitle",
    target: "DiagnosticReport.presentedForm[0].title"
  },
  {
    source: "reportDate",
    target: "DiagnosticReport.effectiveDateTime"
  },
  {
    source: "reportPerformer",
    target: "Practitioner.identifier[0].value"
  },
  {
    source: "inspect",
    target: "ObservationLab.code.coding[0].code"
  },
  {
    source: "inspectResultTxt",
    target: "ObservationLab.interpretation[0].coding[0].code"
  },
  {
    source: "inspectResultTxt_text",
    target: "ObservationLab.interpretation[0].text"
  },
  {
    source: "inspectResult",
    target: "ObservationLab.valueQuantity.value"
  },
  {
    source: "consultValueLower",
    target: "ObservationLab.referenceRange[0].low.value"
  },
  {
    source: "consultValueMax",
    target: "ObservationLab.referenceRange[0].high.value"
  },
  {
    source: "caseTime",
    target: "ObservationLab.effectiveDateTime"
  },
  {
    source: "inspectPdf",
    target: "DocumentReferenceTest.content[0].attachment.url"
  },
  {
    source: "inspectPdfTitle",
    target: "DocumentReferenceTest.content[0].attachment.title"
  },
  {
    source: "inspectPerformer",
    target: "Practitioner.identifier[0].value"
  },
  {
    source: "patAst",
    target: "ObservationPatNyha.code.coding[0].code"
  },
  {
    source: "patAst_text",
    target: "ObservationPatNyha.code.coding[0].display"
  },
  {
    source: "patAstResult",
    target: "ObservationPatNyha.valueString"
  },
  {
    source: "patAstDate",
    target: "ObservationPatNyha.effectiveDateTime"
  },
  {
    source: "patAstPerformer",
    target: "Practitioner.identifier[0].value"
  },
  {
    source: "drugCode",
    target: "MedicationRequest.medicationCodeableConcept.coding[0].code"
  },
  {
    source: "drugCode_text",
    target: "MedicationRequest.medicationCodeableConcept.coding[0].display"
  },
  {
    source: "drugType",
    target: "MedicationRequest.category[0].coding[0].code"
  },
  {
    source: "drugType_text",
    target: "MedicationRequest.category[0].coding[0].display"
  },
  {
    source: "drugStatus",
    target: "MedicationRequest.status"
  },
  {
    source: "drugFre",
    target: "MedicationRequest.dosageInstruction[0].timing.code.text"
  },
  {
    source: "drugRoute",
    target: "MedicationRequest.dosageInstruction[0].route.coding[0].code"
  },
  {
    source: "drugRoute_text",
    target: "MedicationRequest.dosageInstruction[0].route.coding[0].display"
  },
  {
    source: "dose",
    target: "MedicationRequest.dosageInstruction[0].doseAndRate[0].doseQuantity.value"
  },
  {
    source: "doseUnit",
    target: "MedicationRequest.dosageInstruction[0].doseAndRate[0].doseQuantity.code"
  },
  {
    source: "doseUnit_text",
    target: "MedicationRequest.dosageInstruction[0].doseAndRate[0].doseQuantity.unit"
  },
  {
    source: "sDate",
    target: "MedicationRequest.dosageInstruction[0].timing.repeat.boundsPeriod.start"
  },
  {
    source: "eDate",
    target: "MedicationRequest.dosageInstruction[0].timing.repeat.boundsPeriod.end"
  },
  {
    source: "eReason",
    target: "MedicationRequest.statusReason.coding[0].code"
  },
  {
    source: "eReason_text",
    target: "MedicationRequest.statusReason.coding[0].display"
  },
  {
    source: "opCode",
    target: "Claim.procedure[0].procedureCodeableConcept.coding[0].code"
  },
  {
    source: "opCode_text",
    target: "Claim.procedure[0].procedureCodeableConcept.coding[0].display"
  },
  {
    source: "opDate",
    target: "Claim.procedure[0].date"
  },
  {
    source: "carePlanDocPdf",
    target: "DocumentReferenceCareplan.content[0].attachment.url"
  },
  {
    source: "carePlanDocTitle",
    target: "DocumentReferenceCareplan.content[0].attachment.title"
  },
  {
    source: "specimenType",
    target: "Specimen.type.coding[0].code"
  },
  {
    source: "specimenType_text",
    target: "Specimen.type.coding[0].display"
  },
  {
    source: "genMethod",
    target: "ObservationDiagnostic.code.coding[0].display"
  },
  {
    source: "genMethod_code",
    target: "ObservationDiagnostic.code.coding[0].code"
  },
  {
    source: "genDate",
    target: "ObservationDiagnostic.effectiveDateTime"
  },
  {
    source: "genOrg",
    target: "OrganizationGene.identifier[0].value"
  },
  {
    source: "genResult",
    target: "ObservationDiagnostic.valueString"
  },
  {
    source: "genInterpretation",
    target: "ObservationDiagnostic.interpretation[0].coding[0].code"
  },
  {
    source: "genInterpretation_text",
    target: "ObservationDiagnostic.interpretation[0].coding[0].display"
  },
  {
    source: "genPdf",
    target: "DocumentReferenceGene.content[0].attachment.url"
  },
  {
    source: "genPdfTitle",
    target: "DocumentReferenceGene.content[0].attachment.title"
  },
  {
    source: "genTestCode",
    target: "ObservationDiagnostic.component[0].code.coding[0].code"
  },
  {
    source: "genTestCode_text",
    target: "ObservationDiagnostic.component[0].code.coding[0].display"
  },
  {
    source: "mutationType",
    target: "ObservationDiagnostic.component[0].interpretation[0].coding[0].code"
  },
  {
    source: "mutationType_text",
    target: "ObservationDiagnostic.component[0].interpretation[0].coding[0].display"
  },
  {
    source: "applyReason0_text",
    target: "Claim.item[0].programCode[0].text"
  },
  {
    source: "lot",
    target: "Claim.item[0].modifier[1].coding[0].code"
  },
  {
    source: "lot_text",
    target: "Claim.item[0].modifier[1].coding[0].display"
  },
  {
    source: "continuation",
    target: "Claim.item[0].modifier[0].coding[0].code"
  },
  {
    source: "continuation_text",
    target: "Claim.item[0].modifier[0].coding[0].display"
  },
  {
    source: "orderType",
    target: "Claim.item[0].productOrService.coding[0].code"
  },
  {
    source: "orderType_text",
    target: "Claim.item[0].productOrService.coding[0].display"
  },
  {
    source: "cancerDrugType",
    target: "MedicationRequestApply.medicationCodeableConcept.coding[0].code"
  },
  {
    source: "cancerDrugType_text",
    target: "MedicationRequestApply.medicationCodeableConcept.coding[0].display"
  },
  {
    source: "applySide",
    target: "Claim.item[0].bodySite.coding[0].code"
  },
  {
    source: "applQty",
    target: "Claim.item[0].quantity.value"
  },
  {
    source: "applQtyUnit",
    target: "Claim.item[0].quantity.code"
  },
  {
    source: "applDrugCycle",
    target: "MedicationRequestApply.dosageInstruction[0].timing.repeat.count"
  },
  {
    source: "applDosage",
    target: "MedicationRequestApply.dosageInstruction[0].doseAndRate[0].doseQuantity.value"
  },
  {
    source: "applDosageUnit",
    target: "MedicationRequestApply.dosageInstruction[0].doseAndRate[0].doseQuantity.code"
  },
  {
    source: "useSdate",
    target: "MedicationRequestApply.dosageInstruction[0].timing.repeat.boundsPeriod.start"
  },
  {
    source: "useEdate",
    target: "MedicationRequestApply.dosageInstruction[0].timing.repeat.boundsPeriod.end"
  },
  {
    source: "approveDate",
    target: "ClaimResponse.created"
  },
  {
    source: "approveNum",
    target: "ClaimResponse.item[0].adjudication[0].value"
  },
  {
    source: "approveComment",
    target: "ClaimResponse.item[0].adjudication[0].reason.coding[0].code"
  },
  {
    source: "approveComment_text",
    target: "ClaimResponse.item[0].adjudication[0].reason.coding[0].display"
  },
  {
    source: "applDrugFre_mergDisplay",
    target: "MedicationRequestApply.dosageInstruction[0].timing.code"
  },
  {
    source: "applDrugRoute",
    target: "MedicationRequestApply.dosageInstruction[0].route.coding[0].code"
  },
  {
    source: "applDrugRoute_text",
    target: "MedicationRequestApply.dosageInstruction[0].route.coding[0].display"
  },
  {
    source: "Claim_div",
    target: "Claim.text.div"
  },
  {
    source: "ClaimResponse_div",
    target: "ClaimResponse.text.div"
  },
  {
    source: "DiagnosticImgReport_div",
    target: "DiagnosticImgReport.text.div"
  },
  {
    source: "DiagnosticReport_div",
    target: "DiagnosticReport.text.div"
  },
  {
    source: "DocumentReferenceCareplan_div",
    target: "DocumentReferenceCareplan.text.div"
  },
  {
    source: "DocumentReferenceGene_div",
    target: "DocumentReferenceGene.text.div"
  },
  {
    source: "DocumentReferenceMedical_div",
    target: "DocumentReferenceMedical.text.div"
  },
  {
    source: "DocumentReferenceTest_div",
    target: "DocumentReferenceTest.text.div"
  },
  {
    source: "MedicationRequest_div",
    target: "MedicationRequest.text.div"
  },
  {
    source: "MedicationRequestApply_div",
    target: "MedicationRequestApply.text.div"
  },
  {
    source: "ObservationCancer_div",
    target: "ObservationCancer.text.div"
  },
  {
    source: "ObservationDiagnostic_div",
    target: "ObservationDiagnostic.text.div"
  },
  {
    source: "ObservationLab_div",
    target: "ObservationLab.text.div"
  },
  {
    source: "ObservationPatNyha_div",
    target: "ObservationPatNyha.text.div"
  },
  {
    source: "Organization_div",
    target: "Organization.text.div"
  },
  {
    source: "OrganizationGene_div",
    target: "OrganizationGene.text.div"
  },
  {
    source: "Patient_div",
    target: "Patient.text.div"
  },
  {
    source: "Practitioner_div",
    target: "Practitioner.text.div"
  },
  {
    source: "Specimen_div",
    target: "Specimen.text.div"
  }
];

module.exports.beforeProcess = (data) => {

    return data;
}

// Add a global post-processor to add Organization resource
module.exports.afterProcess = (bundle) => {
    // 如果 bundle 結構怪怪的就直接放過
    if (!bundle || !Array.isArray(bundle.entry)) {
        return bundle;
    }

    // 逐一處理每一個 Claim（通常只有一個，但這樣寫比較安全）
    bundle.entry.forEach((entry) => {
        if (!entry.resource || entry.resource.resourceType !== "Claim") {
            return;
        }

        const claim = entry.resource;

        // 沒有 item 就不用處理
        if (!Array.isArray(claim.item) || claim.item.length === 0) {
            return;
        }

        const firstItem = claim.item[0];

        if (!firstItem.programCode || !firstItem.programCode.length) {
            return;
        }

        const pc0 = firstItem.programCode[0];

        if (!pc0 || typeof pc0.text !== "string") {
            return;
        }

        const raw = pc0.text.trim();
        if (!raw) {
            return;
        }

        // ---- 開始拆 "(A,B,C);(A2,B2,C2)..." ----
        // 先用 ";" 切成多個 tuple 字串
        const tupleStrings = raw
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean);

        if (tupleStrings.length === 0) {
            return;
        }

        const newItems = [];

        // 預先把 productOrService 深拷貝出來，後面要給第二筆以後共用
        const baseProductOrService = firstItem.productOrService
            ? JSON.parse(JSON.stringify(firstItem.productOrService))
            : undefined;

        tupleStrings.forEach((t, idx) => {
            // 去掉前後括號 "(" 和 ")"
            const noParen = t.replace(/^\(/, "").replace(/\)$/, "");

            // 切成 A,B,C；不足 3 個就補空字串
            const parts = noParen.split(",");
            let A = (parts[0] || "").trim(); // code
            let B = (parts[1] || "").trim(); // text
            let C = (parts[2] || "").trim(); // system

            // 如果 A、B、C 全空，就整筆略過
            if (!A && !B && !C) {
                return;
            }

            // 組成 programCode 物件
            const programCode = {};

            // B 有值就填 text
            if (B) {
                programCode.text = B;
            }

            // A 或 C 有任一非空，才建 coding[0]
            if (A || C) {
                programCode.coding = [{}];
                if (A) {
                    programCode.coding[0].code = A;
                }
                if (C) {
                    programCode.coding[0].system = C;
                }
            }

            if (idx === 0) {
                // 第一筆 tuple → 改寫原本的 Claim.item[0]
                firstItem.sequence = 1;
                firstItem.programCode = [programCode];
                // 注意：第一筆保留原本的 productOrService（已經有）
                newItems.push(firstItem);
            } else {
                // 第二筆以後 → 各自生出一個新的 Claim.item
                const newItem = {
                    sequence: idx + 1,          // 2, 3, ...
                    programCode: [programCode],
                };
                // 依需求：把 Claim.item[0].productOrService 複製到後面每一筆
                if (baseProductOrService) {
                    newItem.productOrService = JSON.parse(
                        JSON.stringify(baseProductOrService)
                    );
                }
                newItems.push(newItem);
            }
        });
        // 有成功拆出新的 items 才覆蓋
        if (newItems.length > 0) {
            claim.item = newItems;
        }
    });

    return bundle;
};

