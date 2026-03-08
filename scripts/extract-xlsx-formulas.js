/**
 * Extract cell formulas from hydrant-flow-test-calculator.xlsx
 * Run: node scripts/extract-xlsx-formulas.js
 */
import XLSX from 'xlsx';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, '..', 'hydrant-flow-test-calculator.xlsx');

const buf = readFileSync(path);
const wb = XLSX.read(buf, { type: 'buffer', cellFormula: true, cellStyles: true });

console.log('=== Workbook sheets:', wb.SheetNames);
console.log('');

wb.SheetNames.forEach((name) => {
  const ws = wb.Sheets[name];
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  console.log('--- Sheet:', name, '---');
  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const ref = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[ref];
      if (!cell) continue;
      if (cell.f) {
        console.log(ref, 'FORMULA:', cell.f);
        if (cell.v !== undefined) console.log('  value:', cell.v);
      }
    }
  }
  console.log('');
});
