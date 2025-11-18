# fhir-guiweb

1. 要安裝需要的套件
guiweb_hub@1.0.0 /data/fhir_hub/guiweb_hub
├── @fhir-uck/fhir-converter-core@1.2.4
├── cors@2.8.5
├── csv-parser@3.2.0
├── csvtojson@2.0.14
└── express@5.1.0

fhir-web-runner@1.0.0 /data/fhir_hub/guiweb_hub/frontend
├── @vitejs/plugin-react@4.7.0
├── autoprefixer@10.4.21
├── postcss@8.5.6
├── react-dom@18.3.1
├── react@18.3.1
├── tailwindcss@3.4.18
└── vite@5.4.21

2. 啟動後端伺服器
npm start
會看到輸出：Server running at http://localhost:3001

3. 啟動前端
cd frontend
npm run dev

