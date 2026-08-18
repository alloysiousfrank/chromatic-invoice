import * as XLSX from "xlsx";
import type { InvoiceData } from "../types";

const STORAGE_KEY = "cp_invoice_records";

export interface InvoiceRecord {
  savedAt: string; // ISO timestamp of when it was generated
  customerName: string;
  contact: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  repairType: string;
  serviceType: string;
  problemDiagnosed: string;
  amount: string;
  invoiceDate: string;
}

function toRecord(data: InvoiceData): InvoiceRecord {
  return {
    savedAt: new Date().toISOString(),
    customerName: data.customer.name,
    contact: data.customer.contact,
    brand: data.product.brand,
    modelNumber: data.product.modelNumber,
    serialNumber: data.product.serialNumber,
    repairType: data.product.repairType,
    serviceType: data.product.serviceType,
    problemDiagnosed: data.service.problemDiagnosed,
    amount: data.service.amount,
    invoiceDate: data.service.invoiceDate,
  };
}

/** Every "Generate Invoice" click appends one row here — this is the running record book. */
export function saveInvoiceRecord(data: InvoiceData): void {
  const existing = getAllRecords();
  existing.push(toRecord(data));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getAllRecords(): InvoiceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InvoiceRecord[]) : [];
  } catch {
    return [];
  }
}

export function clearAllRecords(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Exports every saved record as a downloadable .xlsx workbook — the "Excel sheet". */
export function exportRecordsToExcel(): void {
  const records = getAllRecords();
  if (records.length === 0) {
    alert("No invoice records saved yet.");
    return;
  }
  const rows = records.map((r) => ({
    "Saved At": new Date(r.savedAt).toLocaleString("en-GB"),
    "Invoice Date": r.invoiceDate,
    "Customer Name": r.customerName,
    "Contact No": r.contact,
    Brand: r.brand,
    "Model Number": r.modelNumber,
    "Serial Number": r.serialNumber,
    "Repair Type": r.repairType,
    "Service Type": r.serviceType,
    "Problem Diagnosed": r.problemDiagnosed,
    "Amount (₹)": r.amount,
  }));
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 18 }, { wch: 12 }, { wch: 20 }, { wch: 14 }, { wch: 10 },
    { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 14 }, { wch: 30 }, { wch: 12 },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
  const fileName = `Chromatic_Point_Invoices_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
