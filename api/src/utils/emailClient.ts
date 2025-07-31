import nodemailer from 'nodemailer';
import env from 'config/env';
import logger from 'utils/logger';

export const createEmailClient = () => {
  return nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
      user: 'smtp@mailtrap.io',
      pass: env.MAILTRAP_PASSWORD,
    },
  });
};

export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> => {
  const client = createEmailClient();

  const emailData = {
    from: 'admin@tv-minder.com',
    to,
    subject,
    text,
  };

  return new Promise((resolve, reject) => {
    client.sendMail(emailData, (error, info) => {
      if (error) {
        logger.error('Nodemailer error:', error);
        reject(new Error('Failed to send email'));
      } else {
        logger.success('Email sent:', info.response);
        resolve();
      }
    });
  });
};
