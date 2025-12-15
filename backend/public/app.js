document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");

  if (!window.Pi) {
    output.innerText =
      "❌ Pi SDK tidak terdeteksi.\nBuka aplikasi ini dari Pi Browser.";
    return;
  }

  // INIT PI SDK (PRODUCTION MODE)
  Pi.init({
    version: "2.0"
  });

  output.innerText = "✅ Pi SDK siap. Silakan Connect Pi Wallet.";
});

let currentUser = null;

// ===== CONNECT PI WALLET =====
function connectPi() {
  const output = document.getElementById("output");
  output.innerText = "🔐 Membuka Pi Wallet...";

  Pi.authenticate(
    ["username", "payments"],
    (auth) => {
      currentUser = auth.user;
      output.innerText =
        "✅ Connected!\nUsername: " + currentUser.username;
    },
    (error) => {
      output.innerText =
        "❌ Auth gagal:\n" + JSON.stringify(error, null, 2);
    }
  );
}

// ===== PI PAYMENT =====
function payWithPi() {
  if (!currentUser) {
    alert("Connect Pi Wallet dulu!");
    return;
  }

  Pi.createPayment(
    {
      amount: 1,
      memo: "CTFPROPERTY Payment",
      metadata: { app: "ctfproperty" }
    },
    {
      onReadyForServerApproval(paymentId) {
        console.log("Approval needed:", paymentId);
      },
      onReadyForServerCompletion(paymentId, txid) {
        alert("Payment sukses!\nTXID: " + txid);
      },
      onCancel(paymentId) {
        alert("Payment dibatalkan: " + paymentId);
      },
      onError(error) {
        alert("Payment error: " + JSON.stringify(error));
      }
    }
  );
}
