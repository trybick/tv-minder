import express from 'express';
import * as ContactController from 'entities/controllers/contact';

const contactRoutes = express.Router();

contactRoutes.post('/contact', ContactController.sendContactMessage);

export default contactRoutes;
