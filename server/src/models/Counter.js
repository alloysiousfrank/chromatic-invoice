const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

// Explicit collection name so this can never collide with another
// project's counters even if they end up sharing the same database.
const Counter = mongoose.model("Counter", CounterSchema, "chromatic_counters");

/** Atomically increments and returns the next invoice number, e.g. "CP-0001". */
async function nextInvoiceNumber() {
  const counter = await Counter.findOneAndUpdate(
    { name: "chromatic_invoice" },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  return `CP-${String(counter.seq).padStart(4, "0")}`;
}

module.exports = { Counter, nextInvoiceNumber };
