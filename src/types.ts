export interface CustomerDetails {
  name: string;
  landline: string;
  contact: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ProductDetails {
  brand: string;
  productCategory: string;
  productSubCategory: string;
  modelNumber: string;
  serialNumber: string;
  repairType: string;
  serviceType: string;
  accessories: string;
}

export interface ServiceDetails {
  condition: string;
  problemDiagnosed: string;
  sparePartsChanged: string;
  sparePartsCost: string;
  serviceCharge: string;
  invoiceDate: string;
  invoiceNumber: string;
}

export interface InvoiceData {
  customer: CustomerDetails;
  product: ProductDetails;
  service: ServiceDetails;
}

export const emptyCustomer: CustomerDetails = {
  name: "",
  landline: "",
  contact: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export const emptyProduct: ProductDetails = {
  brand: "",
  productCategory: "Musical Instruments",
  productSubCategory: "",
  modelNumber: "",
  serialNumber: "",
  repairType: "Carry-In",
  serviceType: "Out-Warranty",
  accessories: "",
};

export const emptyService: ServiceDetails = {
  condition: "",
  problemDiagnosed: "",
  sparePartsChanged: "",
  sparePartsCost: "",
  serviceCharge: "",
  invoiceDate: new Date().toISOString().slice(0, 10),
  invoiceNumber: "",
};

/** Grand Total = spare parts cost + service charge. Computed, never stored redundantly. */
export function calcGrandTotal(service: ServiceDetails): number {
  const parts = parseFloat(service.sparePartsCost || "0") || 0;
  const charge = parseFloat(service.serviceCharge || "0") || 0;
  return parts + charge;
}
