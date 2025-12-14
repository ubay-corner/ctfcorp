const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
app.use(express.json());

// ===== SERVE FRONTEND =====
app.use(express.static(path.join(__dirname, "public")));

// ===== ROOT CHECK (API) =====
app.get("/api", (req, res) => {
  res.json({
    app: "CTFPROPERTY",
    status: "Backend running",
    network: "Pi Testnet"
  });
});

// ===== PI TESTNET HEALTH =====
app.get("/pi/health", (req, res) => {
  res.json({
    pi: "ready",
    network: "testnet",
    backend: "online",
    timestamp: new Date().toISOString()
  });
});

// ===== PI AUTH MOCK =====
app.post("/pi/auth/mock", (req, res) => {
  res.json({
    success: true,
    user: {
      uid: "pi_test_user_123",
      username: "testnet_user",
      network: "Pi Testnet"
    }
  });
});

// ===== PI PAYMENT APPROVE =====
app.post("/pi/payment/approve", (req, res) => {
  const { paymentId } = req.body;
  console.log("Approve payment:", paymentId);

  res.json({ approved: true });
});

// ===== PI PAYMENT COMPLETE =====
app.post("/pi/payment/complete", (req, res) => {
  const { paymentId, txid } = req.body;
  console.log("Complete payment:", paymentId, txid);

  res.json({ completed: true });
});

// ===== FALLBACK TO FRONTEND =====
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
