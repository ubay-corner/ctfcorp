Pi.init({ version: "2.0", sandbox: true });

let currentUser = null;

function log(msg) {
  document.getElementById("output").textContent = msg;
}

async function connectPi() {
  try {
    currentUser = await Pi.authenticate(
      ["payments"],
      () => log("Auth cancelled")
    );
    log("Connected: " + currentUser.user.username);
  } catch (err) {
    log("Auth error: " + err);
  }
}

async function payWithPi() {
  if (!currentUser) {
    log("Please connect Pi Wallet first");
    return;
  }

  try {
    const payment = await Pi.createPayment({
      amount: 1,
      memo: "CTFPROPERTY Payment",
      metadata: { app: "CTFPROPERTY" }
    });

    log("Payment created: " + payment.identifier);
  } catch (err) {
    log("Payment error: " + err);
  }
}
