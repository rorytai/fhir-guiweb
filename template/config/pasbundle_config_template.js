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
    //醫事機構  #1
    Organization: {
        resourceType: 'Organization',
        text: {
            status: "generated",
        },
        identifier: [{
            use: "official",
            type: {
                coding: [{
                    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                    code: "PRN"
                }]
            },
            system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/organization-identifier-tw",
            //value: {hospId}   //項次1輸入"醫事機構代碼"
        }],
        type: [{
            coding: [{
                system: "http://terminology.hl7.org/CodeSystem/organization-type",
                code: "prov"
            }]
        }],
        //name: {hosp_name}
    },
    OrganizationGene: {
        resourceType: "Organization",
        text: {
            status: "generated",
        },
        identifier: [{
            system: "https://dep.mohw.gov.tw",
            //value: {genOrg}   //項次78"基因檢測機構"
        }]
    },
    Patient: {
        resourceType: "Patient",
        text: {
            status: "generated",
        },
        identifier: [{
            use: 'official',
            type: {
                coding: [{
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                    code: 'NNxxx',
                }]
            },
            system: 'http://www.moi.gov.tw',
            //value: {idCard}   //項次11"身分證號"
        },
        {
            use: "official",
            type: {
                coding: [{
                    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                    code: "PRC"
                }]
            },
            system: "http://www.immigration.gov.tw",
            //value: "AB12345678"
        },
        {
            use: 'official',
            type: {
                coding: [{
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                    code: 'MR',
                }]
            },
            system: 'https://www.tph.mohw.gov.tw',
            //value: {patId}    //項次9"病歷號 (參與醫院必須註冊命名系統)"
        }],
        name : [{
            use : "usual",
            // text : {name}    //項次10"姓名"
        }],
        //gender : {gender},     //項次13"病人性別"
        //birthDate : {birthday}    //項次12"出生日期"
	},
    //事前審查
    Claim: {
        resourceType: "Claim",
        text: {
            status: "generated",
        },
        //extension: [{
        //    url: "https://nhicore.nhi.gov.tw/pas/StructureDefinition/extension-claim-encounter",
        //    valueReference: {
        //        reference: "#Encounter"
        //    }
        //}],
        status: "active",
        type: {
            coding: [{
                system: "http://terminology.hl7.org/CodeSystem/claim-type",
                code: "institutional"
            }]
        },
        subType: {
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-apply-type",
                //code: {applType},    //項次2"申報類別"
                //display: {applType_text}
            }]
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
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-tmhb-type",
                //code: {tmhbType},     //項次7"申請案件類別"
                //display: {tmhbType_text}
            }]
        },
        supportingInfo: [{
            sequence: 1,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
                    code: "weight"
                }]
            },
            valueQuantity: {
                //value: {weight},	//項次14"病人體重"
                system: "http://unitsofmeasure.org",
                code: "kg"
            }
        },
        {
            sequence: 2,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "height"
                }]
            },
            valueQuantity: {
                //value: {height},  //項次15"病人身高"
                system: "http://unitsofmeasure.org",
                code: "cm"
            }
        },
        {
            sequence: 3,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "pregnancyBreastfeedingStatus"
                }]
            },
            //valueBoolean : {pregnant}     //項次16"是否懷孕或哺乳"
        },
        {
            sequence: 4,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "imagingReport"
                }]
            },
            valueReference: {
                reference: "#DiagnosticImgReport"	//Reference項次22輸入"影像報告"
            }
        },
        {
            sequence: 5,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "cancerStage"
                }]
            },
            valueReference: {
                reference: "#ObservationCancer"	//Reference項次29輸入"癌症分期量表項目"
            }            
        },
        {
            sequence: 6,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "examinationReport"
                }]
            },
            valueReference: {
                reference: "#DiagnosticReport"	//Reference項次33輸入"檢查報告"
            }
        },
        {
            sequence: 7,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "geneInfo"
                }]
            },
            valueReference: {
                reference: "#ObservationDiagnostic"	//Reference項次76輸入"基因資訊"
            }            
        },
        {
            sequence: 8,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "tests"
                }]
            },
            valueReference: {
                reference: "#ObservationLab"	//Reference項次40輸入"檢驗檢查-單項"
            }                
        },
        {
            sequence: 9,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "tests"
                }]
            },
            //valueReference: {
            //    reference: "#ObservationLab"	//Reference"檢驗檢查-套組(全套血液檢查)"
            //}               
        },
        {
            sequence: 10,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "patientAssessment"
                }]
            },
            valueReference: {
                reference: "#ObservationPatNyha"	//Reference項次52輸入"病人狀態評估"
            }             
        },
        {
            sequence: 11,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "medicationRequest"
                }]
            },
            valueReference: {
                reference: "#MedicationRequest"	//Reference項次56輸入"用藥品項"
            }               
        },
        {
            sequence: 12,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "radiotherapy"
                }]
            },
            valueReference: {
                reference: "#MedicationRequest"	//Reference項次66輸入"放射治療"
            }                 
        },
        {
            sequence: 13,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "carePlanDocument"
                }]
            },
            valueReference: {
                reference: "#DocumentReferenceCareplan"	//Reference項次73輸入"治療計畫文件"
            }
        },
        {
            sequence: 14,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "medicalRecord"
                }]
            },
            valueReference: {
                reference: "#DocumentReferenceMedical"	//Reference項次20輸入"病歷資料"
            }
        },
        {
            sequence: 15,
            category: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/codesystem/nhi-supporting-info-type",
                    code: "treatmentAssessment"
                }]
            },
            valueReference: {
                reference: "#DocumentReferenceMedical"	//Reference項次86輸入"結果資訊"
            }            
        }],
        diagnosis: [{
            extension: [{
                url: "http://hl7.org/fhir/us/davinci-pas/StructureDefinition/extension-diagnosisRecordedDate",
                //valueDate: {diagDate}   //項次18"診斷日期"
            }],
            sequence: 1,
            diagnosisCodeableConcept: {
                coding: [{
                    system: "https://twcore.mohw.gov.tw/ig/twcore/CodeSystem/icd-10-cm-2023-tw",
                    //code: {icd10cmCode},   //項次17"國際疾病分類代碼"
                    //display: {icdcm_text}
                }]
            },
            type: [{
                //text: {diagCurrentStatus} //項次19"簡要病摘"
            }]
        }],
        procedure: [{
            sequence: 1,
            //date : {opDate}   //項次72"手術(或其他處置)日期"
            procedureCodeableConcept: {
                coding: [{
                    system: "https://twcore.mohw.gov.tw/ig/twcore/CodeSystem/icd-10-pcs-2023-tw",
                    //code: {opCode},    //項次71"手術(或其他處置)項目"
                    //display: {opCode_text}
                }]
            }
        }],
        insurance: [{
            sequence: 1,
            focal: true,
            coverage: {
                reference: "Coverage/cov-min"
            }
        }],
        item: [{
            extension: [{
                url: "https://nhicore.nhi.gov.tw/pas/StructureDefinition/extension-requestedService",
                valueReference: {
                    reference: "MedicationRequest/medReq-apply"
                }
            }],
            sequence: 1,
            productOrService: {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-order-type",
                    //code: {orderType},    //項次92"醫令類別"
                    //display: {orderType_text}
                }]
            },
            modifier: [{
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-continuation-status",
                    //code: {continuation}, //項次91"續用註記"
                    //display: {continuation_text}
                }]
            },
            {
                coding: [{
                    system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-line-of-therapy",
                    //code: {lot},  //項次90"用藥線別"
                    //display: {lot_text}
                }]
            }],
            //項次89輸入"給付適應症條件"
            programCode: [{
                //coding: [{
                //    system: {applyReason_system},
                //    code: {applyReason0_code}
                //}],
                //text: {applyReason0_text}
            }],
            quantity: {
                //value: {applQty}, //項次95"事前審查申請數量"
                system: "http://unitsofmeasure.org",
                //code: {applyQtyUnit}  //項次96"事前審查申請數量單位"
            },
            bodySite: {
            	coding: [{
            		system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-apply-side",
                    //code: {applySide} //項次94"申請部位"
            	}]
        	}
        }],
    },
    //事前審查回覆
    ClaimResponse: {
        resourceType: "ClaimResponse",
        text: {
            status: "generated",
        },
        status: "active",
        type: {
            coding: [{
                system: "http://terminology.hl7.org/CodeSystem/claim-type",
                code: "institutional",
            }]
        },
        use: "preauthorization",
        patient: {
            reference: "#Patient",
        },
        //"created" : {approveDate},    //項次102"核定日期"
        insurer: {
            reference: "#Organization",
        },
        outcome: "complete",
        item: [{
            itemSequence: 1,
            adjudication: [{
                category: {
                    coding: [{
                        system: "http://terminology.hl7.org/CodeSystem/adjudication",
                        code: "submitted"
                    }]
                },
                reason: {
                    coding: [{
                        system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-approve-comment",
                        //code: {approveComment},  //項次104"核定註記"
                        //display: {approveComment_text}
                    }]
                },
                //value: {approveNum}   //項次103"核定數量"
            }]
        }]
    },
    //健保事前審查計畫， 不在欄位上但必須要有
    Coverage: {
        resourceType: "Coverage",
        text: {
            status: "generated",
        },
        status: "active",
        beneficiary: {
            reference: "#Patient"
        },
        payor: [{
            reference: "#Organization"
        }],
    },
    DocumentReferenceMedical: {
        resourceType: "DocumentReference",
        text: {
            status: "generated",
        },
        status: "current",
        category: [{
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-pdf-type",
                code: "medrec"
            }]
        }],
        subject: {
            reference: "#Patient"
        },
        content: [{
            attachment: {
                contentType: "application/pdf",
                //url: {medrec},    //項次20"病歷資料"
                //title: {medrecTitle}  //項次21"病歷資料名稱"
            }
        }]
    },
    //治療計畫
    DocumentReferenceCareplan: {
        resourceType: "DocumentReference",
        text: {
            status: "generated",
        },
        status: "current",
        category: [{
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-pdf-type",
                code: "careplan"
            }]
        }],
        subject: {
            reference: "#Patient"
        },
        content: [{
            attachment: {
                contentType: "application/pdf",
                //url: {carePlanDocPdf},    //項次73"治療計畫文件"
                //title: {carePlanDocTitle}	//項次74"治療計畫文件名稱"
            }
        }]
    },
    //基因報告
    DocumentReferenceGene: {
        resourceType: "DocumentReference",
        text: {
            status: "generated",
        },
        status: "current",
        category: [{
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-pdf-type",
                code: "gene"
            }]
        }],
        subject: {
            reference: "#Patient"
        },
        content: [{
            attachment: {
                contentType: "application/pdf",
                //url: {genPdf},    //項次81"基因報告"
                //title: {genPdfTitle}  //項次82"基因報告名稱"
            }
        }]
    },
    //檢驗檢查報告
    DocumentReferenceTest: {
        resourceType: "DocumentReference",
        text: {
            status: "generated",
        },
        status: "current",
        category: [{
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-pdf-type",
                code: "test"
            }]
        }],
        subject: {
            reference: "Patient/pat-min"
        },
        content: [
            {
                attachment: {
                    contentType: "application/pdf",
                    //url: {inspectPdf},    //項次49"檢驗(查)附件"
                    //title: {inspectPdfTitle}  //項次50"檢驗(查)附件名稱"
                }
            },
        ]
    },
    //就醫科別
    Encounter: {
        resourceType: "Encounter",
        text: {
            status: "generated",
        },
        status: "planned",
        class: {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: "AMB",
            display: "ambulatory"
        },
        serviceType: {
            coding: [{
                system: "https://twcore.mohw.gov.tw/ig/twcore/CodeSystem/medical-consultation-department-nhi-tw",
                //code: {funcType}, //項次3"就醫科別"
                //display: {funcType_text}
            }]
        }
    },
    //影像報告
    DiagnosticImgReport: {
        resourceType: "DiagnosticReport",
        text: {
            status: "generated",
        },
        status: "final",
        category: [{
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
                code: "imagingReport"
            }]
        }],
        code: {
            coding: [{
                system: "https://twcore.mohw.gov.tw/ig/twcore/CodeSystem/icd-10-pcs-2023-tw",
                //code: "{imgItem}, //項次22"影像報告"
                //display: {imgItem_text}
            }],
            //text: {imgBodySite}   //項次26"影像檢查的身體部位"
        },
        subject: {
            reference: "#Patient"
        },
        performer: [{
            reference: "#Practitioner"	//Reference項次25輸入"簽發影像報告醫師身分證號"
        }],
        //imagingStudy: [{
        //    reference: "#ImagingStudy"	//Reference項次27輸入"DICOM影像"
        //}],
        //media: {
        //    link: [{
        //        reference: "#Media"	//Reference項次28輸入"非DICOM影像"
        //    }]
        //},
        //conclusion: {imgResult},  //項次23"影像報告結果"
        //effectiveDateTime: {imgDate}  //項次24"影像報告日期"
        presentedForm: [{
            contentType: "application/pdf",
            title: "影像報告"
        }]
    },
    //檢查報告
    DiagnosticReport: {
        resourceType: "DiagnosticReport",
        text: {
            status: "generated",
        },
        status: "final",
        category: [{
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
                code: "examinationReport"
            }]
        }],
        code: {
            coding: [{
                system: "http://loinc.org",
                //code: {reportType},  //項次33"報告類型"
                //display: {reportType_text}
            }],
            //text: {speType}   //項次34"檢體種類"
        },
        subject: {
            reference: "#Patient"
        },
        performer: [{
            reference: "#Practitioner"	//Reference項次39輸入"檢查報告醫師身分證號"
        }],
        //conclusion: {reportResultString},	 //項次35"報告結果-文數字"
        //effectiveDateTime: {reportDate},  //項次38"報告日期"
        presentedForm: [
        {
            contentType: "application/pdf",
            //url: {reportResultPdf},   //項次36"檢查報告-檔案路徑"
            //title: {reportResultPdfTitle} //項次37"檢查報告名稱"
        },
        ]
    },
    //DICOM影像  #27
    ImagingStudy: {
        resourceType: "ImagingStudy",
        text: {
            status: "generated",
        },
        identifier: [{
            system: "urn:dicom:uid",
            value: "urn:oid:2.16.886.2102.54.4546465747.465465465"
        }],
        subject: {
            reference: "#Patient"
        },
        series: [{
            uid: "2.16.886.2102.54.4546465747.465465466",
            modality: {
                system: "http://dicom.nema.org/resources/ontology/DCM",
                code: "CT"
            },
            bodySite: {
                system: "http://snomed.info/sct",
                code: "774007",
                display: "Head and neck structure"
            },
            instance: [{
                uid: "2.25.88017001449189502323411118737039844241",
                sopClass: {
                    system: "urn:ietf:rfc:3986",
                    code: "urn:oid:1.2.840.10008.5.1.4.1.1.2"
                }
            }]
        }]
    },
    //非DICOM影像  #28
    Media: {
        resourceType: "Media",
        text: {
            status: "generated",
        },
        subject: {
            reference: "#Patient"
        },
        bodySite: {
            coding: [{
                system: "http://snomed.info/sct",
                code: "774007",
                display: "Head and neck structure"
            }]
        },
        content: {
            contentType: "image/jpeg",
            //url: "file://US01.jpg"
        }
    },
    //治療資訊
    MedicationRequest: {
        resourceType: "MedicationRequest",
        text: {
            status: "generated",
        },
        intent: "order",
        //status: {drugStatus}  //項次58"藥物使用狀態"
        statusReason: {
            coding: [{
                system: "http://terminology.hl7.org/CodeSystem/medicationrequest-status-reason",
                //code: {eReason},  //項次65"藥物處方終止原因"
                //display: {eReason_text}
            }]
        },
        category: [{
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-drug-category",
                //code: {drugType}, //項次57"自費註記"
                //display: {drugType_text}
            }]
        }],
        medicationCodeableConcept: {
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-medication",
                //code: {drugCode}, //項次56"藥品代碼"
                //display: {drugCode_text}
            }]
        },
        subject: {
            reference: "#Patient"
        },
        dosageInstruction: [{
            timing: {
                repeat: {
                    boundsPeriod: {
                        //start: {sDate},   //項次63"藥物處方起始日期"
                        //end: {eDate}  //項次64"藥物處方終止日期"
                    }
                },
                code: {
                    //text: {drugFre}   //項次59"藥品使用頻率及服用時間"
                }
            },
            route: {
                coding: [{
                    system: "http://snomed.info/sct",
                    //code: {drugRoute},    //項次60"給藥途徑/作用部位"
                    //display: {drugRoute_text}
                }]
            },
            doseAndRate: [{
                doseQuantity: {
                    //value: {dose},    //項次61"藥物每次處方劑量"
                    //unit: {doseUnit_text},
                    system: "http://unitsofmeasure.org",
                    //code: {doseUnit}    //項次62"藥物每次處方劑量單位"
                }
            }]
        }],
    },
    //事前審查品項
    MedicationRequestApply: {
        resourceType: "MedicationRequest",
        text: {
            status: "generated",
        },
        status: "on-hold",
        intent: "plan",
        medicationCodeableConcept: {
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-medication",
                //code: {cancerDrugType},   //項次93"事前審查品項代碼"
                //display: {cancerDrugType_text}
            }]
        },
        subject: {
            reference: "#Patient"
        },
        dosageInstruction: [{
            timing: {
                repeat: {
                    boundsPeriod: {
                        //start: {useSdate},    //項次100"事前審查藥物預定處方起始日期"
                        //end: {useEdate}       //項次101"事前審查藥物預定處方終止日期"
                    },
                    //count: {applDrugCycle}    //項次97"事前審查藥品療程/週期數
                },
                code: {
                    //{applDrugFre_mergDisplay} //項次105"事前審查藥品使用頻率及服用時間"
                    coding: [
                    {
                        //system: "http://terminology.hl7.org/CodeSystem/v3-GTSAbbreviation",
                        //code: "QD"    //"事前審查藥品使用頻率及服用時間"
                    },
                    //{
                    //    //system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/medication-frequency-nhi-tw",
                    //    //code: "AC1H"    //"事前審查藥品使用頻率及服用時間"
                    //},
                    ]
                }
            },
            route: {
                coding: [{
                    system: "http://snomed.info/sct",
                    //code: {applDrugRoute},    //項次106"給藥途徑/作用部位"
                    //display: {applDrugRoute_text}
                }]
            },
            doseAndRate: [{
                doseQuantity: {
                    //value: {applDosage},  //項次98"事前審查藥品每次處方劑量"
                    system: "http://unitsofmeasure.org",
                    //code: {applDosageUnit}  //項次99"藥物每次處方劑量單位"
                }
            }]
        },
        ]
    },
    //癌症分期量表
    ObservationCancer: {
        resourceType: "Observation",
        text: {
            status: "generated",
        },
        status: "final",
        category: [{
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
                code: "cancerStage"
            }]
        }],
        code: {
            coding: [{
                system: "http://snomed.info/sct",
                //code: {assessItem},   //項次29"癌症分期量表項目"
                //display: {assessItem_text}
            }]
        },
        subject: {
            reference: "#Patient"
        },
        performer: [{
            reference: "#Practitioner"	//Reference項次32輸入"簽發癌症分期報告醫師身分證號"
        }],
        valueCodeableConcept: {
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nci-thesaurus",
                //code: {assessScore},  //項次30"癌症分期分數或結果"
                //display: {assessScore_text}
            }]
        },
        //valueString:      //項次輸入"癌症分期分數或結果
        //valueInteger:     //項次輸入"癌症分期分數或結果
        //effectiveDateTime: {assessDate}   //項次31"癌症分期量表評估日期"
    },
    //基因資訊
    ObservationDiagnostic: {
        resourceType: "Observation",
        text: {
            status: "generated",
        },
        status: "final",
        category: [{
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
                code: "geneInfo"
            }]
        }],
        code: {
            coding: [{
                system: "http://loinc.org",
                //code: "69548-6"
            }]
        },
        subject: {
            reference: "#Patient"
        },
        //effectiveDateTime: {genDate}, //項次77"基因檢測日期"
        performer: [{
            reference: "#OrganizationGene"	//Reference項次78輸入"基因檢測機構"
        }],
        //valueString: {genResult}, //項次79"基因檢測分析結果"
        interpretation: [{
            coding: [{
                system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                //code: {genInterpretation},    //項次80"基因臨床判讀結果"
                //display: {genInterpretation_text}
            }]
        }],
        method: {
            coding: [{
                system: "http://loinc.org",
                //code: {genMethod_code},
                //display: {genMethod}  //項次76"基因檢測方法"
            }]
        },
        specimen: {
            reference: "#Specimen"	//Reference項次75輸入"基因檢測檢體類型"
        },
        derivedFrom: [{
            reference: "#DocumentReferenceGene"	//Reference項次81輸入"基因報告"
        }],
        component: [{
            code: {
                coding: [{
                    system: "http://loinc.org",
                    //code: {genTestCode},  //項次83"基因檢測代碼"
                    //display: {genTestCode_text}
                }]
            },
            //valueString: //項次84"基因檢測的實際結果"
            interpretation: [{
                coding: [{
                    system: "http://loinc.org",
                    //code: {mutationType},   //項次85"基因突變類型"
                    //display: {mutationType_text}
                }],
            }]
        }]
    },
    //檢驗檢查
    ObservationLab: {
        resourceType: "Observation",
        text: {
            status: "generated",
        },
        status: "final",
        category: [{
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
                code: "tests"
            }]
        }],
        code: {
            coding: [{
                system: "http://loinc.org",
                //code: {inspect} //項次40"檢驗(查)名稱或套組代碼"
            }]
        },
        subject: {
            reference: "#Patient"
        },
        performer: [{
            reference: "#Practitioner" 	 //Reference項次51輸入"簽發檢驗(查)報告醫事人員身分證號"
        }],
        valueQuantity: {
            //value: {inspectResult}, //項次42"檢驗(查)結果"
            unit: "mmol/l"
        },
        interpretation: [{
            coding: [{
                system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                //code: {inspectResultTxt}  //項次41"檢驗(查)結果判讀"
            }],
            //text: {inspectResultTxt_text}
        }],
        referenceRange: [{
            low: {
                //value: {consultValueLower},   //項次43"檢驗(查)結果之參考範圍下限"
                unit: "mmol/l",
                system: "http://unitsofmeasure.org",
                code: "mmol/L"
            },
            high: {
                //value: {consultValueMax},     //項次44"檢驗(查)結果之參考範圍上限"
                unit: "mmol/l",
                system: "http://unitsofmeasure.org",
                code: "mmol/L"
            }
            //type: {consultValueCat},  //項次45"檢驗(查)結果之參考範圍類型"
            //text: {consultValueDesc}  //項次46"檢驗(查)結果之參考範圍說明"
        }],
        //effectiveDateTime: {caseTime} //項次48"檢驗(查)報告日期"
        derivedFrom: [{
            reference: "#DocumentReferenceTest"	 //Reference項次49輸入"檢驗(查)附件"
        }]
    },
    //病人狀態評估
    ObservationPatNyha: {
        resourceType: "Observation",
        text: {
            status: "generated",
        },
        status: "final",
        category: [{
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-supporting-info-type",
                code: "patientAssessment"
            }]
        }],
        code: {
            coding: [{
                system: "http://loinc.org",
                //code: {patAst},   //項次52"病人狀態評估項目代碼"
                //display: {patAst_text}
            }]
        },
        subject: {
            reference: "#Patient"
        },
        //effectiveDateTime: {patAstDate},  //項次54"病人狀態評估日期"
        performer: [{
            reference: "#Practitioner"	 //Reference項次55輸入"評估項目醫事人員身分證號"
        }],
        //valueString: {patAstResult},  //項次53"病人狀態評估結果"
        //valueInteger: //"病人狀態評估結果，依據輸入值有兩種可能性"
    },
    //結果資訊
    ObservationTx: {
        resourceType: "Observation",
        text: {
            status: "generated",
        },
        status: "final",
        code: {
            coding: [{
                system: "https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-tx-ast",
                //code: {txAst},    //項次86"治療後疾病狀態評估項目"
                //display: {txAst_text}
            }]
        },
        subject: {
            reference: "#Patient"
        },
        performer: [{
            reference: "#Practitioner"
        }],
        //effectiveDateTime: {txAstDate},   //項次88"治療後疾病狀態評估日期"
        //valueString: {txAstResult}    //項次87"治療後疾病狀態評估結果"
    },
    //醫事人員
    Practitioner: {
        resourceType: "Practitioner",
        text: {
            status: "generated",
        },
        identifier: [{
            type: {
                coding: [{
                    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                    code: "NNxxx"
                }]
            },
            system: "http://www.moi.gov.tw",
            //value: //項次4{applPrsnId}/項次25{imgInterpreter}/項次32{assessPerformer}/項次39{reportPerformer}/項次51{inspectPerformer}/項次55{patAstPerformer}
        }]
    },
    //放射治療
    Procedure: {
        resourceType: "Procedure",
        text: {
            status: "generated",
        },
        //status: {rtStatus},   //項次66"放射治療狀態"
        code: {
            coding: [{
                system: "https://twcore.mohw.gov.tw/ig/twcore/CodeSystem/icd-10-pcs-2023-tw",
                //code: {rt},   //項次67輸入"放射治療項目"
                //display: {rt_text}
            }]
        },
        //performedDateTime: {realInspectTime}, //項次68輸入"放射治療日期"
        subject: {
            reference: "#Patient"
        },
        usedReference: [{
            reference: "#Substance"	 //Reference項次69輸入"放射治療總劑量"
        }]
    },
    //基因檢測檢體
    Specimen: {
        resourceType: "Specimen",
        text: {
            status: "generated",
        },
        type: {
            coding: [{
                system: "http://loinc.org",
                //code: {specimenType}, //項次75輸入"基因檢測檢體類型"
                //display: {specimenType_text}
            }]
        },
        subject: {
            reference: "#Patient"
        },
        //receivedTime: {genDate}   //項次77輸入"基因檢測日期"
    },
    //放射治療總劑量  #67, 69, 70
    Substance: {
        resourceType: "Substance",
        text: {
            status: "generated",
        },
        code: {
            coding: [{
                system: "https://twcore.mohw.gov.tw/ig/twcore/CodeSystem/icd-10-pcs-2023-tw",
                //code: {rt},   //項次67輸入"放射治療項目"
                //display: {rt_text}
            }]
        },
        ingredient: [{
            quantity: {
                numerator: {
                    //value: {rtDose},  //項次69輸入"放射治療總劑量"
                    system: "http://unitsofmeasure.org",
                    //code: {rtUnit},   //項次70輸入"放射治療總劑量單位"
                },
                denominator: {
                    value: 0,
                },
            },
            substanceCodeableConcept: {
                coding: [{
                    system: "https://twcore.mohw.gov.tw/ig/twcore/CodeSystem/icd-10-pcs-2023-tw",
                    //code: {rt} //項次67輸入"放射治療項目"
                }]
            }
        }]
    },
}

