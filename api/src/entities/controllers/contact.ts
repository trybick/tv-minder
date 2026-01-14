import { Request, Response } from 'express';
import { sendEmail } from 'utils/emailClient';
import logger from 'utils/logger';

export const sendContactMessage = async (req: Request, res: Response) => {
  const { text, email } = req.body;
  const emailContent = email ? `User email: ${email}\n\n${text}` : text;

  try {
    await sendEmail({
      to: 'devtimr@gmail.com',
      subject: 'TV Minder: New feedback',
      text: emailContent,
    });
    res.status(204).send();
  } catch (error) {
    logger.error('Error sending feedback message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};
