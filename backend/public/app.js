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
  output.innerText = "⏳ Menyiapkan pembayaran...";

  Pi.createPayment(
    {
      amount: 1,
      memo: "CTFPROPERTY Payment",
      metadata: { app: "ctfproperty" }
    },
    {
      // STEP 1 — SERVER APPROVAL
      onReadyForServerApproval: async (paymentId) => {
        try {
          const res = await fetch("/api/approve-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ paymentId })
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(JSON.stringify(data));
          }

        } catch (err) {
          output.innerText =
            "❌ Gagal approve payment:\n" + err.message;
        }
      },

      // STEP 2 — SERVER COMPLETION (WAJIB ADA)
      onReadyForServerCompletion: async (paymentId, txid) => {
        output.innerText =
          "✅ Pembayaran berhasil!\nTXID: " + txid;

        // OPTIONAL (tapi disarankan)
        await fetch("/api/complete-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid })
        });
      },

      onCancel: (paymentId) => {
        output.innerText = "❌ Pembayaran dibatalkan.";
      },

      onError: (err) => {
        output.innerText =
          "❌ Error pembayaran:\n" + JSON.stringify(err, null, 2);
      }
    }
  );
}

