export default function handler(req, res) {
  console.log("APPROVE PAYMENT HIT");
  res.status(200).json({ ok: true });
}
