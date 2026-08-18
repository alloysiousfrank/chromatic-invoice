import type { CustomerDetails } from "../types";

interface Props {
  customer: CustomerDetails;
  onChange: (next: CustomerDetails) => void;
}

export default function CustomerDetailsSection({ customer, onChange }: Props) {
  const set = <K extends keyof CustomerDetails>(key: K, value: CustomerDetails[K]) =>
    onChange({ ...customer, [key]: value });

  return (
    <section className="card">
      <h2>Customer Details</h2>
      <div className="grid">
        <div className="field">
          <label htmlFor="custName">Name</label>
          <input id="custName" value={customer.name} onChange={(e) => set("name", e.target.value)} placeholder="Annai Velankani Shine" />
        </div>
        <div className="field">
          <label htmlFor="landline">Landline No</label>
          <input id="landline" value={customer.landline} onChange={(e) => set("landline", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="contact">Contact No</label>
          <input id="contact" value={customer.contact} onChange={(e) => set("contact", e.target.value)} inputMode="tel" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={customer.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="address">Address</label>
          <input id="address" value={customer.address} onChange={(e) => set("address", e.target.value)} placeholder="Mettupalayam" />
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input id="city" value={customer.city} onChange={(e) => set("city", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="state">State</label>
          <input id="state" value={customer.state} onChange={(e) => set("state", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pincode">Pincode</label>
          <input id="pincode" value={customer.pincode} onChange={(e) => set("pincode", e.target.value)} inputMode="numeric" />
        </div>
      </div>
    </section>
  );
}
