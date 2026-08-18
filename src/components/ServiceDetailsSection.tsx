import { calcGrandTotal } from "../types";
import type { ServiceDetails } from "../types";

interface Props {
  service: ServiceDetails;
  onChange: (next: ServiceDetails) => void;
}

export default function ServiceDetailsSection({ service, onChange }: Props) {
  const set = <K extends keyof ServiceDetails>(key: K, value: ServiceDetails[K]) =>
    onChange({ ...service, [key]: value });

  const grandTotal = calcGrandTotal(service);

  return (
    <section className="card">
      <h2>Condition, Diagnosis &amp; Charges</h2>
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
        <div className="field full">
          <label htmlFor="spareParts">Spare Parts Changed</label>
          <textarea
            id="spareParts"
            value={service.sparePartsChanged}
            onChange={(e) => set("sparePartsChanged", e.target.value)}
            placeholder="e.g. Memory IC, Power Supply Board, Keypad Ribbon"
          />
        </div>
        <div className="field">
          <label htmlFor="sparePartsCost">Spare Parts Cost (₹)</label>
          <input
            id="sparePartsCost"
            type="number"
            step="0.01"
            inputMode="decimal"
            value={service.sparePartsCost}
            onChange={(e) => set("sparePartsCost", e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="field">
          <label htmlFor="serviceCharge">Service Charge (₹)</label>
          <input
            id="serviceCharge"
            type="number"
            step="0.01"
            inputMode="decimal"
            value={service.serviceCharge}
            onChange={(e) => set("serviceCharge", e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="field">
          <label htmlFor="invDate">Invoice Date</label>
          <input id="invDate" type="date" value={service.invoiceDate} onChange={(e) => set("invoiceDate", e.target.value)} />
        </div>
      </div>

      <div className="grand-total-live">
        <span>Grand Total</span>
        <strong>₹ {grandTotal.toFixed(2)}</strong>
      </div>
    </section>
  );
}
