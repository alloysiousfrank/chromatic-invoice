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
  amount: string;
  invoiceDate: string;
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
  amount: "",
  invoiceDate: new Date().toISOString().slice(0, 10),
};
