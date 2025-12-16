let piUser = null;

// INIT PI SDK
document.addEventListener("DOMContentLoaded", () => {
  if (!window.Pi) {
    document.getElementById("output").innerText = "Pi SDK not loaded";
    return;
  }

  Pi.init({
    version: "2.0",
    sandbox: true
  });
});

// CONNECT WALLET
window.connectPi = async function () {
  try {
    const scopes = ["username", "payments"];
    const auth = await Pi.authenticate(scopes, () => {});
    piUser = auth.user;

    document.getElementById("output").innerText =
      "✅ Connected as " + piUser.username;
  } catch (err) {
    document.getElementById("output").innerText =
      "❌ Connect failed: " + err;
  }
};

// PAY WITH PI
window.payWithPi = async function () {
  if (!piUser) {
    document.getElementById("output").innerText =
      "❗ Please connect Pi Wallet first";
    return;
  }

  document.getElementById("output").innerText =
    "⏳ Preparing payment...";

  try {
    await Pi.createPayment({
      amount: 1,
      memo: "CTFPROPERTY Test Payment",
      metadata: { app: "CTFPROPERTY" }
    }, {
      onReadyForServerApproval: async (paymentId) => {
        await fetch("/api/approve-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: async (paymentId) => {
        await fetch("/api/complete-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
      },
      onCancel: () => {
        document.getElementById("output").innerText =
          "❌ Payment cancelled";
      },
      onError: (error) => {
        document.getElementById("output").innerText =
          "❌ Payment error: " + error;
      }
    });

  } catch (err) {
    document.getElementById("output").innerText =
      "❌ Failed: " + err;
  }
};
