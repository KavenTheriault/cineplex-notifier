import nodemailer from "nodemailer";
import {AppConfig} from "./config";
import Mail from "nodemailer/lib/mailer";

export const sendEmail = async (appConfig: AppConfig, subject: string, body: string, threadId?: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: appConfig.smtpUser,
      pass: appConfig.smtpPassword,
    },
  });

  const threadHeaders = threadId ? buildThreadHeaders(threadId, appConfig.destinationEmail) : {};
  await transporter.sendMail({
    from: appConfig.smtpUser,
    to: appConfig.destinationEmail,
    subject,
    text: body,
    html: `<pre>${body}</pre>`,
    ...threadHeaders,
  });

  console.log('📧 Email sent to', appConfig.destinationEmail);
}

const buildThreadHeaders = (threadId: string, senderEmail: string): Partial<Mail.Options> => {
  const root = `<${threadId}+${senderEmail}>`;
  return {
    messageId: `<${threadId}-${Date.now()}+${senderEmail}>`,
    inReplyTo: root,
    references: [root],
  };
}