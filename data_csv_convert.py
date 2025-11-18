
import os
import sys
import csv
import json
import glob
from datetime import datetime
from pathlib import Path
from collections import defaultdict


# === 處理 CLI 參數 ===
if len(sys.argv) > 1:
    csv_name = sys.argv[1]
    print("📥 輸入 CSV：", csv_name)
else:
    print("❌ 未提供 CSV 檔案")
    sys.exit(1)


# === 設定對應表路徑 ===
DATA_DIR = Path("./mapping")
LOOKUP_FILES = {
    "cancer_score": ("cancer-stage-score.csv","code"),
    "cancer": ("cancer-stage.csv","code"),
    "dicom_cid": ("dicom-cid-29-AcquisitionModality.csv","Code"),
    "dna_change_type": ("dna-change-type.csv","Code"),
    #"frequency": ("frequency_mapping.csv", "原始頻率文字（原始欄位）"),
    "gene_code": ("gene-test-code.csv","Code"),
    "gene_method": ("gene-test-method.csv","code"),
    "gene_method_txt": ("gene-test-method.csv","display"),
    "icd_cm": ("icd-10-cm-2023-tw.csv","代碼"),
    "icd_pcs": ("icd-10-pcs-2023-tw.csv","代碼"),
    "identifier_type": ("identifier-type-tw.csv","Code"),
    "medical_consult_dep": ("medical-consultation-department-sct-tw.csv","原健保署就醫科別"),
    "medical_serv_pay": ("medical-service-payment-tw.csv","Code"),
    "medical_treat_dep": ("medical-treatment-department-sct-tw.csv","原健保署診療科別"),
    "med_device_fda": ("medication-device-fda-tw.csv","代碼"),
    "med_fda": ("medication-fda-tw.csv","代碼"),
    "med_freq_nhi": ("medication-frequency-hl7-nhi-tw.csv","Code"),
    "med_path": ("medication-path-sct-tw.csv","Code"),
    "med_status_reason": ("medication-status-reason.csv","Code"),
    "nhi_accept": ("nhi-acceptance-status.csv","Code"),
    "nhi_appl_reason": ("nhi-apply-reason.csv","Code"),
    "nhi_appl_type": ("nhi-apply-type.csv","Code"),
    "nhi_approve_claim": ("nhi-approve-claim-comment.csv","Code"),
    "nhi_approve_item": ("nhi-approve-item-comment.csv","Code"),
    "nhi_body_site": ("nhi-body-site.csv","Code"),
    "nhi_conti_status": ("nhi-continuation-status.csv","Code"),
    "nhi_drug_category": ("nhi-drug-category.csv","Code"),
    "nhi_line_therapy": ("nhi-line-of-therapy.csv","Code"),
    "nhi_med": ("nhi-medication.csv","Code"),
    "nhi_order_type": ("nhi-order-type.csv","Code"),
    "nhi_sup_info_type": ("nhi-supporting-info-type.csv","Code"),
    "nhi_tx_ast": ("nhi-tx-ast.csv","Code"),
    "org_identifier": ("organization-identifier-tw.csv","Code"),
    "observ_interpre": ("observation-interpretation.csv", "Code"),
    "pat_ast": ("pat-ast.csv","Code"),
    "report_type": ("report-type.csv","Code"),
    "specime_type": ("specime-type.csv","Code"),
    "tmhb_type": ("tmhb-type.csv","Code"),
    "ucum_units": ("ucum-units.csv","Code")
}


