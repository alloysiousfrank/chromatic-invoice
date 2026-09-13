const express = require("express");
const Invoice = require("../models/Invoice");
const { nextInvoiceNumber } = require("../models/Counter");
const { requireAdminKey } = require("../middleware/auth");

const router = express.Router();
router.use(requireAdminKey);

/** POST /api/invoices — create a new invoice, invoice number assigned server-side. */
router.post("/", async (req, res) => {
  try {
    const { customer, product, service } = req.body || {};
    if (!customer || !product || !service) {
      return res.status(400).json({ error: "customer, product, and service are required." });
    }
    const invoiceNumber = await nextInvoiceNumber();
    const invoice = await Invoice.create({
      invoiceNumber,
      customer,
      product,
      service,
    });
    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create invoice." });
  }
});

/** GET /api/invoices — list all invoices, newest first. */
router.get("/", async (_req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 }).lean();
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invoices." });
  }
});

/** GET /api/invoices/:id — a single invoice's full data (used to rebuild its PDF). */
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();
    if (!invoice) return res.status(404).json({ error: "Invoice not found." });
    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invoice." });
  }
});

/** PUT /api/invoices/:id — edit an existing invoice. Invoice number never changes. */
router.put("/:id", async (req, res) => {
  try {
    const { customer, product, service } = req.body || {};
    if (!customer || !product || !service) {
      return res.status(400).json({ error: "customer, product, and service are required." });
    }
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { customer, product, service },
      { new: true, runValidators: true }
    );
    if (!invoice) return res.status(404).json({ error: "Invoice not found." });
    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update invoice." });
  }
});

/** DELETE /api/invoices/:id — permanently deletes the invoice from the database. */
router.delete("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found." });
    res.json({ ok: true, invoiceNumber: invoice.invoiceNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete invoice." });
  }
});

module.exports = router;
