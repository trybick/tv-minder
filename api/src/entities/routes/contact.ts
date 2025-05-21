import express from 'express';
import nodemailer from 'nodemailer';
import envConfig from 'config/env';

const contactRoutes = express.Router();

contactRoutes.post('/contact', (req, res) => {
  const { text, email } = req.body;

  const client = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
      user: 'smtp@mailtrap.io',
      pass: envConfig.MAILTRAP_PASSWORD,
    },
  });

  const emailContent = email ? `User email: ${email}\n\n${text}` : text;

  const emailData = {
    from: 'admin@tv-minder.com',
    to: 'devtimr@gmail.com',
    subject: 'TV Minder: New feedback',
    text: emailContent,
  };

  client.sendMail(emailData, (error, info) => {
    if (error) {
      console.log('Nodemailer error: ', error);
      res.status(500).json({ message: 'Failed to send message' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Message sent' });
    }
  });
});

export default contactRoutes;
