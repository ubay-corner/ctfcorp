export default function handler(req, res) {
  console.log("COMPLETE PAYMENT HIT");
  res.status(200).json({ completed: true });
}
