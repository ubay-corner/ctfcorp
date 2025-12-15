document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");

  if (!window.Pi) {
    output.innerText =
      "❌ Pi SDK tidak terdeteksi.\nBuka aplikasi ini dari Pi Browser.";
    return;
  }

  // INIT PI SDK (PRODUCTION MODE)
  Pi.init({
  version: "2.0",
  sandbox: false // WAJIB untuk Pi Browser
});

  output.innerText = "✅ Pi SDK siap. Silakan Connect Pi Wallet.";
});

let currentUser = null;

// ===== CONNECT PI WALLET =====
async function connectPi() {
  const output = document.getElementById("output");
  output.innerText = "🔐 Menghubungkan Pi Wallet...";

  try {
    const auth = await Pi.authenticate(
      ["username"],
      function (payment) {
        console.log("Incomplete payment:", payment);
      }
    );

    currentUser = auth.user;

    output.innerText =
      "✅ Connected!\nUsername: @" + currentUser.username;

    console.log("AUTH SUCCESS:", auth);

  } catch (err) {
    output.innerText =
      "❌ Auth gagal:\n" + JSON.stringify(err, null, 2);
    console.error(err);
  }
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
