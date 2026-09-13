import type { CustomerDetails } from "../types";
import { isContactPickerSupported, pickPhoneNumber } from "../utils/contactPicker";

interface Props {
  customer: CustomerDetails;
  onChange: (next: CustomerDetails) => void;
  invoiceDate: string;
  onInvoiceDateChange: (next: string) => void;
}

export default function CustomerDetailsSection({ customer, onChange, invoiceDate, onInvoiceDateChange }: Props) {
  const set = <K extends keyof CustomerDetails>(key: K, value: CustomerDetails[K]) =>
    onChange({ ...customer, [key]: value });

  const handlePickContact = async () => {
    if (!isContactPickerSupported()) {
      alert(
        "Picking a number from Contacts isn't supported in this browser — this works on Chrome for Android. You can still type the number in directly."
      );
      return;
    }
    const tel = await pickPhoneNumber();
    if (tel) set("contact", tel);
  };

  return (
    <section className="card">
      <h2>Customer Details</h2>
      <div className="grid">
        <div className="field">
          <label htmlFor="custName">Name</label>
          <input id="custName" value={customer.name} onChange={(e) => set("name", e.target.value)} placeholder="Annai Velankani Shine" />
        </div>
        <div className="field">
          <label htmlFor="invDate">Invoice Date</label>
          <input id="invDate" type="date" value={invoiceDate} onChange={(e) => onInvoiceDateChange(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="landline">Landline No</label>
          <input id="landline" value={customer.landline} onChange={(e) => set("landline", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="contact">Contact No</label>
          <div className="input-with-icon">
            <input id="contact" value={customer.contact} onChange={(e) => set("contact", e.target.value)} inputMode="tel" />
            <button
              type="button"
              className="pick-contact-btn"
              onClick={handlePickContact}
              title="Pick from Contacts"
              aria-label="Pick from Contacts"
            >
              👤
            </button>
          </div>
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
