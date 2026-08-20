import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LOGO_BASE64 } from "../assets/logo";
import { generateUpiQrDataUrl } from "./qrCode";
import { calcAdvance, calcBalanceDue, calcGrandTotal } from "../types";
import type { InvoiceData } from "../types";
import { getBrandDisplayLabel } from "../data/brandFields";
import {
  BUSINESS_NAME,
  BUSINESS_TAGLINE,
  BUSINESS_ADDRESS,
  BUSINESS_CONTACT,
  BUSINESS_EMAIL,
  WARRANTY_NOTE,
} from "../config/businessConfig";

// Professional palette: deep charcoal-navy ink + warm bronze/gold accent.
const INK: [number, number, number] = [38, 38, 54];
const SLATE: [number, number, number] = [110, 110, 128];
const LINE: [number, number, number] = [222, 222, 232];
const PANEL: [number, number, number] = [246, 246, 250];
const ACCENT: [number, number, number] = [176, 137, 74]; // warm bronze/gold
const ACCENT_LIGHT: [number, number, number] = [250, 242, 228];
const WHITE: [number, number, number] = [255, 255, 255];

function fmtDate(iso: string): string {
  if (!iso) return new Date().toLocaleDateString("en-GB");
  return new Date(iso).toLocaleDateString("en-GB");
}

