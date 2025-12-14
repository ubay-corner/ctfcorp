export default function handler(req, res) {
  res.status(200).json({
    pi: "ready",
    network: "testnet",
    backend: "online",
    timestamp: new Date().toISOString()
  });
}
