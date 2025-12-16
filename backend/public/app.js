let currentUser = null;
const output = document.getElementById("output");

// INIT PI SDK
document.addEventListener("DOMContentLoaded", () => {
  if (!window.Pi) {
    output.innerText = "❌ Buka aplikasi ini dari Pi Browser";
    return;
  }

  Pi.init({
    version: "2.0",
    sandbox: false
  });

  output.innerText = "✅ Pi SDK siap";
});

// CONNECT WALLET
async function connectPi() {
  output.innerText = "🔐 Membuka Pi Wallet...";

  try {
    const auth = await Pi.authenticate(["username", "payments"]);
    currentUser = auth.user;

    output.innerText =
      "✅ Connected\nUsername: @" + currentUser.username;

  } catch (err) {
    output.innerText =
      "❌ Auth gagal\n" + JSON.stringify(err, null, 2);
  }
}

// PAYMENT
function payWithPi() {
  if (!currentUser) {
    alert("Connect Pi Wallet dulu!");
    return;
  }

  output.innerText = "⏳ Menyiapkan pembayaran...";

  Pi.createPayment(
    {
      amount: 1,
      memo: "CTFPROPERTY Payment",
      metadata: { app: "ctfproperty" }
    },
    {
      onReadyForServerApproval: async (paymentId) => {
        try {
          const res = await fetch("/api/approve-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId })
          });

          if (!res.ok) {
            throw new Error(await res.text());
          }

        } catch (e) {
          output.innerText = "❌ Approval gagal\n" + e.message;
        }
      },

      onReadyForServerCompletion: async (paymentId, txid) => {
        await fetch("/api/complete-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid })
        });

        output.innerText =
          "✅ Payment sukses\nTXID:\n" + txid;
      },

      onCancel: () => {
        output.innerText = "❌ Payment dibatalkan";
      },

      onError: (e) => {
        output.innerText =
          "❌ Payment error\n" + JSON.stringify(e, null, 2);
      }
    }
  );
}
