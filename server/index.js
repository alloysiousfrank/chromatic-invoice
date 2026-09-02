require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDb } = require("./src/db");
const invoiceRoutes = require("./src/routes/invoices");

const app = express();

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without Origin header
      if (!origin) {
        return callback(null, true);
      }

      // Allow all if no origins are configured
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }

      // Allow configured frontend origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "chromatic-invoice-server",
  });
});

app.use("/api/invoices", invoiceRoutes);

const PORT = process.env.PORT || 4000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });