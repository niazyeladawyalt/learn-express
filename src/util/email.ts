// src/utils/email.ts
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_FROM_EMAIL) {
    throw new Error('Missing RESEND_FROM_EMAIL in environment variables.');
  }

  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
