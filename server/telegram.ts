
interface TelegramConfig {
  botToken: string;
  chatId: string;
}

class TelegramBot {
  private config: TelegramConfig;

  constructor(config: TelegramConfig) {
    this.config = config;
  }

  async sendMessage(text: string): Promise<void> {
    if (!this.config.botToken || !this.config.chatId) {
      console.log('Telegram not configured, skipping notification:', text);
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
        console.error('Failed to send Telegram message:', await response.text());
      }
    } catch (error) {
      console.error('Error sending Telegram message:', error);
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

Please review and approve/reject this application in the admin panel.
    `;

    await this.sendMessage(message);
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

export const telegramBot = new TelegramBot({
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
});
