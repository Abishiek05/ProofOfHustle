interface TelegramConfig {
  botToken: string;
  chatId: string;
}

class TelegramBot {
  private config: TelegramConfig;
  private isConfigured: boolean;

  constructor(config: TelegramConfig) {
    this.config = config;
    this.isConfigured = !!(config.botToken && config.chatId);

    if (!this.isConfigured) {
      console.warn('⚠️ Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID environment variables.');
    } else {
      console.log('✅ Telegram bot configured successfully');
    }
  }

  async sendMessage(text: string): Promise<void> {
    if (!this.isConfigured) {
      console.log('📱 Telegram not configured, message would be:', text.substring(0, 100) + '...');
      return;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.config.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to send Telegram message:', errorText);
      } else {
        console.log('✅ Telegram message sent successfully');
      }
    } catch (error) {
      console.error('❌ Error sending Telegram message:', error);
    }
  }

  async notifyNewApplication(application: any): Promise<void> {
    const message = `
🔔 <b>New Application Received!</b>

👤 <b>Name:</b> ${application.firstName} ${application.lastName}
📧 <b>Email:</b> ${application.email}
🌍 <b>Country:</b> ${application.country}
💼 <b>Work Status:</b> ${application.workStatus}

📝 <b>Backstory:</b>
${application.backstory}

🎯 <b>Goals:</b>
${application.goals}

💻 <b>Skills:</b>
${application.skills}

🔗 <b>Links:</b>
${application.links || 'None provided'}

⏰ <b>Submitted:</b> ${new Date().toLocaleString()}

<b>Actions:</b>
• Approve: /approve_${application.id}
• Reject: /reject_${application.id}
`;

    await this.sendMessage(message);
  }

  async notifyApplicationUpdate(userId: string, status: 'approved' | 'rejected', adminNote?: string): Promise<void> {
    const statusEmoji = status === 'approved' ? '✅' : '❌';
    const statusText = status === 'approved' ? 'APPROVED' : 'REJECTED';

    const message = `
${statusEmoji} <b>Application ${statusText}</b>

👤 <b>User ID:</b> ${userId}
📝 <b>Admin Note:</b> ${adminNote || 'No additional notes'}
⏰ <b>Updated:</b> ${new Date().toLocaleString()}
`;

    await this.sendMessage(message);
  }
}

// Create bot instance with environment variables
const telegramBot = new TelegramBot({
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
});

// Set up webhook if in production
if (process.env.NODE_ENV === 'production' && process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_WEBHOOK_URL) {
  const setWebhook = async () => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: process.env.TELEGRAM_WEBHOOK_URL,
        }),
      });

      if (response.ok) {
        console.log('✅ Telegram webhook set successfully');
      } else {
        console.error('❌ Failed to set Telegram webhook');
      }
    } catch (error) {
      console.error('❌ Error setting Telegram webhook:', error);
    }
  };

  setWebhook();
}

export default telegramBot;