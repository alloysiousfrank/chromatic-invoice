const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, default: "" },
      landline: { type: String, default: "" },
      contact: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    product: {
      brand: { type: String, default: "" },
      customBrandName: { type: String, default: "" },
      productCategory: { type: String, default: "" },
      productSubCategory: { type: String, default: "" },
      modelNumber: { type: String, default: "" },
      serialNumber: { type: String, default: "" },
      repairType: { type: String, default: "" },
      serviceType: { type: String, default: "" },
      accessories: { type: String, default: "" },
    },
    service: {
      condition: { type: String, default: "" },
      problemDiagnosed: { type: String, default: "" },
      sparePartsChanged: { type: String, default: "" },
      sparePartsCost: { type: String, default: "0" },
      serviceCharge: { type: String, default: "0" },
      advanceAmount: { type: String, default: "0" },
      invoiceDate: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema, "chromatic_invoices");
