
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
🔔 <b>New Application Received</b>

👤 <b>Name:</b> ${application.name}
📧 <b>Email:</b> ${application.email}
💬 <b>Telegram:</b> ${application.telegramId || 'Not provided'}

📝 <b>Experience:</b>
${application.experience}

🎯 <b>Current Focus:</b>
${application.currentFocus}

🚀 <b>Goals:</b>
${application.goals}

🛠 <b>Skills:</b> ${application.skills.join(', ')}

📅 <b>Applied:</b> ${new Date().toLocaleString()}

<b>Review Actions:</b>
✅ Approve: /approve_${application.id}
❌ Reject: /reject_${application.id}
    `;

    await this.sendMessage(message);
  }

  async sendInlineKeyboard(text: string, applicationId: number): Promise<void> {
    if (!this.isConfigured) {
      console.log(`📱 Telegram not configured, application ${applicationId} notification would be:`, text.substring(0, 100) + '...');
      console.log(`🔗 Manual review needed for application ID: ${applicationId}`);
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
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '✅ Approve',
                  callback_data: `approve_${applicationId}`
                },
                {
                  text: '❌ Reject',
                  callback_data: `reject_${applicationId}`
                }
              ]
            ]
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to send Telegram message with inline keyboard:', errorText);
      } else {
        console.log(`✅ Telegram notification sent for application ${applicationId}`);
      }
    } catch (error) {
      console.error('❌ Error sending Telegram message with inline keyboard:', error);
    }
  }

  async notifyNewProject(project: any, submitterName: string): Promise<void> {
    const message = `
🚀 <b>New Project Submitted</b>

📝 <b>Title:</b> ${project.title}
👤 <b>Submitted by:</b> ${submitterName}

📄 <b>Description:</b>
${project.description}

💻 <b>Tech Stack:</b> ${project.techStack || 'Not specified'}
📊 <b>Metrics:</b> ${project.metrics || 'Not provided'}

📅 <b>Submitted:</b> ${new Date().toLocaleString()}

Please review and categorize this project in the admin panel.
    `;

    await this.sendMessage(message);
  }
}

async setupWebhook(webhookUrl: string): Promise<void> {
    if (!this.isConfigured) {
      console.log('📱 Telegram not configured, skipping webhook setup');
      return;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.config.botToken}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
        }),
      });

      if (response.ok) {
        console.log('✅ Telegram webhook set up successfully');
      } else {
        console.error('❌ Failed to set up Telegram webhook:', await response.text());
      }
    } catch (error) {
      console.error('❌ Error setting up Telegram webhook:', error);
    }
  }
}

export const telegramBot = new TelegramBot({
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
});

// Set up webhook if in production
if (process.env.NODE_ENV === 'production' && process.env.BASE_URL) {
  telegramBot.setupWebhook(`${process.env.BASE_URL}/api/telegram/webhook`);
}
