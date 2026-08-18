import { KEYBOARD_BRANDS, BRAND_OPTIONS } from "../data/brandFields";
import type { ProductDetails } from "../types";

interface Props {
  product: ProductDetails;
  onChange: (next: ProductDetails) => void;
}

export default function ProductFieldsSection({ product, onChange }: Props) {
  const brandConfig = product.brand ? KEYBOARD_BRANDS[product.brand] : null;

  const set = <K extends keyof ProductDetails>(key: K, value: ProductDetails[K]) =>
    onChange({ ...product, [key]: value });

  const handleBrandChange = (brandKey: string) => {
    // Selecting a new brand resets the brand-dependent fields so stale
    // values from a previous brand don't linger in the fields box.
    onChange({
      ...product,
      brand: brandKey,
      productSubCategory: "",
      modelNumber: "",
    });
  };

  return (
    <section className="card">
      <h2>Product / Service Details</h2>

      <div className="field">
        <label htmlFor="brand">Keyboard Brand</label>
        <select id="brand" value={product.brand} onChange={(e) => handleBrandChange(e.target.value)}>
          <option value="">Select a brand&hellip;</option>
          {BRAND_OPTIONS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {brandConfig && (
        <div className="brand-box">
          <div className="grid">
            <div className="field">
              <label htmlFor="productSubCategory">Product Sub-Category</label>
              <select
                id="productSubCategory"
                value={product.productSubCategory}
                onChange={(e) => set("productSubCategory", e.target.value)}
              >
                <option value="">Select type&hellip;</option>
                {brandConfig.subCategories.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="modelNumber">Model Number</label>
              <input
                id="modelNumber"
                list="model-suggestions"
                value={product.modelNumber}
                onChange={(e) => set("modelNumber", e.target.value)}
                placeholder="e.g. PSR-2100"
              />
              {brandConfig.commonModels.length > 0 && (
                <datalist id="model-suggestions">
                  {brandConfig.commonModels.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              )}
            </div>

            <div className="field">
              <label htmlFor="serialNumber">Serial Number</label>
              <input
                id="serialNumber"
                value={product.serialNumber}
                onChange={(e) => set("serialNumber", e.target.value)}
                placeholder="666974"
              />
            </div>

            <div className="field">
              <label htmlFor="repairType">Repair Type</label>
              <select id="repairType" value={product.repairType} onChange={(e) => set("repairType", e.target.value)}>
                <option>Carry-In</option>
                <option>On-Site</option>
                <option>Pick-Up</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="serviceType">Service Type</label>
              <select id="serviceType" value={product.serviceType} onChange={(e) => set("serviceType", e.target.value)}>
                <option>Out-Warranty</option>
                <option>In-Warranty</option>
                <option>AMC</option>
              </select>
            </div>

            <div className="field full">
              <label htmlFor="accessories">Accessories</label>
              <input
                id="accessories"
                value={product.accessories}
                onChange={(e) => set("accessories", e.target.value)}
                placeholder="Only KB / Adapter, Stand, etc."
              />
            </div>
          </div>
        </div>
      )}

      {!brandConfig && <p className="hint">Select a brand above to open the product fields.</p>}
    </section>
  );
}
