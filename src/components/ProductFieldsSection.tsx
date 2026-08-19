import { useState } from "react";
import { KEYBOARD_BRANDS, BRAND_OPTIONS } from "../data/brandFields";
import type { ProductDetails } from "../types";

interface Props {
  product: ProductDetails;
  onChange: (next: ProductDetails) => void;
}

const OTHERS = "Others";

const REPAIR_TYPE_OPTIONS = ["Carry-In", "On-Site", "Pick-Up"];
const SERVICE_TYPE_OPTIONS = ["Out-Warranty", "In-Warranty", "AMC"];

export default function ProductFieldsSection({ product, onChange }: Props) {
  const brandConfig = product.brand ? KEYBOARD_BRANDS[product.brand] : null;
  const subCategoryOptions = brandConfig?.subCategories ?? [];

  // Each of these tracks whether the admin picked "Others" for that field
  // and should see a free-text box instead of the predefined dropdown.
  const [subCategoryIsOther, setSubCategoryIsOther] = useState(
    () => !!product.productSubCategory && !subCategoryOptions.includes(product.productSubCategory)
  );
  const [repairTypeIsOther, setRepairTypeIsOther] = useState(
    () => !!product.repairType && !REPAIR_TYPE_OPTIONS.includes(product.repairType)
  );
  const [serviceTypeIsOther, setServiceTypeIsOther] = useState(
    () => !!product.serviceType && !SERVICE_TYPE_OPTIONS.includes(product.serviceType)
  );

  const set = <K extends keyof ProductDetails>(key: K, value: ProductDetails[K]) =>
    onChange({ ...product, [key]: value });

  const handleBrandChange = (brandKey: string) => {
    // Selecting a new brand resets the brand-dependent fields so stale
    // values from a previous brand don't linger in the fields box.
    setSubCategoryIsOther(false);
    onChange({
      ...product,
      brand: brandKey,
      customBrandName: "",
      productSubCategory: "",
      modelNumber: "",
    });
  };

  const handleSubCategoryChange = (value: string) => {
    if (value === OTHERS) {
      setSubCategoryIsOther(true);
      set("productSubCategory", "");
    } else {
      setSubCategoryIsOther(false);
      set("productSubCategory", value);
    }
  };

  const handleRepairTypeChange = (value: string) => {
    if (value === OTHERS) {
      setRepairTypeIsOther(true);
      set("repairType", "");
    } else {
      setRepairTypeIsOther(false);
      set("repairType", value);
    }
  };

  const handleServiceTypeChange = (value: string) => {
    if (value === OTHERS) {
      setServiceTypeIsOther(true);
      set("serviceType", "");
    } else {
      setServiceTypeIsOther(false);
      set("serviceType", value);
    }
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
        {product.brand === "other" && (
          <input
            id="customBrandName"
            className="other-input"
            value={product.customBrandName}
            onChange={(e) => set("customBrandName", e.target.value)}
            placeholder="Type the actual brand name"
            autoFocus
          />
        )}
      </div>

      {brandConfig && (
        <div className="brand-box">
          <div className="grid">
            <div className="field">
              <label htmlFor="productSubCategory">Product Sub-Category</label>
              {subCategoryIsOther ? (
                <>
                  <input
                    id="productSubCategory"
                    className="other-input"
                    value={product.productSubCategory}
                    onChange={(e) => set("productSubCategory", e.target.value)}
                    placeholder="Type the sub-category"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setSubCategoryIsOther(false);
                      set("productSubCategory", "");
                    }}
                  >
                    &larr; Choose from list instead
                  </button>
                </>
              ) : (
                <select
                  id="productSubCategory"
                  value={product.productSubCategory}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                >
                  <option value="">Select type&hellip;</option>
                  {subCategoryOptions.map((sc) => (
                    <option key={sc} value={sc}>
                      {sc}
                    </option>
                  ))}
                  <option value={OTHERS}>{OTHERS}</option>
                </select>
              )}
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
              {repairTypeIsOther ? (
                <>
                  <input
                    id="repairType"
                    className="other-input"
                    value={product.repairType}
                    onChange={(e) => set("repairType", e.target.value)}
                    placeholder="Type the repair type"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setRepairTypeIsOther(false);
                      set("repairType", REPAIR_TYPE_OPTIONS[0]);
                    }}
                  >
                    &larr; Choose from list instead
                  </button>
                </>
              ) : (
                <select id="repairType" value={product.repairType} onChange={(e) => handleRepairTypeChange(e.target.value)}>
                  {REPAIR_TYPE_OPTIONS.map((rt) => (
                    <option key={rt}>{rt}</option>
                  ))}
                  <option value={OTHERS}>{OTHERS}</option>
                </select>
              )}
            </div>

            <div className="field">
              <label htmlFor="serviceType">Service Type</label>
              {serviceTypeIsOther ? (
                <>
                  <input
                    id="serviceType"
                    className="other-input"
                    value={product.serviceType}
                    onChange={(e) => set("serviceType", e.target.value)}
                    placeholder="Type the service type"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setServiceTypeIsOther(false);
                      set("serviceType", SERVICE_TYPE_OPTIONS[0]);
                    }}
                  >
                    &larr; Choose from list instead
                  </button>
                </>
              ) : (
                <select id="serviceType" value={product.serviceType} onChange={(e) => handleServiceTypeChange(e.target.value)}>
                  {SERVICE_TYPE_OPTIONS.map((st) => (
                    <option key={st}>{st}</option>
                  ))}
                  <option value={OTHERS}>{OTHERS}</option>
                </select>
              )}
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
