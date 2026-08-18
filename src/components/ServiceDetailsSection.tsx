import type { ServiceDetails } from "../types";

interface Props {
  service: ServiceDetails;
  onChange: (next: ServiceDetails) => void;
}

export default function ServiceDetailsSection({ service, onChange }: Props) {
  const set = <K extends keyof ServiceDetails>(key: K, value: ServiceDetails[K]) =>
    onChange({ ...service, [key]: value });

  return (
    <section className="card">
      <h2>Condition, Diagnosis &amp; Amount</h2>
      <div className="grid">
        <div className="field full">
          <label htmlFor="condition">Product Condition</label>
          <input id="condition" value={service.condition} onChange={(e) => set("condition", e.target.value)} placeholder="Blue Screen" />
        </div>
        <div className="field full">
          <label htmlFor="problem">Problem Diagnosed</label>
          <textarea
            id="problem"
            value={service.problemDiagnosed}
            onChange={(e) => set("problemDiagnosed", e.target.value)}
            placeholder="Replacement of Memory ICs and General Service"
          />
        </div>
        <div className="field">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            inputMode="decimal"
            value={service.amount}
            onChange={(e) => set("amount", e.target.value)}
            placeholder="9440.00"
          />
        </div>
        <div className="field">
          <label htmlFor="invDate">Invoice Date</label>
          <input id="invDate" type="date" value={service.invoiceDate} onChange={(e) => set("invoiceDate", e.target.value)} />
        </div>
      </div>
    </section>
  );
}