export async function buildInvoicePdf(data: InvoiceData): Promise<jsPDF> {
  const { customer, product, service } = data;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = 0;

  // --- Header band ---
  const headerHeight = 96;
  doc.setFillColor(...INK);
  doc.rect(0, 0, pageWidth, headerHeight, "F");
  doc.setFillColor(...ACCENT);
  doc.rect(0, headerHeight, pageWidth, 4, "F");

  // Logo on a white rounded chip so it stays legible on the dark band.
  const logoChip = 62;
  doc.setFillColor(...WHITE);
  doc.roundedRect(margin, (headerHeight - logoChip) / 2, logoChip, logoChip, 6, 6, "F");
  doc.addImage(LOGO_BASE64, "JPEG", margin + 6, (headerHeight - logoChip) / 2 + 6, logoChip - 12, logoChip - 12);

  const textX = margin + logoChip + 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...WHITE);
  doc.text(BUSINESS_NAME, textX, 36);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...ACCENT_LIGHT);
  doc.text(BUSINESS_TAGLINE, textX, 50);
  doc.setTextColor(220, 220, 230);
  doc.text(BUSINESS_ADDRESS, textX, 63);
  doc.text(`Contact: ${BUSINESS_CONTACT}   |   ${BUSINESS_EMAIL}`, textX, 76);

  // Invoice number + date, right-aligned in the header band
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...ACCENT_LIGHT);
  doc.text(service.invoiceNumber || "INVOICE", pageWidth - margin, 34, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(220, 220, 230);
  doc.text("Date: " + fmtDate(service.invoiceDate), pageWidth - margin, 50, { align: "right" });

  y = headerHeight + 26;

  const or = (v: string) => v || "-";

  // --- Customer details ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ACCENT);
  doc.text("CUSTOMER DETAILS", margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: { fontSize: 9, textColor: INK, lineColor: LINE, cellPadding: 6 },
    headStyles: { fillColor: INK, textColor: WHITE, fontStyle: "bold" },
    alternateRowStyles: { fillColor: PANEL },
    body: [
      [
        { content: "Name", styles: { fontStyle: "bold", fillColor: PANEL } },
        or(customer.name),
        { content: "Contact No", styles: { fontStyle: "bold", fillColor: PANEL } },
        or(customer.contact),
      ],
      [
        { content: "Address", styles: { fontStyle: "bold", fillColor: PANEL } },
        or(customer.address),
        { content: "City / State", styles: { fontStyle: "bold", fillColor: PANEL } },
        `${or(customer.city)} / ${or(customer.state)}`,
      ],
      [
        { content: "Email", styles: { fontStyle: "bold", fillColor: PANEL } },
        or(customer.email),
        { content: "Pincode", styles: { fontStyle: "bold", fillColor: PANEL } },
        or(customer.pincode),
      ],
    ],
    columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 160 }, 2: { cellWidth: 90 }, 3: { cellWidth: 175 } },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 22;

  // --- Product details ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ACCENT);
  doc.text("PRODUCT DETAILS", margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: { fontSize: 9, textColor: INK, lineColor: LINE, cellPadding: 6 },
    alternateRowStyles: { fillColor: PANEL },
    body: [
      [
        { content: "Brand", styles: { fontStyle: "bold", fillColor: PANEL } },
        or(getBrandDisplayLabel(product.brand, product.customBrandName)),
        { content: "Sub-Category", styles: { fontStyle: "bold", fillColor: PANEL } },
        or(product.productSubCategory),
      ],
      [
        { content: "Model Number", styles: { fontStyle: "bold", fillColor: PANEL } },
        or(product.modelNumber),
        { content: "Serial Number", styles: { fontStyle: "bold", fillColor: PANEL } },
        or(product.serialNumber),
      ],
      [
        { content: "Repair Type", styles: { fontStyle: "bold", fillColor: PANEL } },
        or(product.repairType),
        { content: "Service Type", styles: { fontStyle: "bold", fillColor: PANEL } },
        or(product.serviceType),
      ],
      [
        { content: "Accessories", styles: { fontStyle: "bold", fillColor: PANEL } },
        { content: or(product.accessories), colSpan: 3 },
      ],
    ],
    columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 160 }, 2: { cellWidth: 90 }, 3: { cellWidth: 175 } },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 22;

  // --- Condition + diagnosis ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ACCENT);
  doc.text("CONDITION & DIAGNOSIS", margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: { fontSize: 9, textColor: INK, lineColor: LINE, cellPadding: 6 },
    body: [
      [{ content: "Product Condition", styles: { fontStyle: "bold", fillColor: PANEL, cellWidth: 130 } }, or(service.condition)],
      [{ content: "Problem Diagnosed", styles: { fontStyle: "bold", fillColor: PANEL, cellWidth: 130 } }, or(service.problemDiagnosed)],
      [{ content: "Spare Parts Changed", styles: { fontStyle: "bold", fillColor: PANEL, cellWidth: 130 } }, or(service.sparePartsChanged)],
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 22;

  // --- Charges + Grand Total ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ACCENT);
  doc.text("CHARGES", margin, y);
  y += 8;

  const partsCost = parseFloat(service.sparePartsCost || "0") || 0;
  const serviceCharge = parseFloat(service.serviceCharge || "0") || 0;
  const grandTotal = calcGrandTotal(service);
  const advance = calcAdvance(service);
  const balanceDue = calcBalanceDue(service);
  const hasAdvance = advance > 0;
  const payableStr = (hasAdvance ? balanceDue : grandTotal).toFixed(2);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "plain",
    styles: { fontSize: 9.5, textColor: INK, cellPadding: 7 },
    body: [
      ["Spare Parts Cost", { content: "Rs. " + partsCost.toFixed(2), styles: { halign: "right" } }],
      ["Service Charge", { content: "Rs. " + serviceCharge.toFixed(2), styles: { halign: "right" } }],
    ],
    columnStyles: { 0: { cellWidth: pageWidth - margin * 2 - 160 }, 1: { cellWidth: 160 } },
    didParseCell: (hookData) => {
      hookData.cell.styles.lineWidth = 0;
      hookData.cell.styles.fillColor = PANEL;
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 4;

  // Grand Total — bold accent bar so it stands out immediately.
  const totalBarHeight = 34;
  doc.setFillColor(...ACCENT);
  doc.rect(margin, y, pageWidth - margin * 2, totalBarHeight, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...WHITE);
  doc.text("GRAND TOTAL", margin + 14, y + totalBarHeight / 2 + 4);
  doc.text("Rs. " + grandTotal.toFixed(2), pageWidth - margin - 14, y + totalBarHeight / 2 + 4, { align: "right" });

  y += totalBarHeight + 4;

  // Advance Paid / Balance Due — only shown when an advance was actually recorded.
  if (hasAdvance) {
    const smallBarHeight = 26;
    const ADVANCE_RED: [number, number, number] = [161, 61, 61];
    const BALANCE_GREEN: [number, number, number] = [41, 113, 63];

    doc.setFillColor(...ADVANCE_RED);
    doc.rect(margin, y, pageWidth - margin * 2, smallBarHeight, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...WHITE);
    doc.text("ADVANCE PAID", margin + 14, y + smallBarHeight / 2 + 3.5);
    doc.text("- Rs. " + advance.toFixed(2), pageWidth - margin - 14, y + smallBarHeight / 2 + 3.5, { align: "right" });
    y += smallBarHeight + 4;

    doc.setFillColor(...BALANCE_GREEN);
    doc.rect(margin, y, pageWidth - margin * 2, totalBarHeight, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...WHITE);
    doc.text("BALANCE DUE", margin + 14, y + totalBarHeight / 2 + 4);
    doc.text("Rs. " + balanceDue.toFixed(2), pageWidth - margin - 14, y + totalBarHeight / 2 + 4, { align: "right" });
    y += totalBarHeight;
  }

  y += 24;

  // --- QR code ---
  const qrTop = y;
  const qrSize = 68;
  try {
    const qrDataUrl = await generateUpiQrDataUrl(payableStr, `${BUSINESS_NAME} - ${customer.name || "Invoice"}`);
    doc.setDrawColor(...LINE);
    doc.roundedRect(margin, qrTop, qrSize + 12, qrSize + 12, 4, 4);
    doc.addImage(qrDataUrl, "PNG", margin + 6, qrTop + 6, qrSize, qrSize);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...INK);
    doc.text(`Scan to Pay (UPI) - Rs. ${payableStr}`, margin + qrSize + 24, qrTop + 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...SLATE);
    doc.text("Any UPI app — GPay, PhonePe, Paytm", margin + qrSize + 24, qrTop + 44);
    y = qrTop + qrSize + 12 + 20;
  } catch {
    y += 16;
  }

  // --- Signatures ---
  const sigY = Math.max(y + 30, pageHeight - 120);
  doc.setDrawColor(...LINE);
  doc.line(margin, sigY, margin + 160, sigY);
  doc.line(pageWidth - margin - 160, sigY, pageWidth - margin, sigY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text("Customer's Signature", margin, sigY + 14);
  doc.text("Receiver's Signature", pageWidth - margin - 160, sigY + 14);

  // --- Footer ---
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(1.2);
  doc.line(margin, pageHeight - 50, pageWidth - margin, pageHeight - 50);
  doc.setLineWidth(0.5);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...SLATE);
  const footerLines = doc.splitTextToSize(WARRANTY_NOTE, pageWidth - margin * 2);
  doc.text(footerLines, pageWidth / 2, pageHeight - 34, { align: "center" });

  return doc;
}

export function invoiceFileName(data: InvoiceData): string {
  const namePart = (data.customer.name || "Customer").trim().replace(/\s+/g, "_");
  const datePart = fmtDate(data.service.invoiceDate).replace(/\//g, "-");
  const numberPart = data.service.invoiceNumber || "";
  return `${numberPart ? numberPart + "_" : ""}Invoice_${namePart}_${datePart}.pdf`;
}

/** Generates the PDF and triggers a browser download only — no network call. */
export async function downloadInvoicePdf(data: InvoiceData): Promise<void> {
  const doc = await buildInvoicePdf(data);
  doc.save(invoiceFileName(data));
}
