// Init Pi SDK (Sandbox)
Pi.init({
  version: "2.0",
  sandbox: true
});

const output = document.getElementById("output");
let currentUser = null;

// ===== CONNECT PI WALLET =====
function connectPi() {
  output.innerText = "Connecting to Pi Wallet...";

  Pi.authenticate(
    ["username", "payments"],
    function (auth) {
      currentUser = auth.user;
      output.innerText = "Connected:\n" + JSON.stringify(auth, null, 2);
    },
    function (error) {
      output.innerText = "Auth failed:\n" + JSON.stringify(error);
    }
  );
}

// ===== PI PAYMENT =====
function payWithPi() {
  if (!currentUser) {
    alert("Please connect Pi Wallet first!");
    return;
  }

  output.innerText = "Creating Pi Payment...";

  Pi.createPayment(
    {
      amount: 1,
      memo: "CTFPROPERTY Test Payment",
      metadata: { app: "ctfproperty" }
    },
    {
      onReadyForServerApproval: function (paymentId) {
        output.innerText = "Waiting server approval...\nPayment ID: " + paymentId;

        fetch("/pi/payment/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
      },

      onReadyForServerCompletion: function (paymentId, txid) {
        output.innerText =
          "Completing payment...\nPayment ID: " +
          paymentId +
          "\nTXID: " +
          txid;

        fetch("/pi/payment/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid })
        });
      },

      onCancel: function (paymentId) {
        output.innerText = "Payment cancelled: " + paymentId;
      },

      onError: function (error, payment) {
        output.innerText =
          "Payment error:\n" +
          JSON.stringify({ error, payment }, null, 2);
      }
    }
  );
}
