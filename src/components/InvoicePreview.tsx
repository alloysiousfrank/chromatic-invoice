import { useEffect, useState } from "react";
import { LOGO_BASE64 } from "../assets/logo";
import { SIGNATURE_BASE64 } from "../assets/signature";
import { calcAdvance, calcBalanceDue, calcGrandTotal } from "../types";
import type { InvoiceData } from "../types";
import { getBrandDisplayLabel } from "../data/brandFields";
import { downloadInvoicePdf } from "../utils/generateInvoicePdf";
import { generateUpiQrDataUrl } from "../utils/qrCode";
import {
  BUSINESS_NAME,
  BUSINESS_TAGLINE,
  BUSINESS_ADDRESS,
  BUSINESS_CONTACT,
  BUSINESS_EMAIL,
  WARRANTY_NOTE,
} from "../config/businessConfig";

interface Props {
  data: InvoiceData;
}

export default function InvoicePreview({ data }: Props) {
  const { customer, product, service } = data;
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const grandTotal = calcGrandTotal(service);
  const grandTotalStr = grandTotal.toFixed(2);
  const partsCost = (parseFloat(service.sparePartsCost || "0") || 0).toFixed(2);
  const serviceChargeStr = (parseFloat(service.serviceCharge || "0") || 0).toFixed(2);
  const advance = calcAdvance(service);
  const balanceDue = calcBalanceDue(service);
  const hasAdvance = advance > 0;
  const payableStr = (hasAdvance ? balanceDue : grandTotal).toFixed(2);

  useEffect(() => {
    let cancelled = false;
    generateUpiQrDataUrl(payableStr, `${BUSINESS_NAME} - ${customer.name || "Invoice"}`)
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payableStr, customer.name]);

  const dateStr = service.invoiceDate
    ? new Date(service.invoiceDate).toLocaleDateString("en-GB")
    : new Date().toLocaleDateString("en-GB");
  const or = (v: string) => v || "—";

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadInvoicePdf(data);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="card preview" id="invoice-preview">
      <div className="preview-toolbar">
        <h2>Invoice Preview</h2>
        <button className="btn btn-download" onClick={handleDownload} disabled={downloading}>
          {downloading ? "Preparing…" : "Download PDF"}
        </button>
      </div>

      <div className="invoice-sheet">
        <div className="invoice-band">
          <img src={LOGO_BASE64} alt="Chromatic Point logo" className="invoice-logo" />
          <div className="invoice-identity">
            <h3>{BUSINESS_NAME}</h3>
            <p className="tagline">{BUSINESS_TAGLINE}</p>
            <p>{BUSINESS_ADDRESS}</p>
            <p>Contact: {BUSINESS_CONTACT} &nbsp;|&nbsp; {BUSINESS_EMAIL}</p>
          </div>
          <div className="invoice-meta">
            <div className="invoice-number">{service.invoiceNumber || "INVOICE"}</div>
            <div className="invoice-date">Date: {dateStr}</div>
          </div>
        </div>

        <h4 className="section-label">Customer Details</h4>
        <table className="invoice-table">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{or(customer.name)}</td>
              <th>Contact No</th>
              <td>{or(customer.contact)}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{or(customer.address)}</td>
              <th>City / State</th>
              <td>{or(customer.city)} / {or(customer.state)}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{or(customer.email)}</td>
              <th>Pincode</th>
              <td>{or(customer.pincode)}</td>
            </tr>
          </tbody>
        </table>

        <h4 className="section-label">Product Details</h4>
        <table className="invoice-table">
          <tbody>
            <tr>
              <th>Brand</th>
              <td>{or(getBrandDisplayLabel(product.brand, product.customBrandName))}</td>
              <th>Sub-Category</th>
              <td>{or(product.productSubCategory)}</td>
            </tr>
            <tr>
              <th>Model Number</th>
              <td>{or(product.modelNumber)}</td>
              <th>Serial Number</th>
              <td>{or(product.serialNumber)}</td>
            </tr>
            <tr>
              <th>Repair Type</th>
              <td>{or(product.repairType)}</td>
              <th>Service Type</th>
              <td>{or(product.serviceType)}</td>
            </tr>
            <tr>
              <th>Accessories</th>
              <td colSpan={3}>{or(product.accessories)}</td>
            </tr>
          </tbody>
        </table>

        <h4 className="section-label">Condition &amp; Diagnosis</h4>
        <p className="condition-box">{or(service.condition)}</p>
        <p className="diagnosis"><strong>Problem Diagnosed:</strong> {or(service.problemDiagnosed)}</p>
        <p className="diagnosis"><strong>Spare Parts Changed:</strong> {or(service.sparePartsChanged)}</p>

        <h4 className="section-label">Charges</h4>
        <table className="charges-table">
          <tbody>
            <tr>
              <td>Spare Parts Cost</td>
              <td className="right">₹ {partsCost}</td>
            </tr>
            <tr>
              <td>Service Charge</td>
              <td className="right">₹ {serviceChargeStr}</td>
            </tr>
          </tbody>
        </table>
        <div className="grand-total-bar">
          <span>GRAND TOTAL</span>
          <strong>₹ {grandTotalStr}</strong>
        </div>
        {hasAdvance && (
          <>
            <div className="grand-total-bar advance-bar">
              <span>ADVANCE PAID</span>
              <strong>&minus; ₹ {advance.toFixed(2)}</strong>
            </div>
            <div className="grand-total-bar balance-bar">
              <span>BALANCE DUE</span>
              <strong>₹ {balanceDue.toFixed(2)}</strong>
            </div>
          </>
        )}

        <div className="qr-block">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="UPI payment QR code" className="qr-image" />
          ) : (
            <div className="qr-image qr-placeholder">QR</div>
          )}
          <div>
            <span className="qr-caption qr-caption-strong">
              Scan to Pay (UPI) &mdash; ₹ {payableStr}
            </span>
            <br />
            <span className="qr-caption">Any UPI app — GPay, PhonePe, Paytm</span>
          </div>
        </div>

        <div className="signatures">
          <div className="sig-line">Customer&apos;s Signature</div>
          <div className="sig-line sig-line-authorised">
            <img src={SIGNATURE_BASE64} alt="Authorised signatory signature" className="sig-image" />
            Authorised Signatory
          </div>
        </div>

        <p className="warranty-note">{WARRANTY_NOTE}</p>
      </div>
    </section>
  );
}
