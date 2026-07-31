export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const when = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: process.env.NOTIFY_EMAIL,
        subject: '👀 Quelqu\'un vient d\'ouvrir le lien',
        text: `Le lien a été ouvert le ${when}.`
      })
    });

    if (!r.ok) {
      const errData = await r.json().catch(() => ({}));
      return res.status(500).json({ success: false, error: errData });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
