import express from 'express';
import nodemailer from 'nodemailer';
import envConfig from 'config/env';

const contactRoutes = express.Router();

contactRoutes.post('/contact', (req, res) => {
  const { text } = req.body;

  const client = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: 'apikey',
      pass: envConfig.SENDGRID_KEY,
    },
  });
  const email = {
    from: 'admin@em792.timr.dev',
    to: 'devtimr@gmail.com',
    subject: 'TV Minder: New feedback',
    text,
  };

  client.sendMail(email, (error, info) => {
    if (error) {
      console.log('Nodemailer error: ', error);
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Message sent' });
    }
  });
});

export default contactRoutes;