# === 載入對應表 ===
def load_mapping_table(filename, key_column):
    path = DATA_DIR / filename
    mapping = {}
    if not path.exists():
        print(f"⚠️ 找不到對應表：{filename}")
        return mapping
    try:
        with open(path, encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                key = row[key_column].strip()
                mapping[key] = row
    except Exception as e:
        print(path)
        print(e)
    return mapping


cancer_score_map = load_mapping_table(*LOOKUP_FILES["cancer_score"])
cancer_map = load_mapping_table(*LOOKUP_FILES["cancer"])
dicom_cid_map = load_mapping_table(*LOOKUP_FILES["dicom_cid"])
dna_change_type_map = load_mapping_table(*LOOKUP_FILES["dna_change_type"])
#frequency_map = load_mapping_table(*LOOKUP_FILES["frequency"])
gene_code_map = load_mapping_table(*LOOKUP_FILES["gene_code"])
gene_method_map = load_mapping_table(*LOOKUP_FILES["gene_method"])
gene_method_txt_map = load_mapping_table(*LOOKUP_FILES["gene_method_txt"])
icd_cm_map = load_mapping_table(*LOOKUP_FILES["icd_cm"])
icd_pcs_map = load_mapping_table(*LOOKUP_FILES["icd_pcs"])
identifier_type_map = load_mapping_table(*LOOKUP_FILES["identifier_type"])
medical_consult_dep_map = load_mapping_table(*LOOKUP_FILES["medical_consult_dep"])
medical_serv_pay_map = load_mapping_table(*LOOKUP_FILES["medical_serv_pay"])
medical_treat_dep_map = load_mapping_table(*LOOKUP_FILES["medical_treat_dep"])
med_device_fda_map = load_mapping_table(*LOOKUP_FILES["med_device_fda"])
med_fda_map = load_mapping_table(*LOOKUP_FILES["med_fda"])
med_freq_nhi_map = load_mapping_table(*LOOKUP_FILES["med_freq_nhi"])
med_path_map = load_mapping_table(*LOOKUP_FILES["med_path"])
med_status_reason_map = load_mapping_table(*LOOKUP_FILES["med_status_reason"])
nhi_accept_map = load_mapping_table(*LOOKUP_FILES["nhi_accept"])
nhi_appl_reason_map = load_mapping_table(*LOOKUP_FILES["nhi_appl_reason"])
nhi_appl_type_map = load_mapping_table(*LOOKUP_FILES["nhi_appl_type"])
nhi_approve_claim_map = load_mapping_table(*LOOKUP_FILES["nhi_approve_claim"])
nhi_approve_item_map = load_mapping_table(*LOOKUP_FILES["nhi_approve_item"])
nhi_conti_status_map = load_mapping_table(*LOOKUP_FILES["nhi_conti_status"])
nhi_drug_category_map = load_mapping_table(*LOOKUP_FILES["nhi_drug_category"])
nhi_line_therapy_map = load_mapping_table(*LOOKUP_FILES["nhi_line_therapy"])
nhi_med_map = load_mapping_table(*LOOKUP_FILES["nhi_med"])
nhi_order_type_map = load_mapping_table(*LOOKUP_FILES["nhi_order_type"])
nhi_sup_info_type_map = load_mapping_table(*LOOKUP_FILES["nhi_sup_info_type"])
nhi_tx_ast_map = load_mapping_table(*LOOKUP_FILES["nhi_tx_ast"])
org_identifier_map = load_mapping_table(*LOOKUP_FILES["org_identifier"])
observ_interpre_map = load_mapping_table(*LOOKUP_FILES["observ_interpre"])
pat_ast_map = load_mapping_table(*LOOKUP_FILES["pat_ast"])
report_type_map = load_mapping_table(*LOOKUP_FILES["report_type"])
specime_type_map = load_mapping_table(*LOOKUP_FILES["specime_type"])
tmhb_type_map = load_mapping_table(*LOOKUP_FILES["tmhb_type"])
ucum_units_map = load_mapping_table(*LOOKUP_FILES["ucum_units"])




# === 處理格式 ===
def format_date_string(date_str, input_format="%Y/%m/%d", output_format="%Y-%m-%d"):
    try:
        dt_object = datetime.strptime(date_str, input_format)
        return dt_object.strftime(output_format)
    except ValueError:
        return date_str

def is_float_string(s):
    try:
        float(s)
        return(True)
    except ValueError:
        return(False)


# === 處理html自動填入 ===
def read_html_file_as_string(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            html_content = file.read()
        return html_content
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None




# === 處理單筆資料 ===
def transform_row(row):
    result = row.copy()

    append_dict = {}
    for key, val in result.items():

        # 👇 將 從字串轉為數字（若存在）
        if "age" in key and result[key].isdigit():
            result[key] = int(result[key])
        if ("dose" in key or "Dose" in key) and result[key].isdigit():
            result[key] = int(result[key])
        if "Days" in key and result[key].isdigit():
            result[key] = int(result[key])
        if "Amount" in key and result[key].isdigit():
            result[key] = int(result[key])
        if "Num" in key and result[key].isdigit():
            result[key] = int(result[key])
        if ("weight" in key or "height" in key) and is_float_string(result[key]):
            result[key] = round(float(result[key]), 2)
        if ("Lower" in key or "Max" in key) and (result[key].isdigit() or is_float_string(result[key])):
            result[key] = float(result[key])

        if "applQty" == key and str(result[key]).isdigit():
            result[key] = int(result[key])
        if "applDrugCycle" == key and str(result[key]).isdigit():
            result[key] = int(result[key])
        if "applDosage" == key and str(result[key]).isdigit():
            result[key] = int(result[key])


        # 字串內容轉換
        if "gender" in key and isinstance(val, str):
            if val == "男":
                result[key] = "male"
            elif val == "女":
                result[key] = "female"
        if ("Date" in key or "date" in key or "Time" in key):
            result[key] = format_date_string(val)
        if "birthday" in key:
            result[key] = format_date_string(val)

        if "note" in key and val == "":
            result[key] = "None"

        if "FALSE" == val:
            result[key] = False
        if "TRUE" == val:
            result[key] = True


        # 字串內容拆解
        ## 這部份仍需補強:有多筆處方時期
        if "applDrugFre" == key:
            drugFreq_list = str(result[key]).split(";")
            list_medFreq = []
            #append_dict["drugFreq_len"] = len(drugFreq_list)
            for i in range(len(drugFreq_list)):
                append_dict["applDrugFre" + str(i)] = drugFreq_list[i]
                list_medFreq.append("applDrugFre" + str(i))

        if "applyReason" == key:
            reason_list = str(result[key]).split(";")
            list_applyreason = []
            #append_dict["applyReason_len"] = len(reason_list)
            for i in range(len(reason_list)):
                append_dict["applyReason" + str(i) + "_text"] = reason_list[i]
                list_applyreason.append("applyReason" + str(i) + "_text")


    result.update(append_dict)
    row_new = result.copy()



    # code mapping table 對應
    ## Claim
    # icd_cm_map
    # icd_pcs_map
    # medical_serv_pay_map
    # nhi_appl_type_map
    # nhi_appl_reason_map
    # nhi_conti_status_map
    # nhi_line_therapy_map
    # nhi_order_type_map
    # nhi_sup_info_type_map
    # tmhb_type_map
    apply_type = nhi_appl_type_map.get(row_new.get("applType", "").strip())
    if apply_type:
        result.update({
            "applType_text": apply_type["Display"]
        })

    tmhb_type = tmhb_type_map.get(row_new.get("tmhbType", "").strip())
    if tmhb_type:
        result.update({
            "tmhbType_text": tmhb_type["Display"]
        })

    icdcmCode = icd_cm_map.get(row_new.get("icd10cmCode", "").strip())
    if icdcmCode:
        result.update({
            "icdcm_text": icdcmCode["中文名稱"]
        })

    op_code = icd_pcs_map.get(row_new.get("opCode", "").strip())
    if op_code:
        result.update({
            "opCode_text": op_code["中文名稱"]
        })

    order_type = nhi_order_type_map.get(row_new.get("orderType", "").strip())
    if order_type:
        result.update({
            "orderType_text": order_type["Display"]
        })

    lot = nhi_line_therapy_map.get(row_new.get("lot", "").strip())
    if lot:
        result.update({
            "lot_text": lot["Display"]
        })

    conti = nhi_conti_status_map.get(row_new.get("continuation", "").strip())
    if lot:
        result.update({
            "continuation_text": conti["Display"]
        })

    tuple_appl = []
    for i in range(len(list_applyreason)):
        apply_reason = nhi_appl_reason_map.get(row_new.get(list_applyreason[i], "").strip())
        if apply_reason:
            tuple_appl.append( (row_new[list_applyreason[i]],apply_reason["Display"],apply_reason["System"]) )
            tmp_list = str(list_applyreason[i]).split("_")
            result.update({
                tmp_list[0] + "_code": row_new[list_applyreason[i]],
                tmp_list[0] + "_text": apply_reason["Display"],
                tmp_list[0] + "_system": apply_reason["System"]
            })
        else:
            tuple_appl.append(("",row_new[list_applyreason[i]], ""))

    tuple_res = ';'.join(['(' + ','.join(f'{item}' for item in t) + ')' for t in tuple_appl])
    result.update({
        "applyReason_mergDisplay": tuple_res
    })


    ## ClaimResponse --ok
    # Response有多筆item時的資料型態?
    # nhi_accept_map
    # nhi_approve_claim_map
    # nhi_approve_item_map
    claim_resp = nhi_approve_claim_map.get(row_new.get("approveComment", "").strip())
    if claim_resp:
        result.update({
            "approveComment_text": claim_resp["Display"]
        })


    ## DiagnosticReport
    # icd_pcs_map
    # report_type_map
    img_item = icd_pcs_map.get(row_new.get("imgItem", "").strip())
    if img_item:
        result.update({
            "imgItem_text": img_item["中文名稱"]
        })

    rep_type = report_type_map.get(row_new.get("reportType", "").strip())
    if rep_type:
        result.update({
            "reportType_text": rep_type["Display"]
        })


    ## Encounter --ok
    # medical_consult_dep_map --ok
    # medical_treat_dep_map --no use
    enc = medical_consult_dep_map.get(row_new.get("funcType", "").strip())
    if enc:
        result.update({
            "funcType_text": enc["診療科別"]
        })


    ## ImagingStudy --ok
    #### dicom_cid_map  --ok 因為沒dicom 填在DiagnosticImgReport下


    ## MedicationRequest --ok
    # med_freq_nhi_map
    # med_path_map
    # med_fda_map
    # med_device_fda_map
    # med_status_reason_map
    # nhi_drug_category_map
    # nhi_med_map
    # ucum_units_map
    tuple_med = []
    l_med = []
    for i in range(len(list_medFreq)):
        med_freq = med_freq_nhi_map.get(row_new.get(list_medFreq[i], "").strip())
        if med_freq:
            tuple_med.append((row_new[list_medFreq[i]],med_freq["Display"], med_freq["System"]))
            l_med.append(med_freq["Display"])
            #result.update({
            #    list_medFreq[i] + "_text": med_freq["Display"],
            #    list_medFreq[i] + "_system": med_freq["System"]
            #})
    tuple_res = ';'.join(['(' + ','.join(f'{item}' for item in t) + ')' for t in tuple_med])
    t_med = ','.join(l_med)
    result.update({
        "applDrugFre_mergDisplay": tuple_res,
        "applDrugFre_mergText": t_med
    })


    drug_route = med_path_map.get(row_new.get("drugRoute", "").strip())
    if drug_route:
        result.update({
            "drugRoute_text": drug_route["Display"]
        })

    apply_drug = med_path_map.get(row_new.get("applDrugRoute", "").strip())
    if apply_drug:
        result.update({
            "applDrugRoute_text": apply_drug["Display"]
        })

    ca_drug = nhi_drug_category_map.get(row_new.get("drugType", "").strip())
    if ca_drug:
        result.update({
            "drugType_text": ca_drug["Display"]
        })

    medreq_cancer_drug = nhi_med_map.get(row_new.get("cancerDrugType", "").strip())
    if medreq_cancer_drug:
        result.update({
            "cancerDrugType_text": medreq_cancer_drug["Display"]
        })

    e_reason = med_status_reason_map.get(row_new.get("eReason", "").strip())
    if e_reason:
        result.update({
            "eReason_text": e_reason["Display"]
        })

    drug_code = nhi_med_map.get(row_new.get("drugCode", "").strip())
    if drug_code:
        result.update({
            "drugCode_text": drug_code["Display"]
        })

    dose_unit = ucum_units_map.get(row_new.get("doseUnit", "").strip())
    if dose_unit:
        result.update({
            "doseUnit_text": dose_unit["Display"]
        })

    appl_qty_unit = ucum_units_map.get(row_new.get("applQtyUnit", "").strip())
    if dose_unit:
        result.update({
            "applQtyUnit_text": appl_qty_unit["Display"]
        })


    ## Observation
    # cancer_map
    # cancer_score_map
    # dna_change_type_map
    # gene_code_map
    # gene_method_map
    # gene_method_txt_map
    # nhi_sup_info_type_map
    # nhi_tx_ast_map
    # pat_ast_map
    # observ_interpre_map
    ### Cancer
    cancer = cancer_map.get(row_new.get("assessItem", "").strip())
    if cancer:
        result.update({
            "assessItem_text": cancer["display"]
        })

    cancer_score = cancer_score_map.get(row_new.get("assessScore", "").strip())
    if cancer_score:
        result.update({
            "assessScore_text": cancer_score["display"]
        })

    ### Diagnostic
    mutation_type = dna_change_type_map.get(row_new.get("mutationType", "").strip())
    if mutation_type:
        result.update({
            "mutationType_text": mutation_type["Display"]
        })

    genInterpre = observ_interpre_map.get(row_new.get("genInterpretation", "").strip())
    if genInterpre:
        result.update({
            "genInterpretation_text": genInterpre["Display"]
        })

    gen_testcode = gene_code_map.get(row_new.get("genTestCode", "").strip())
    if gen_testcode:
        result.update({
            "genTestCode_text": gen_testcode["Display"]
        })

    gen_method_txt = gene_method_txt_map.get(row_new.get("genMethod", "").strip())
    if gen_method_txt:
        result.update({
            "genMethod_code": gen_method_txt["code"]
        })


    ### Laboratory
    # 少了對應的tablei: loinccode(無法建立一table, 因為太多種類)
    inspect_res = observ_interpre_map.get(row_new.get("inspectResultTxt", "").strip())
    if inspect_res:
        result.update({
            "inspectResultTxt_text": inspect_res["Display"]
        })


    ### Patient Assessment
    nyha_ast = pat_ast_map.get(row_new.get("patAst", "").strip())
    if nyha_ast:
        result.update({
            "patAst_text": nyha_ast["Display"]
        })

    ### Treatment
    tx_ast = nhi_tx_ast_map.get(row_new.get("txAst", "").strip())
    if tx_ast:
        result.update({
            "txAst_text": tx_ast["Display"]
        })

    ## Organization
    #### identifier_type_map --ok
    org = org_identifier_map.get(row_new.get("hospId", "").strip())
    if org:
        result.update({
            "hosp_name": org["Display"]
        })

    ## Patient --ok
    #### identifier_type_map --ok

    ## Procedure
    proc = icd_pcs_map.get(row_new.get("rt", "").strip())
    if proc:
        result.update({
            "rt_text": proc["中文名稱"]
        })


    ## Practitioner --ok
    #### identifier_type_map --ok 

    ## Spcimen --ok
    # specime_type_map
    speci = specime_type_map.get(row_new.get("specimenType", "").strip())
    if speci:
        result.update({
            "specimenType_text": speci["Display"]
        })

    ## Substance
    # icd_pcs_map --ok



    # === 處理Resource div自動填入部份 ===
    append_div_dict = {}
    div_paths = glob.glob(os.path.join(os.getcwd(), "div_template", "*.html"))
    #filenames = [os.path.basename(p) for p in div_paths]
    #fs_no_ext = [os.path.splitext(name)[0] for name in filenames]

    for fh in div_paths:
        html_content = read_html_file_as_string(fh)
        fh_resource =  (os.path.splitext(os.path.basename(fh))[0]).split("_")[1]

        params = {k: str(result[k]) for k in div_dict[fh_resource]}
        # 使用 ** 展開傳入 format
        try:
            div_result = html_content.format(**params)
            append_div_dict[fh_resource + "_div"] = div_result
        except Exception as e:
            print("div-Exception", e)
            print("related params", params)

    result.update(append_div_dict)


    return result





# === 讀取與轉換 CSV ===
div_dict = {}
with open('div_data.json', 'r') as file:
    div_dict = json.load(file)

data = []
with open(csv_name, 'r', encoding='utf-8-sig') as csvfile:
    #next(csvfile)

    reader = csv.DictReader(csvfile)
    for row in reader:
        data.append(transform_row(row))

# === 寫出 JSON ===
with open('output.json', 'w', encoding='utf-8') as jsonfile:
    json.dump(data, jsonfile, indent=4, ensure_ascii=False)

print(f"✅ 轉換完成，輸出筆數：{len(data)}，寫入 output.json")
