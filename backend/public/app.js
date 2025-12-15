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

  const output = document.getElementById("output");
  output.innerText = "💰 Menyiapkan pembayaran Pi...";

  Pi.createPayment(
    {
      amount: 1,
      memo: "CTFPROPERTY Payment",
      metadata: { app: "ctfproperty" }
    },
    {
      // ⬇️ WAJIB: server approval
      onReadyForServerApproval(paymentId) {
        output.innerText = "⏳ Menunggu approval server...";

        fetch("/api/approve-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ paymentId })
        })
          .then(res => res.json())
          .then(data => {
            console.log("Approved:", data);
          })
          .catch(err => {
            output.innerText = "❌ Approval gagal";
            console.error(err);
          });
      },

      onReadyForServerCompletion(paymentId, txid) {
        output.innerText =
          "✅ Pembayaran sukses!\nTXID:\n" + txid;

        fetch("/api/complete-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid })
        });
      },

      onCancel(paymentId) {
        output.innerText = "❌ Payment dibatalkan: " + paymentId;
      },

      onError(error) {
        output.innerText =
          "❌ Payment error:\n" + JSON.stringify(error, null, 2);
      }
    }
  );
}


