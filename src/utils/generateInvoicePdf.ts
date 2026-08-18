import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LOGO_BASE64 } from "../assets/logo";
import { generateUpiQrDataUrl } from "./qrCode";
import type { InvoiceData } from "../types";

const INK: [number, number, number] = [61, 61, 78];
const SLATE: [number, number, number] = [138, 138, 154];
const LINE: [number, number, number] = [201, 201, 212];
const PANEL: [number, number, number] = [244, 244, 247];

function fmtDate(iso: string): string {
  if (!iso) return new Date().toLocaleDateString("en-GB");
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB");
}

/**
 * Builds the Chromatic Point invoice PDF and returns the jsPDF instance.
 * Callers can either doc.save(...) it directly (download) or doc.output(...)
 * for a blob/data-uri if a preview or future send feature is ever added.
 */
export async function buildInvoicePdf(data: InvoiceData): Promise<jsPDF> {
  const { customer, product, service } = data;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = 40;

  doc.addImage(LOGO_BASE64, "JPEG", margin, y, 70, 52);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...INK);
  doc.text("CHROMATIC POINT", margin + 82, y + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...SLATE);
  doc.text("MUSIC INSTRUMENT SERVICE CENTER", margin + 82, y + 30);
  doc.text("15 Velampalayam, Tiruppur - 641652", margin + 82, y + 42);
  doc.text("Contact: 8056371576   |   jewtirupur@gmail.com", margin + 82, y + 54);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text("Date: " + fmtDate(service.invoiceDate), pageWidth - margin, y + 16, {
    align: "right",
  });

  y += 74;
  doc.setDrawColor(...LINE);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  const or = (v: string) => v || "-";

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: { fontSize: 9, textColor: INK, lineColor: LINE, cellPadding: 6 },
    headStyles: { fillColor: PANEL, textColor: INK, fontStyle: "bold" },
    body: [
      [
        { content: "Name", styles: { fontStyle: "bold" } },
        or(customer.name),
        { content: "Landline No", styles: { fontStyle: "bold" } },
        or(customer.landline),
      ],
      [
        { content: "Contact No", styles: { fontStyle: "bold" } },
        or(customer.contact),
        { content: "Email", styles: { fontStyle: "bold" } },
        or(customer.email),
      ],
      [
        { content: "Address", styles: { fontStyle: "bold" } },
        or(customer.address),
        { content: "City", styles: { fontStyle: "bold" } },
        or(customer.city),
      ],
      [
        { content: "State", styles: { fontStyle: "bold" } },
        or(customer.state),
        { content: "Pincode", styles: { fontStyle: "bold" } },
        or(customer.pincode),
      ],
    ],
    columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 160 }, 2: { cellWidth: 90 }, 3: { cellWidth: 175 } },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Product Details", margin, y);

  autoTable(doc, {
    startY: y + 8,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: { fontSize: 9, textColor: INK, lineColor: LINE, cellPadding: 6 },
    body: [
      [
        { content: "Product Category", styles: { fontStyle: "bold" } },
        or(product.productCategory),
        { content: "Product Sub-Category", styles: { fontStyle: "bold" } },
        or(product.productSubCategory),
      ],
      [
        { content: "Brand", styles: { fontStyle: "bold" } },
        or(product.brand),
        { content: "Model Number", styles: { fontStyle: "bold" } },
        or(product.modelNumber),
      ],
      [
        { content: "Serial Number", styles: { fontStyle: "bold" } },
        or(product.serialNumber),
        { content: "Repair Type", styles: { fontStyle: "bold" } },
        or(product.repairType),
      ],
      [
        { content: "Service Type", styles: { fontStyle: "bold" } },
        or(product.serviceType),
        { content: "Accessories", styles: { fontStyle: "bold" } },
        or(product.accessories),
      ],
    ],
    columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 160 }, 2: { cellWidth: 90 }, 3: { cellWidth: 175 } },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 16;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: { fontSize: 9, textColor: INK, lineColor: LINE, cellPadding: 6 },
    head: [["Product Condition"]],
    headStyles: { fillColor: PANEL, textColor: INK, fontStyle: "bold" },
    body: [[or(service.condition)]],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Problem Diagnosed:", margin, y);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(or(service.problemDiagnosed), pageWidth - margin * 2 - 120);
  doc.text(lines, margin + 120, y);
  y += Math.max(16, lines.length * 12) + 10;

  doc.setFont("helvetica", "bold");
  const amountNum = parseFloat(service.amount || "0");
  doc.text("Amount: Rs. " + amountNum.toFixed(2), margin, y);

  // UPI QR code — placed below the amount line, own row, so it never
  // competes for space with the diagnosis text or the signature block.
  const qrTop = y + 10;
  const qrSize = 64;
  try {
    const qrDataUrl = await generateUpiQrDataUrl(
      amountNum.toFixed(2),
      `Chromatic Point - ${customer.name || "Invoice"}`
    );
    doc.addImage(qrDataUrl, "PNG", margin, qrTop, qrSize, qrSize);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...SLATE);
    doc.text("Scan to pay (UPI)", margin, qrTop + qrSize + 12);
    y = qrTop + qrSize + 26;
  } catch {
    // QR generation failure should never block the invoice download.
    y += 16;
  }
  doc.setDrawColor(...LINE);
  doc.line(margin, y, margin + 160, y);
  doc.line(pageWidth - margin - 160, y, pageWidth - margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text("Customer's Signature", margin, y + 14);
  doc.text("Receiver's Signature", pageWidth - margin - 160, y + 14);

  return doc;
}

export function invoiceFileName(data: InvoiceData): string {
  const namePart = (data.customer.name || "Customer").trim().replace(/\s+/g, "_");
  const datePart = fmtDate(data.service.invoiceDate).replace(/\//g, "-");
  return `Invoice_${namePart}_${datePart}.pdf`;
}

/** Generates the PDF and triggers a browser download only — no network call. */
export async function downloadInvoicePdf(data: InvoiceData): Promise<void> {
  const doc = await buildInvoicePdf(data);
  doc.save(invoiceFileName(data));
}
