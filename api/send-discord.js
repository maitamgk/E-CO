export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL environment variable is missing.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Discord API response error:', errText);
      return res.status(response.status).json({ error: errText });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error forwarding message to Discord:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
