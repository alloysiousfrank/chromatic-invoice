import { useState } from "react";
import PasswordGate from "./components/PasswordGate";
import CustomerDetailsSection from "./components/CustomerDetailsSection";
import ProductFieldsSection from "./components/ProductFieldsSection";
import ServiceDetailsSection from "./components/ServiceDetailsSection";
import InvoicePreview from "./components/InvoicePreview";
import { emptyCustomer, emptyProduct, emptyService } from "./types";
import type { InvoiceData } from "./types";
import { saveInvoiceRecord, exportRecordsToExcel, getAllRecords } from "./utils/invoiceStore";
import { generateInvoiceNumber } from "./utils/invoiceNumber";

function InvoiceApp() {
  const [customer, setCustomer] = useState(emptyCustomer);
  const [product, setProduct] = useState(emptyProduct);
  const [service, setService] = useState(emptyService);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [recordCount, setRecordCount] = useState(() => getAllRecords().length);

  const handleGenerate = () => {
    const invoiceNumber = generateInvoiceNumber();
    const finalService = { ...service, invoiceNumber };
    const data: InvoiceData = { customer, product, service: finalService };
    setService(finalService);
    setInvoice(data);
    saveInvoiceRecord(data);
    setRecordCount(getAllRecords().length);
    requestAnimationFrame(() => {
      document.getElementById("invoice-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const canGenerate = customer.name.trim() !== "" && product.brand !== "";

  return (
    <div className="app">
      <header className="app-header">
        <h1>Chromatic Point</h1>
        <p>Invoice / Job Card Generator — Admin Panel</p>
      </header>

      <main className="app-main">
        <CustomerDetailsSection customer={customer} onChange={setCustomer} />
        <ProductFieldsSection product={product} onChange={setProduct} />
        <ServiceDetailsSection service={service} onChange={setService} />

        <button className="btn btn-generate" disabled={!canGenerate} onClick={handleGenerate}>
          Generate Invoice
        </button>
        {!canGenerate && (
          <p className="hint center">Enter the customer name and select a brand to generate.</p>
        )}

        {invoice && <InvoicePreview data={invoice} />}

        <section className="card records-card">
          <h2>Invoice Records</h2>
          <p className="hint">
            {recordCount === 0
              ? "No invoices saved on this device yet."
              : `${recordCount} invoice${recordCount === 1 ? "" : "s"} saved on this device.`}
          </p>
          <button className="btn btn-export" onClick={exportRecordsToExcel}>
            Export All to Excel
          </button>
          <p className="hint">
            Records are stored in this browser only — they export as an .xlsx file you can
            keep as your running record book.
          </p>
        </section>
      </main>

      <footer className="app-footer">
        <p>Runs entirely in your browser. Nothing is emailed or sent — download only.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PasswordGate>
      <InvoiceApp />
    </PasswordGate>
  );
}
