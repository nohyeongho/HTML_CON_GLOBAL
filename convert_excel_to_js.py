import openpyxl
import json
import os

def convert():
    xlsx_file = "global_model.xlsx"
    js_file = "global-model-data.js"
    
    if not os.path.exists(xlsx_file):
        print(f"Error: {xlsx_file} not found.")
        return

    print(f"Reading {xlsx_file}...")
    wb = openpyxl.load_workbook(xlsx_file, data_only=True)
    sheet = wb.active
    
    data = []
    # B: Model (index 2), C: Prod_cd (index 3), D: Prod_name (index 4)
    # Skipping first row (header)
    count = 0
    for row in sheet.iter_rows(min_row=2, values_only=True):
        corp = row[0]  # Column A
        model = row[1] # Column B
        lv2 = row[2]   # Column C
        lv3 = row[3]   # Column D
        
        if model and lv2 and lv3:
            data.append({
                "corp": str(corp).strip() if corp else "N/A",
                "model": str(model).strip(),
                "lv2": str(lv2).strip(),
                "lv3": str(lv3).strip()
            })
            count += 1
            if count % 50000 == 0:
                print(f"Processed {count} rows...")

    print(f"Total rows processed: {count}")
    
    print(f"Writing to {js_file}...")
    with open(js_file, "w", encoding="utf-8") as f:
        f.write("// This file is auto-generated from global_model.xlsx\n")
        f.write("var globalExcelData = ")
        json.dump(data, f, ensure_ascii=False)
        f.write(";")
    
    print("Done!")

if __name__ == "__main__":
    convert()
