import * as XLSX from "xlsx";
import { apiGet, apiPost } from "./api";
import { calcGrandTotal } from "../types";
import type { InvoiceData, CustomerDetails, ProductDetails, ServiceDetails } from "../types";

export interface InvoiceApiRecord {
  _id: string;
  invoiceNumber: string;
  customer: CustomerDetails;
  product: ProductDetails;
  service: ServiceDetails;
  createdAt: string;
}

/** Creates the invoice on the shared backend. Invoice number is assigned server-side. */
export async function createInvoice(data: InvoiceData): Promise<InvoiceApiRecord> {
  return apiPost<InvoiceApiRecord>("/api/invoices", {
    customer: data.customer,
    product: data.product,
    service: data.service,
  });
}

/** Fetches every invoice from every device — this is the shared list. */
export async function fetchAllInvoices(): Promise<InvoiceApiRecord[]> {
  return apiGet<InvoiceApiRecord[]>("/api/invoices");
}

export function toInvoiceData(record: InvoiceApiRecord): InvoiceData {
  return {
    customer: record.customer,
    product: record.product,
    service: { ...record.service, invoiceNumber: record.invoiceNumber },
  };
}

/** Exports the current shared list as a downloadable .xlsx workbook. */
export async function exportRecordsToExcel(): Promise<void> {
  const records = await fetchAllInvoices();
  if (records.length === 0) {
    alert("No invoice records saved yet.");
    return;
  }
  const rows = records.map((r) => ({
    "Invoice No": r.invoiceNumber,
    "Saved At": new Date(r.createdAt).toLocaleString("en-GB"),
    "Invoice Date": r.service.invoiceDate,
    "Customer Name": r.customer.name,
    "Contact No": r.customer.contact,
    Brand: r.product.brand,
    "Model Number": r.product.modelNumber,
    "Serial Number": r.product.serialNumber,
    "Repair Type": r.product.repairType,
    "Service Type": r.product.serviceType,
    "Problem Diagnosed": r.service.problemDiagnosed,
    "Spare Parts Changed": r.service.sparePartsChanged,
    "Spare Parts Cost (₹)": r.service.sparePartsCost,
    "Service Charge (₹)": r.service.serviceCharge,
    "Grand Total (₹)": calcGrandTotal(r.service).toFixed(2),
  }));
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 10 }, { wch: 18 }, { wch: 12 }, { wch: 20 }, { wch: 14 },
    { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 14 },
    { wch: 30 }, { wch: 26 }, { wch: 16 }, { wch: 16 }, { wch: 14 },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
  const fileName = `Chromatic_Point_Invoices_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
