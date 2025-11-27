# fhir-guiweb

## 啟動 FHIR GUIWEB

### 1. 安裝需要的套件

**後端（Backend）**

    guiweb_hub@1.0.0 /data/fhir_hub/guiweb_hub
    ├── @fhir-uck/fhir-converter-core@1.2.4
    ├── cors@2.8.5
    ├── csv-parser@3.2.0
    ├── csvtojson@2.0.14
    ├── express@5.1.0
    └── multer@2.0.2

安裝指令：

``` bash
npm install @fhir-uck/fhir-converter-core csv-parser csvtojson multer
```

------------------------------------------------------------------------

**前端（Frontend）**

    fhir-web-runner@1.0.0 /data/fhir_hub/guiweb_hub/frontend
    ├── @vitejs/plugin-react@4.7.0
    ├── autoprefixer@10.4.21
    ├── postcss@8.5.6
    ├── react-dom@18.3.1
    ├── react@18.3.1
    ├── tailwindcss@3.4.18
    └── vite@5.4.21

安裝指令：

``` bash
cd frontend
npm install
```

------------------------------------------------------------------------

### 2. 啟動後端伺服器

``` bash
npm start
```

成功後會看到：

    Server running at http://localhost:3001

------------------------------------------------------------------------

### 3. 啟動前端

``` bash
cd frontend
npm run dev
```

------------------------------------------------------------------------

## 功能說明

### 1. 有 4 個分頁

-   首頁
-   資料處理
-   Converter
-   Validator

------------------------------------------------------------------------

### 2. 資料處理

-   (a) 可選擇來源檔案並上傳

------------------------------------------------------------------------

### 3. Converter

-   (a) Resource 模板檢視 --- 可查看 Config 檔案所使用的 Resources\

-   (b) 可將 Resource 模板另存為 Config 檔案（相關的 Reference
        也會一併載入）

------------------------------------------------------------------------

### 4. Validator

-   (a) 可選取欲檢測的檔案\

-   (b) 檢測結果顯示：

    -   Success (0)
    -   Error (n) + error list
