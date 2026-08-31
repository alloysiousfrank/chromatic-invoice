import { useEffect, useState, useCallback } from "react";
import PasswordGate from "./components/PasswordGate";
import CustomerDetailsSection from "./components/CustomerDetailsSection";
import ProductFieldsSection from "./components/ProductFieldsSection";
import ServiceDetailsSection from "./components/ServiceDetailsSection";
import InvoicePreview from "./components/InvoicePreview";
import InvoiceRecordsList from "./components/InvoiceRecordsList";
import { emptyCustomer, emptyProduct, emptyService } from "./types";
import type { InvoiceData } from "./types";
import { createInvoice, fetchAllInvoices, exportRecordsToExcel, toInvoiceData } from "./utils/invoiceStore";
import type { InvoiceApiRecord } from "./utils/invoiceStore";

function InvoiceApp() {
  const [customer, setCustomer] = useState(emptyCustomer);
  const [product, setProduct] = useState(emptyProduct);
  const [service, setService] = useState(emptyService);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [records, setRecords] = useState<InvoiceApiRecord[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const loadRecords = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const data = await fetchAllInvoices();
      setRecords(data);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Failed to load invoices.");
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      const record = await createInvoice({ customer, product, service });
      const data = toInvoiceData(record);
      setInvoice(data);
      setRecords((prev) => [record, ...prev]);
      requestAnimationFrame(() => {
        document.getElementById("invoice-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Failed to generate invoice.");
    } finally {
      setGenerating(false);
    }
  };

  const canGenerate = customer.name.trim() !== "" && product.brand !== "" && !generating;

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
          {generating ? "Generating…" : "Generate Invoice"}
        </button>
        {!canGenerate && !generating && (
          <p className="hint center">Enter the customer name and select a brand to generate.</p>
        )}
        {generateError && <p className="gate-error center">{generateError}</p>}

        {invoice && <InvoicePreview data={invoice} />}

        <InvoiceRecordsList records={records} loading={listLoading} error={listError} />

        <section className="card records-card">
          <button className="btn btn-export" onClick={exportRecordsToExcel}>
            Export All to Excel
          </button>
          <p className="hint">
            Every generated invoice is saved to the shared record book — visible from any
            device — and can be exported as an .xlsx file any time.
          </p>
        </section>
      </main>

      <footer className="app-footer">
        <p>Invoices are stored securely on the shared server. PDFs are generated and downloaded only — never emailed automatically.</p>
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