module.exports.fields = [
    //#1	醫事機構代碼
    {
        source: "hospId",
        target: "Organization.identifier[0].value",
    },
    {
        source: "hosp_name",
        target: "Organization.name",
    },
    //#2	申報類別
    {
        source: "applType",
        target: "Claim.subType.coding[0].code",
    },
    {
        source: "applType_text",
        target: "Claim.subType.coding[0].display",
    },
    //#3	就醫科別
    {
        source: "funcType",
        target: "Encounter.serviceType.coding[0].code",
    },
    {
        source: "funcType_text",
        target: "Encounter.serviceType.coding[0].display",
    },
    //#4	申請醫師身分證號
    {
        source: "applPrsnId",
        target: "Practitioner.identifier[0].value",
    },
    //#5	申請日期
    {
        source: "applDate",
        target: "Claim.created",
    },
    //#6	緊急報備日期    當項次7申請案件類別為”4:緊急報備”時，Claim.caeated即為緊急報備日期
    //{
    //    source: "immediateDate",
    //    target: ,
    //},
    //#7	申請案件類別
    {
        source: "tmhbType",
        target: "Claim.priority.coding[0].code",
    },
    {
        source: "tmhbType_text",
        target: "Claim.priority.coding[0].display",
    },
    //#8	原受理編號	院所上傳送核(subType = #1)案件時，不需填寫「原受理編號」資訊，受理成功後會由系統自動產生受理編號。
    //Claim.subType(申報類別)為2(送核補件)、3(申復)、4(爭議審議)或5(申復補件)時，院所才需於Claim.identifier填寫原送核案件之受理編號。
    //{
    //    source: "oldAcptNo",
    //    target: "Claim.identifier",
    //},
    //#9	病歷號
    {
        source: "patId",
        target: "Patient.identifier[1].value",
    },
    //#10	姓名
    {
        source: "name",
        target: "Patient.name[0].text",
    },
    //#11	身分證號
    {
        source: "idCard",
        target: "Patient.identifier[0].value",
    },
    //#12	出生日期
    {
        source: "birthday",
        target: "Patient.birthDate",
    },
    //#13	病人性別
    {
        source: "gender",
        target: "Patient.gender",
    },
    //#14	病人體重
    {
        source: "weight",
        target: "Claim.supportingInfo[0].valueQuantity.value",
    },
    //#15	病人身高
    {
        source: "height",
        target: "Claim.supportingInfo[1].valueQuantity.value",
    },
    //#16	是否懷孕或哺乳
    {
        source: "pregnant",
        target: "Claim.supportingInfo[2].valueBoolean",
    },
    //#17	國際疾病分類代碼
    {
        source: "icd10cmCode",
        target: "Claim.diagnosis[0].diagnosisCodeableConcept.coding[0].code",
    },
    {
        source: "icdcm_text",
        target: "Claim.diagnosis[0].diagnosisCodeableConcept.coding[0].display",
    },
    //#18	診斷日期
    {
        source: "diagDate",
        target: "Claim.diagnosis[0].extension[0].valueDate",
    },
    //#19	簡要病摘
    {
        source: "diagCurrentStatus",
        target: "Claim.diagnosis[0].type[0].text",
    },
    //#20	病歷資料
    {
        source: "medrec",
        target: "DocumentReferenceMedical.content[0].attachment.url",
    },
    //#21	病歷資料名稱
    {
        source: "medrecTitle",
        target: "DocumentReferenceMedical.content[0].attachment.title",
    },
    //#22	影像報告 
    {
        source: "imgItem",
        target: "DiagnosticImgReport.code.coding[0].code",
    },
    //#23	影像報告結果
    {
        source: "imgResult",
        target: "DiagnosticImgReport.conclusion",
    },
    //#24	影像報告日期
    {
        source: "imgDate",
        target: "DiagnosticImgReport.effectiveDateTime",
    },
    //#25	簽發影像報告醫師身分證號
//    {
//        source: "imgInterpreter",
//        target: "Practitioner.identifier[0].value",
//    },
    //#26	影像檢查的身體部位
    {
        source: "imgBodySite",
        target: "DiagnosticImgReport.code.text",
    },
    //#27	DICOM影像
//    {
//        source: "medrecTitle",
//        target: "DiagnosticImgReport.code.text",
//    },
    //#28	非DICOM影像
//    {
//        source: "medrecTitle",
//        target: "DiagnosticImgReport.code.text",
//    },
	//#29	癌症分期量表項目
    {
        source: "assessItem",
        target: "ObservationCancer.code.coding[0].code",
    },
    {
        source: "assessItem_text",
        target: "ObservationCancer.code.coding[0].display",
    },
    //#30	癌症分期分數或結果
    {
        source: "assessScore",
        target: "ObservationCancer.valueCodeableConcept.coding[0].code",
        //target: "ObservationCancer.valueString",
        //target: "ObservationCancer.valueInteger ",
    },
    {
        source: "assessScore_text",
        target: "ObservationCancer.valueCodeableConcept.coding[0].display",
    },
    //#31	癌症分期量表評估日期
    {
        source: "assessDate",
        target: "ObservationCancer.effectiveDateTime",
    },
    //#32	簽發癌症分期報告醫師身分證號
//    {
//        source: "assessPerformer",
//        target: "Practitioner.identifier[0].value",
//    },
	//#33	報告類型
    {
        source: "reportType",
        target: "DiagnosticReport.code.coding[0].code",
    },
    {
        source: "reportType_text",
        target: "DiagnosticReport.code.coding[0].display",
    },
    //#34	檢體種類
    {
        source: "speType",
        target: "DiagnosticReport.code.text",
    },
    //#35	報告結果-文數字
    {
        source: "reportResultString",
        target: "DiagnosticReport.conclusion",
    },
    //#36	檢查報告
    {
        source: "reportResultPdf",
        target: "DiagnosticReport.presentedForm[0].url",
    },
    //#37	檢查報告名稱
    {
        source: "reportResultPdfTitle",
        target: "DiagnosticReport.presentedForm[0].title",
    },
    //#38	報告日期
    {
        source: "reportDate",
        target: "DiagnosticReport.effectiveDateTime",
    },
    //#39	檢查報告醫師身分證號
    {
        source: "reportPerformer",
        target: "Practitioner.identifier[0].value",
    },
    //#40	檢驗(查)名稱或套組代碼
    {
        source: "inspect",
        target: "ObservationLab.code.coding[0].code",
    },
    //#41	檢驗(查)結果判讀
    {
        source: "inspectResultTxt",
        target: "ObservationLab.interpretation[0].coding[0].code",
    },
    {
        source: "inspectResultTxt_text",
        target: "ObservationLab.interpretation[0].text",
    },
    //#42	檢驗(查)結果
    {
        source: "inspectResult",
        target: "ObservationLab.valueQuantity.value",
    },
    //#43	檢驗(查)結果之參考範圍下限
    {
        source: "consultValueLower",
        target: "ObservationLab.referenceRange[0].low.value",
    },
    //#44	檢驗(查)結果之參考範圍上限
    {
        source: "consultValueMax",
        target: "ObservationLab.referenceRange[0].high.value",
    },
    //#45	檢驗(查)結果之參考範圍類型
    //{
    //    source: "consultValueCat",
    //    target: "ObservationLab.referenceRange[0].type",
    //},
    //#46	檢驗(查)結果之參考範圍說明
    //{
    //    source: "consultValueDesc",
    //    target: "ObservationLab.referenceRange[0].text",
    //},
    //#47	套組中的的檢驗
    //{
    //    source: "inspectSet",
    //    target: "Observation.component[0].code.coding[0].code",
    //},
    //#48	檢驗(查)報告日期
    {
        source: "caseTime",
        target: "ObservationLab.effectiveDateTime",
    },
    //#49	檢驗(查)附件
    {
        source: "inspectPdf",
        //target: "ObservationLab.derivedFrom[0].reference",
        target: "DocumentReferenceTest.content[0].attachment.url",
    },
    //#50	檢驗(查)附件名稱
    {
        source: "inspectPdfTitle",
        target: "DocumentReferenceTest.content[0].attachment.title",
    },
    //#51	簽發檢驗(查)報告醫事人員身分證號
    {
        source: "inspectPerformer",
        target: "Practitioner.identifier[0].value",
    },
    //#52	病人狀態評估項目代碼
    {
        source: "patAst",
        target: "ObservationPatNyha.code.coding[0].code",
    },
    {
        source: "patAst_text",
        target: "ObservationPatNyha.code.coding[0].display",
    },
    //#53	病人狀態評估結果
    {
        source: "patAstResult",
        target: "ObservationPatNyha.valueString",
    },
    //#54	病人狀態評估日期
    {
        source: "patAstDate",
        target: "ObservationPatNyha.effectiveDateTime",
    },
    //#55	評估項目醫事人員身分證號
    {
        source: "patAstPerformer",
        target: "Practitioner.identifier[0].value",
    },
    //#56	藥品代碼
    {
        source: "drugCode",
        target: "MedicationRequest.medicationCodeableConcept.coding[0].code",
    },
    {
        source: "drugCode_text",
        target: "MedicationRequest.medicationCodeableConcept.coding[0].display",
    },
    //#57	自費註記
    {
        source: "drugType",
        target: "MedicationRequest.category[0].coding[0].code",
    },
    {
        source: "drugType_text",
        target: "MedicationRequest.category[0].coding[0].display",
    },
    //#58	藥物使用狀態
    {
        source: "drugStatus",
        target: "MedicationRequest.status",
    },
    //#59	藥品使用頻率及服用時間
    {
        source: "drugFre",
        target: "MedicationRequest.dosageInstruction[0].timing.code.text",
    },
    //#60	給藥途徑/作用部位
    {
        source: "drugRoute",
        target: "MedicationRequest.dosageInstruction[0].route.coding[0].code",
    },
    {
        source: "drugRoute_text",
        target: "MedicationRequest.dosageInstruction[0].route.coding[0].display",
    },
    //#61	藥物每次處方劑量
    {
        source: "dose",
        target: "MedicationRequest.dosageInstruction[0].doseAndRate[0].doseQuantity.value",
    },
    //#62	藥物每次處方劑量單位
    {
        source: "doseUnit",
        target: "MedicationRequest.dosageInstruction[0].doseAndRate[0].doseQuantity.code",
    },
    {
        source: "doseUnit_text",
        target: "MedicationRequest.dosageInstruction[0].doseAndRate[0].doseQuantity.unit",
    },
    //#63	藥物處方起始日期
    {
        source: "sDate",
        target: "MedicationRequest.dosageInstruction[0].timing.repeat.boundsPeriod.start",
    },
    //#64	藥物處方終止日期
    {
        source: "eDate",
        target: "MedicationRequest.dosageInstruction[0].timing.repeat.boundsPeriod.end",
    },
    //#65	藥物處方終止原因
    {
        source: "eReason",
        target: "MedicationRequest.statusReason.coding[0].code",
    },
    {
        source: "eReason_text",
        target: "MedicationRequest.statusReason.coding[0].display",
    },
    //#66	放射治療狀態
    {
        source: "rtStatus",
        target: "Procedure.status",
    },
    //#67	放射治療項目
    {
        source: "rt",
        target: "Procedure.code.coding[0].code",
    },
    {
        source: "rt",
        target: "Substance.code.coding[0].code",
    },
    {
        source: "rt",
        target: "Substance.ingredient[0].substanceCodeableConcept.coding[0].code",
    },
    {
        source: "rt_text",
        target: "Procedure.code.coding[0].display",
    },
    {
        source: "rt_text",
        target: "Substance.code.coding[0].display",
    },
    //#68	放射治療日期
    {
        source: "realInspectTime",
        target: "Procedure.performedDateTime",
    },
    //#69	放射治療總劑量
    {
        source: "rtDose",
        target: "Substance.ingredient[0].quantity.numerator.value",
    },
    //#70	放射治療總劑量單位
    {
        source: "rtUnit",
        target: "Substance.ingredient[0].quantity.numerator.code",
    },
    //#71	手術(或其他處置)項目
    {
        source: "opCode",
        target: "Claim.procedure[0].procedureCodeableConcept.coding[0].code",
    },
    {
        source: "opCode_text",
        target: "Claim.procedure[0].procedureCodeableConcept.coding[0].display",
    },
    //#72	手術(或其他處置)日期
    {
        source: "opDate",
        target: "Claim.procedure[0].date",
    },
    //#73	治療計畫文件
    {
        source: "carePlanDocPdf",
        //target: "Claim.supportingInfo[12].valueReference",
        target: "DocumentReferenceCareplan.content[0].attachment.url",
    },
    //#74	治療計畫文件名稱
    {
        source: "carePlanDocTitle",
        target: "DocumentReferenceCareplan.content[0].attachment.title",
    },
    //#75	基因檢測檢體類型
    {
        source: "specimenType",
        target: "Specimen.type.coding[0].code",
    },
    {
        source: "specimenType_text",
        target: "Specimen.type.coding[0].display",
    },
    //#76	基因檢測方法
    {
        source: "genMethod",
        target: "ObservationDiagnostic.code.coding[0].display",
    },
    {
        source: "genMethod_code",
        target: "ObservationDiagnostic.code.coding[0].code",
    },
    //#77	基因檢測日期
    {
        source: "genDate",
        target: "ObservationDiagnostic.effectiveDateTime",
    },
    //#78	基因檢測機構
    {
        source: "genOrg",
        //target: "ObservationDiagnostic.performer[0].reference",
        target: "OrganizationGene.identifier[0].value",
    },
    //#79	基因檢測分析結果
    {
        source: "genResult",
        target: "ObservationDiagnostic.valueString",
    },
    //#80	基因臨床判讀結果
    {
        source: "genInterpretation",
        target: "ObservationDiagnostic.interpretation[0].coding[0].code",
    },
    {
        source: "genInterpretation_text",
        target: "ObservationDiagnostic.interpretation[0].coding[0].display",
    },
    //#81	基因報告
    {
        source: "genPdf",
        //target: "Observation.derivedFrom[0].reference",
        target: "DocumentReferenceGene.content[0].attachment.url",
    },
    //#82	基因報告名稱
    {
        source: "genPdfTitle",
        target: "DocumentReferenceGene.content[0].attachment.title",
    },
    //#83	基因檢測代碼
    {
        source: "genTestCode",
        target: "ObservationDiagnostic.component[0].code.coding[0].code",
    },
    {
        source: "genTestCode_text",
        target: "ObservationDiagnostic.component[0].code.coding[0].display",
    },
    //#84	基因檢測的實際結果
//    {
//        source: "genTestResult",
//        target: "ObservationDiagnostic.component[0].valueString",
//    },
    //#85	基因突變類型
    {
        source: "mutationType",
        target: "ObservationDiagnostic.component[0].interpretation[0].coding[0].code",
    },
    {
        source: "mutationType_text",
        target: "ObservationDiagnostic.component[0].interpretation[0].coding[0].display",
    },
    //#86	治療後疾病狀態評估項目
    {
        source: "txAst",
        target: "ObservationTx.code.coding[0].code",
    },
    {
        source: "txAst_text",
        target: "ObservationTx.code.coding[0].display",
    },
    //#87	治療後疾病狀態評估結果
    {
        source: "txAstResult",
        target: "ObservationTx.valueString",
    },
    //#88	治療後疾病狀態評估日期
    {
        source: "txAstDate",
        target: "ObservationTx.effectiveDateTime",
    },
    //#89	給付適應症條件 (仍需修改成自動擴展模式)
    //{
    //    source: "applyReason0_code",
    //    target: "Claim.item[0].programCode[0].coding[0].code",
    //},
    //{
    //    source: "applyReason0_system",
    //    target: "Claim.item[0].programCode[0].coding[0].system",
    //},
    {
        source: "applyReason0_text",
        target: "Claim.item[0].programCode[0].text",
    },
    //{
    //    source: "applyReason_mergDisplay",
    //    target: "Claim.item[0]",
    //    beforeConvert: (data) => {
    //		if (!data) return {};

    //		const list_item = [];
    //        //先用 ";" 分割成 tuple 字串陣列
    //        const tupleStrings = data.split(";").map(s => s.trim()).filter(Boolean);

    //        //取得 tuple 的個數
    //        //const tupleCount = tupleStrings.length;

    //        const items = tupleStrings.map((t, index) => {
    //            // 去除括號並以逗號分隔
    //            const [code, text, system] = t.replace(/[()]/g, "").split(",").map(v => v.trim());
    //            list_item.push({
    //                //sequence: index + 1,
    //                //programCode: [{
    //                    coding: [{
    //                        system: system || "",
    //                        code: code || ""
    //                    }],
    //                    text: text || ""
    //                //}]
    //            });
    //        });
    //        //return { item: list_item };
    //        return { programCode: list_item };
  	//	}
    //},
    //#90	用藥線別
    {
        source: "lot",
        target: "Claim.item[0].modifier[1].coding[0].code",
    },
    {
        source: "lot_text",
        target: "Claim.item[0].modifier[1].coding[0].display",
    },
    //#91	續用註記
    {
        source: "continuation",
        target: "Claim.item[0].modifier[0].coding[0].code",
    },
    {
        source: "continuation_text",
        target: "Claim.item[0].modifier[0].coding[0].display",
    },
    //#92	醫令類別
    {
        source: "orderType",
        target: "Claim.item[0].productOrService.coding[0].code",
    },
    {
        source: "orderType_text",
        target: "Claim.item[0].productOrService.coding[0].display",
    },
    //#93	事前審查品項代碼
    {
        source: "cancerDrugType",
        target: "MedicationRequestApply.medicationCodeableConcept.coding[0].code",
    },
    {
        source: "cancerDrugType_text",
        target: "MedicationRequestApply.medicationCodeableConcept.coding[0].display",
    },
    //#94	申請部位
    {
        source: "applySide",
        target: "Claim.item[0].bodySite.coding[0].code",
    },
    //#95	事前審查申請數量
    {
        source: "applQty",
        target: "Claim.item[0].quantity.value",
    },
    //#96	事前審查申請數量單位
    {
        source: "applQtyUnit",
        target: "Claim.item[0].quantity.code",
    },
    //#97	事前審查藥品療程/週期數
    {
        source: "applDrugCycle",
        target: "MedicationRequestApply.dosageInstruction[0].timing.repeat.count",
    },
    //#98	事前審查藥品每次處方劑量
    {
        source: "applDosage",
        target: "MedicationRequestApply.dosageInstruction[0].doseAndRate[0].doseQuantity.value",
    },
    //#99	藥物每次處方劑量單位
    {
        source: "applDosageUnit",
        target: "MedicationRequestApply.dosageInstruction[0].doseAndRate[0].doseQuantity.code",
    },
    //#100	事前審查藥物預定處方起始日期
    {
        source: "useSdate",
        target: "MedicationRequestApply.dosageInstruction[0].timing.repeat.boundsPeriod.start",
    },
    //#101	事前審查藥物預定處方終止日期
    {
        source: "useEdate",
        target: "MedicationRequestApply.dosageInstruction[0].timing.repeat.boundsPeriod.end",
    },
    //#102	核定日期
    {
        source: "approveDate",
        target: "ClaimResponse.created",
    },
    //#103	核定數量
    {
        source: "approveNum",
        target: "ClaimResponse.item[0].adjudication[0].value",
    },
    //#104	核定註記
    {
        source: "approveComment",
        target: "ClaimResponse.item[0].adjudication[0].reason.coding[0].code",
    },
    {
        source: "approveComment_text",
        target: "ClaimResponse.item[0].adjudication[0].reason.coding[0].display",
    },
    //#105	事前審查藥品使用頻率及服用時間
    //{
    //    source: "applDrugFre0",
    //    target: "MedicationRequestApply.dosageInstruction[0].timing.code.coding[0].code",
    //},
    {
        source: "applDrugFre_mergDisplay",
        target: "MedicationRequestApply.dosageInstruction[0].timing.code",
        beforeConvert: (data) => {
    		if (!data) return {};

    		const list_coding = [];
            const tuples = data.split(";").map(s => {
                const [code, display, system] = s.replace(/[()]/g, "").split(",");
                list_coding.push({
                    code,
                    system,
                    display
                });
            });
    		return { coding: list_coding };
  		}
    },
    //#106	給藥途徑/作用部位
    {
        source: "applDrugRoute",
        target: "MedicationRequestApply.dosageInstruction[0].route.coding[0].code",
    },
    {
        source: "applDrugRoute_text",
        target: "MedicationRequestApply.dosageInstruction[0].route.coding[0].display",
    },
    //# Resources div 填寫
    {
        source: "Claim_div",
        target: "Claim.text.div",
    },
    {
        source: "ClaimResponse_div",
        target: "ClaimResponse.text.div",
    },
    {
        source: "Coverage_div",
        target: "Coverage.text.div",
    },
    {
        source: "DiagnosticImgReport_div",
        target: "DiagnosticImgReport.text.div",
    },
    {
        source: "DiagnosticReport_div",
        target: "DiagnosticReport.text.div",
    },
    {
        source: "DocumentReferenceCareplan_div",
        target: "DocumentReferenceCareplan.text.div",
    },
    {
        source: "DocumentReferenceGene_div",
        target: "DocumentReferenceGene.text.div",
    },
    {
        source: "DocumentReferenceMedical_div",
        target: "DocumentReferenceMedical.text.div",
    },
    {
        source: "DocumentReferenceTest_div",
        target: "DocumentReferenceTest.text.div",
    },
    {
        source: "Encounter_div",
        target: "Encounter.text.div",
    },
    {
        source: "MedicationRequest_div",
        target: "MedicationRequest.text.div",
    },
    {
        source: "MedicationRequestApply_div",
        target: "MedicationRequestApply.text.div",
    },
    {
        source: "ObservationCancer_div",
        target: "ObservationCancer.text.div",
    },
    {
        source: "ObservationDiagnostic_div",
        target: "ObservationDiagnostic.text.div",
    },
    {
        source: "ObservationLab_div",
        target: "ObservationLab.text.div",
    },
    {
        source: "ObservationPatNyha_div",
        target: "ObservationPatNyha.text.div",
    },
    {
        source: "ObservationTx_div",
        target: "ObservationTx.text.div",
    },
    {
        source: "Organization_div",
        target: "Organization.text.div",
    },
    {
        source: "OrganizationGene_div",
        target: "OrganizationGene.text.div",
    },
    {
        source: "Patient_div",
        target: "Patient.text.div",
    },
    {
        source: "Practitioner_div",
        target: "Practitioner.text.div",
    },
    {
        source: "Procedure_div",
        target: "Procedure.text.div",
    },
    {
        source: "Specimen_div",
        target: "Specimen.text.div",
    },
    {
        source: "Substance_div",
        target: "Substance.text.div",
    },
]

// Global data pre-processor
module.exports.beforeProcess = (data) => {

    return data;
}

// Add a global post-processor to add Organization resource
module.exports.afterProcess = (bundle) => {
    
    return bundle;
}
