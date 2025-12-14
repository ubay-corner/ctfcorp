// ===== WAIT PI SDK READY =====
document.addEventListener("DOMContentLoaded", () => {

  if (!window.Pi) {
    document.getElementById("output").innerText =
      "Pi SDK tidak terdeteksi.\nBuka aplikasi ini dari Pi Browser.";
    return;
  }

  Pi.init({
    version: "2.0",
    sandbox: true
  });

  document.getElementById("output").innerText =
    "Pi SDK siap. Silakan Connect Pi Wallet.";
});

// ===== GLOBAL STATE =====
let currentUser = null;
const output = document.getElementById("output");

// ===== CONNECT PI WALLET =====
function connectPi() {
  output.innerText = "Membuka Pi Wallet...";

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
      memo: "CTFPROPERTY Test Payment",
      metadata: { app: "ctfproperty" }
    },
    {
      onReadyForServerApproval(paymentId) {
        output.innerText = "Menunggu approval server...\n" + paymentId;
      },

      onReadyForServerCompletion(paymentId, txid) {
        output.innerText =
          "✅ Payment sukses!\nTXID:\n" + txid;
      },

      onCancel(paymentId) {
        output.innerText = "Payment dibatalkan: " + paymentId;
      },

      onError(error, payment) {
        output.innerText =
          "❌ Payment error:\n" +
          JSON.stringify({ error, payment }, null, 2);
      }
    }
  );
}
