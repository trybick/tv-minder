import express from 'express';
import nodemailer from 'nodemailer';
import envConfig from 'config/env';

const contactRoutes = express.Router();

contactRoutes.post('/contact', (req, res) => {
  const { text } = req.body;
  console.log('Received message:', text);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'devtimr',
      pass: envConfig.GMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'devtimr@gmail.com',
    to: 'devtimr@gmail.com',
    subject: 'TV Minder: New feedback',
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Nodemailer error: ', error);
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Message sent' });
    }
  });
});

export default contactRoutes;
