import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  detectTablesFromText,
  extractKeyValuePairs,
  extractDates,
  extractNumbers,
} from '@/services/extraction/textExtractor';

describe('Business Document Extraction Fixtures', () => {
  describe('Commercial Invoice Fixture', () => {
    const invoiceText = `
INVOICE
Apex Engineering Services Ltd.
100 Industrial Parkway, Suite 400

Invoice Number: INV-2024-8839
Date: 2024-04-15
Due Date: 2024-05-15
PO Number: PO-99210
Customer: Zenith Logistics Corp

Line    Description                      Qty    Unit Rate    Total
1       HVAC Maintenance & Inspection    2      $450.00      $900.00
2       Cooling Fan Assembly 240V        4      $125.00      $500.00
3       Thermostat Sensor Calibration    6      $75.00       $450.00

Subtotal: $1,850.00
Tax (10%): $185.00
Total Due: $2,035.00
Payment Terms: Net 30 Days
`;

    it('extracts invoice metadata as key-value pairs', () => {
      const pairs = extractKeyValuePairs(invoiceText);
      const findVal = (k: string) => pairs.find(p => p.key.toLowerCase() === k.toLowerCase())?.value;

      assert.strictEqual(findVal('Invoice Number'), 'INV-2024-8839');
      assert.strictEqual(findVal('Date'), '2024-04-15');
      assert.strictEqual(findVal('Due Date'), '2024-05-15');
      assert.strictEqual(findVal('PO Number'), 'PO-99210');
      assert.strictEqual(findVal('Total Due'), '$2,035.00');
    });

    it('extracts line item table with headers and row data', () => {
      const tables = detectTablesFromText([invoiceText]);
      assert.strictEqual(tables.length, 1);

      const table = tables[0];
      assert.deepStrictEqual(table.headers, ['Line', 'Description', 'Qty', 'Unit Rate', 'Total']);
      assert.strictEqual(table.rows.length, 3);
      assert.strictEqual(table.rows[0][1], 'HVAC Maintenance & Inspection');
      assert.strictEqual(table.rows[0][4], '$900.00');
      assert.strictEqual(table.rows[1][1], 'Cooling Fan Assembly 240V');
      assert.strictEqual(table.rows[2][1], 'Thermostat Sensor Calibration');
    });

    it('identifies financial dates and monetary sums', () => {
      const dates = extractDates(invoiceText);
      assert.ok(dates.includes('2024-04-15'));
      assert.ok(dates.includes('2024-05-15'));

      const amounts = extractNumbers(invoiceText);
      assert.ok(amounts.some(a => a.includes('$1,850.00')));
      assert.ok(amounts.some(a => a.includes('$2,035.00')));
    });
  });

  describe('Construction Bill of Quantities (BOQ) Fixture', () => {
    const boqText = `
BILL OF QUANTITIES
PROJECT: Commercial Plaza Phase 2
LOCATION: Sector 14, Metro City

Item No    Description                              Unit    Quantity    Unit Rate    Total Amount
1.01       Excavation for foundation trench         m3      350         $45.00       $15,750.00
1.02       Reinforced concrete grade 30             m3      120         $180.00      $21,600.00
1.03       High tensile steel rebar dia 16mm        kg      4500        $2.20        $9,900.00
1.04       Solid brick masonry in cement mortar     m2      280         $35.00       $9,800.00

Total BOQ Estimate: $57,050.00
`;

    it('extracts the multi-column construction BOQ table accurately', () => {
      const tables = detectTablesFromText([boqText]);
      assert.strictEqual(tables.length, 1);

      const table = tables[0];
      assert.deepStrictEqual(table.headers, ['Item No', 'Description', 'Unit', 'Quantity', 'Unit Rate', 'Total Amount']);
      assert.strictEqual(table.rows.length, 4);

      // Verify foundation trench
      assert.strictEqual(table.rows[0][0], '1.01');
      assert.strictEqual(table.rows[0][1], 'Excavation for foundation trench');
      assert.strictEqual(table.rows[0][2], 'm3');
      assert.strictEqual(table.rows[0][3], '350');

      // Verify steel rebar
      assert.strictEqual(table.rows[2][0], '1.03');
      assert.strictEqual(table.rows[2][3], '4500');
      assert.strictEqual(table.rows[2][5], '$9,900.00');
    });

    it('identifies project metadata and grand total', () => {
      const pairs = extractKeyValuePairs(boqText);
      const findVal = (k: string) => pairs.find(p => p.key.toLowerCase() === k.toLowerCase())?.value;

      assert.strictEqual(findVal('PROJECT'), 'Commercial Plaza Phase 2');
      assert.strictEqual(findVal('Total BOQ Estimate'), '$57,050.00');
    });
  });

  describe('Bank Statement Fixture', () => {
    const statementText = `
GLOBAL HORIZONS BANK
Monthly Account Statement

Account Number: 9812-4410-5502
Statement Date: 2024-09-01
Account Holder: Jonathan Miller
Currency: USD

Date          Description                     Debit       Credit      Balance
2024-08-01    Opening Balance                                         $12,450.00
2024-08-03    Payroll Direct Deposit                      $4,200.00   $16,650.00
2024-08-07    Mortgage Payment Auto-Debit     $1,650.00               $15,000.00
2024-08-14    Grocery Mart #401               $185.50                 $14,814.50
2024-08-28    Electric Utility Provider       $140.00                 $14,674.50

Closing Balance: $14,674.50
`;

    it('extracts bank statement transactions table', () => {
      const tables = detectTablesFromText([statementText]);
      assert.strictEqual(tables.length, 1);

      const table = tables[0];
      assert.deepStrictEqual(table.headers, ['Date', 'Description', 'Debit', 'Credit', 'Balance']);
      assert.strictEqual(table.rows.length, 5);

      // Verify opening balance
      assert.strictEqual(table.rows[0][0], '2024-08-01');
      assert.strictEqual(table.rows[0][1], 'Opening Balance');

      // Verify payroll deposit
      assert.strictEqual(table.rows[1][1], 'Payroll Direct Deposit');
    });

    it('extracts account holder details and balances', () => {
      const pairs = extractKeyValuePairs(statementText);
      const findVal = (k: string) => pairs.find(p => p.key.toLowerCase() === k.toLowerCase())?.value;

      assert.strictEqual(findVal('Account Number'), '9812-4410-5502');
      assert.strictEqual(findVal('Account Holder'), 'Jonathan Miller');
      assert.strictEqual(findVal('Closing Balance'), '$14,674.50');
    });
  });
});
