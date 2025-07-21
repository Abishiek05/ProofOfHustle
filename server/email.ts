
import nodemailer from 'nodemailer';

// Check if email credentials are configured
const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

// Create a transporter using Gmail SMTP only if credentials are provided
let transporter: nodemailer.Transporter | null = null;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} else {
  console.warn('Email credentials not configured. Verification emails will not be sent.');
}

export async function sendVerificationEmail(email: string, token: string, userName: string) {
  // If email is not configured, log the verification link for development
  if (!isEmailConfigured || !transporter) {
    const verificationUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/verification-status?token=${token}`;
    console.log(`📧 Email not configured. Verification link for ${email}: ${verificationUrl}`);
    console.log(`🔗 Direct verification link: /verification-status?token=${token}`);
    return false;
  }

  const verificationUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/verification-status?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - Proof of Hustle',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Proof of Hustle, ${userName}!</h2>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        
        <p style="color: #666; font-size: 14px;">If you didn't create an account, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    console.log(`🔗 Manual verification link for ${email}: /verification-status?token=${token}`);
    return false;
  }
}
