export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, role } = req.body;

        // Убираем возможные лишние пробелы и переносы строк из токенов
        const TELEGRAM_BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
        const TELEGRAM_CHAT_ID = (process.env.TELEGRAM_CHAT_ID || '').trim();

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error("❌ ERROR: Tokens are missing in .env file!");
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Защита от поломки HTML в Telegram
        const safeName = name ? name.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'Unknown';
        const safeEmail = email ? email.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'Unknown';

        const message = `
  🚀 <b>New CRUSH AI Waitlist Request!</b>
  
  👤 <b>Name:</b> ${safeName}
  📧 <b>Email:</b> ${safeEmail}
  💼 <b>Role:</b> ${role}
  ⏰ <b>Time:</b> ${new Date().toUTCString()}
      `;

        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const telegramResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML',
            }),
        });

        // Получаем детальный ответ от Telegram для дебага
        const data = await telegramResponse.json();

        if (!telegramResponse.ok) {
            console.error('❌ TELEGRAM API ERROR:', data);
            throw new Error(`Telegram Error: ${data.description}`);
        }

        console.log('✅ Success! Message sent to Telegram.');
        return res.status(200).json({ success: true, message: 'Data sent to Telegram' });

    } catch (error) {
        console.error('❌ Submit endpoint error:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}