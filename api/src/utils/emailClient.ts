import { MailtrapClient } from 'mailtrap';
import env from 'config/env';
import logger from 'utils/logger';

const sender = {
  email: 'hello@tv-minder.com',
  name: 'TV Minder',
};

export const createEmailClient = () => {
  return new MailtrapClient({
    token: env.MAILTRAP_PASSWORD,
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

  try {
    const info = await client.send({
      from: sender,
      to: [{ email: to }],
      subject,
      text,
    });
    logger.success('Email sent:', info);
  } catch (error) {
    logger.error('Mailtrap error:', error);
    throw new Error('Failed to send email', { cause: error });
  }
};
