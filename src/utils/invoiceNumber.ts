const COUNTER_KEY = "cp_invoice_counter";

/** Returns the next invoice number (e.g. "CP-0001") and persists the counter. */
export function generateInvoiceNumber(): string {
  const current = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10);
  const next = current + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return `CP-${String(next).padStart(4, "0")}`;
}
