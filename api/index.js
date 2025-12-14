export default function handler(req, res) {
  res.status(200).json({
    app: "CTFPROPERTY",
    status: "Backend running on Vercel",
    network: "Pi Testnet"
  });
}
