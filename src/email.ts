import nodemailer from "nodemailer";
import {AppConfig} from "./config";

export const sendEmail = async (subject: string, body: string, appConfig: AppConfig) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: appConfig.smtpUser,
      pass: appConfig.smtpPassword,
    },
  });

  await transporter.sendMail({
    from: appConfig.smtpUser,
    to: appConfig.destinationEmail,
    subject,
    text: body,
    html: `<pre>${body}</pre>`,
  });

  console.log('Email sent to', appConfig.destinationEmail);
}