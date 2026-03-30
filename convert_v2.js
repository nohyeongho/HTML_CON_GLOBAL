// ============================================================
// global_model V2.xlsx → global-model-data.js 변환 스크립트
// 왜 Node.js로 작성? → Python 환경에 openpyxl이 없어서
// 목적: V2 엑셀 파일을 읽어 기존 JS 데이터 형식(var globalExcelData)으로 출력
// ============================================================

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 파일 경로 설정
const xlsxFile = 'global_model V2-1.xlsx';
const jsFile = 'global-model-data.js';

console.log(`[시작] ${xlsxFile} 읽는 중...`);

// 엑셀 파일 읽기
const workbook = XLSX.readFile(xlsxFile);

// 첫 번째 시트 사용
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

console.log(`시트 이름: ${sheetName}`);

// 시트를 JSON 배열로 변환 (header: 1 → 첫 행이 헤더 아닌 배열)
// 헤더 행(1행)을 확인하기 위해 먼저 raw 배열로 읽기
const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// 첫 5행 미리보기 (구조 확인)
console.log('--- 첫 5행 미리보기 ---');
for (let i = 0; i < Math.min(5, rawData.length); i++) {
    console.log(`Row ${i + 1}:`, rawData[i]);
}
console.log('총 행 수:', rawData.length);

// 헤더 행 확인 후 데이터 추출
// 기존 형식: { corp, model, lv2, lv3 } → A, B, C, D 컬럼
const data = [];
let count = 0;

// 1행(index 0)은 헤더이므로 2행(index 1)부터 처리
for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    
    // 빈 행 건너뜀
    if (!row || row.length === 0) continue;
    
    const corp  = row[0]; // A열: 법인 코드
    const model = row[1]; // B열: 모델
    const lv2   = row[2]; // C열: 레벨2
    const lv3   = row[3]; // D열: 레벨3
    
    // model, lv2, lv3 모두 존재할 때만 추가 (기존 로직과 동일)
    if (model && lv2 && lv3) {
        data.push({
            corp:  String(corp  || 'N/A').trim(),
            model: String(model).trim(),
            lv2:   String(lv2).trim(),
            lv3:   String(lv3).trim()
        });
        count++;
        
        if (count % 50000 === 0) {
            console.log(`처리 중: ${count}행...`);
        }
    }
}

console.log(`총 유효 데이터 행 수: ${count}`);

// JS 파일로 출력
console.log(`[쓰기] ${jsFile} 작성 중...`);
const output = `// This file is auto-generated from global_model V2.xlsx\nvar globalExcelData = ${JSON.stringify(data)};`;

fs.writeFileSync(jsFile, output, 'utf8');

console.log(`[완료] ${jsFile} 생성 완료! (${count}개 레코드)`);
