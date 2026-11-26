const ExcelJS = require('exceljs');
import { test, expect, Page, request } from '@playwright/test';


const workbook= new ExcelJS.Workbook();

async function WriteExcelFile(searchText , replaceText ,change, filepath){
    await workbook.xlsx.readFile(filepath);
    const worksheet = workbook.getWorksheet('Sheet1');
    const output = readExcelFile(worksheet , searchText); //searchText = Vivo

    const cell = worksheet.getCell(
        output.row,
        output.column + change.colChange
    );
    cell.value = replaceText;
    
    await workbook.xlsx.writeFile(filepath);



   
}


function readExcelFile(worksheet, searchText) {

    let output = {
        row: -1,
        column: -1
    };

    worksheet.eachRow((row, rowNumber) => {

        row.eachCell((cell, colNumber) => {

            if (cell.value === searchText) {

                output.row = rowNumber;
                output.column = colNumber;

            }

        });

    });

    return output;
}

test('upload download excel validation', async ({ page }, testInfo) => {

  const textsearch  = 'Mango';
  const updateValue = '60000';  // ← add this as string for text comparison

  await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');

  // 1. Wait for download BEFORE clicking
  const downloadPromise = page.waitForEvent('download');

  // 2. Click Download
  await page.getByRole('button', { name: 'Download' }).click();

  // 3. Get downloaded file
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.xlsx$/);

  // 4. Save downloaded file
  const filePath = testInfo.outputPath('download.xlsx');
  await download.saveAs(filePath);
  console.log('File saved:', filePath);

  // 5. Modify Excel — change Mango price to 60000
  await WriteExcelFile(
    textsearch,
    60000,
    { rowChange: 0, colChange: 2 },
    filePath
  );

  // 6. Upload modified Excel
  await page.locator('#fileinput').setInputFiles(filePath);
  console.log('File uploaded');

  // ── ASSERTION PART ──────────────────────────────────────────────
  // Find the row that contains "Mango"
  // Then verify that row's price cell shows 60000
  // ─────────────────────────────────────────────────────────────

  // Step 1: Find the Mango row
  const desiredRow = page.getByRole('row')
    .filter({ has: page.getByText(textsearch) });
  // ↑ looks through ALL rows
  //   filters to ONLY the row containing "Mango"

  // Step 2: Verify price cell contains updated value
  await expect(desiredRow.locator('#cell-4-undefined'))
    .toContainText(updateValue);
  // ↑ inside Mango row → find price cell → check it shows 60000

  console.log('Assertion passed — Mango price updated to', updateValue);

});