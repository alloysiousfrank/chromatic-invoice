import { useEffect, useState } from "react";
import { LOGO_BASE64 } from "../assets/logo";
import type { InvoiceData } from "../types";
import { downloadInvoicePdf } from "../utils/generateInvoicePdf";
import { generateUpiQrDataUrl } from "../utils/qrCode";

interface Props {
  data: InvoiceData;
}

export default function InvoicePreview({ data }: Props) {
  const { customer, product, service } = data;
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const amountStr = parseFloat(service.amount || "0").toFixed(2);

  useEffect(() => {
    let cancelled = false;
    generateUpiQrDataUrl(amountStr, `Chromatic Point - ${customer.name || "Invoice"}`)
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
  }, [amountStr, customer.name]);

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
        <div className="invoice-header">
          <img src={LOGO_BASE64} alt="Chromatic Point logo" className="invoice-logo" />
          <div className="invoice-identity">
            <h3>CHROMATIC POINT</h3>
            <p>Music Instrument Service Center</p>
            <p>15 Velampalayam, Tiruppur - 641652</p>
            <p>Contact: 8056371576 &nbsp;|&nbsp; jewtirupur@gmail.com</p>
          </div>
          <div className="invoice-date">Date: {dateStr}</div>
        </div>

        <table className="invoice-table">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{or(customer.name)}</td>
              <th>Landline No</th>
              <td>{or(customer.landline)}</td>
            </tr>
            <tr>
              <th>Contact No</th>
              <td>{or(customer.contact)}</td>
              <th>Email</th>
              <td>{or(customer.email)}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{or(customer.address)}</td>
              <th>City</th>
              <td>{or(customer.city)}</td>
            </tr>
            <tr>
              <th>State</th>
              <td>{or(customer.state)}</td>
              <th>Pincode</th>
              <td>{or(customer.pincode)}</td>
            </tr>
          </tbody>
        </table>

        <h4 className="section-label">Product Details</h4>
        <table className="invoice-table">
          <tbody>
            <tr>
              <th>Product Category</th>
              <td>{or(product.productCategory)}</td>
              <th>Sub-Category</th>
              <td>{or(product.productSubCategory)}</td>
            </tr>
            <tr>
              <th>Brand</th>
              <td>{or(product.brand)}</td>
              <th>Model Number</th>
              <td>{or(product.modelNumber)}</td>
            </tr>
            <tr>
              <th>Serial Number</th>
              <td>{or(product.serialNumber)}</td>
              <th>Repair Type</th>
              <td>{or(product.repairType)}</td>
            </tr>
            <tr>
              <th>Service Type</th>
              <td>{or(product.serviceType)}</td>
              <th>Accessories</th>
              <td>{or(product.accessories)}</td>
            </tr>
          </tbody>
        </table>

        <h4 className="section-label">Product Condition</h4>
        <p className="condition-box">{or(service.condition)}</p>

        <p className="diagnosis"><strong>Problem Diagnosed:</strong> {or(service.problemDiagnosed)}</p>
        <p className="amount"><strong>Amount:</strong> ₹ {amountStr}</p>

        <div className="qr-block">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="UPI payment QR code" className="qr-image" />
          ) : (
            <div className="qr-image qr-placeholder">QR</div>
          )}
          <span className="qr-caption">Scan to pay (UPI)</span>
        </div>

        <div className="signatures">
          <div className="sig-line">Customer&apos;s Signature</div>
          <div className="sig-line">Receiver&apos;s Signature</div>
        </div>
      </div>
    </section>
  );
}
