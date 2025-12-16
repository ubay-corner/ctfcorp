export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { paymentId } = req.body;

  try {
    const r = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await r.text();
    res.status(200).send(data);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
