#-*- coding: utf-8 -*-
import os
import json
from datetime import datetime

# 取得當前日期時間物件
now = datetime.now()

# 使用 strftime() 格式化為 YYYYMMDDHHMM 字串
formatted_time = now.strftime("%Y%m%d%H%M")


with open('fhir_conversion_results.json', 'r', encoding='utf-8') as file:
    data = json.load(file)


if isinstance(data, dict):
    if data:
        first_key = list(data.keys())[0]
        first_value = data[first_key]

        # output file name
        f_fhirname = "fhir_conversion_" + str(formatted_time) + ".json"

        with open(os.path.join(os.getcwd(), "fhirData", f_fhirname), "w") as json_file:
            json.dump(first_value, json_file, indent=4, ensure_ascii=False)
    else:
        print("The JSON file is empty")

