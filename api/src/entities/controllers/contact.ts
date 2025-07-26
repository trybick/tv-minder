import { Request, Response } from 'express';
import { sendEmail } from 'utils/emailClient';

export const sendContactMessage = async (req: Request, res: Response) => {
  const { text, email } = req.body;
  const emailContent = email ? `User email: ${email}\n\n${text}` : text;

  try {
    await sendEmail({
      to: 'devtimr@gmail.com',
      subject: 'TV Minder: New feedback',
      text: emailContent,
    });
    res.status(200).json({ message: 'Message sent' });
  } catch {
    res.status(500).json({ message: 'Failed to send message' });
  }
};
