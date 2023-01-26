import { createTransport } from 'nodemailer';

export const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const EMAIL_EXPIRES_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const EMAIL_RESEND_INTERVAL = 60 * 1000; // 1 minute
