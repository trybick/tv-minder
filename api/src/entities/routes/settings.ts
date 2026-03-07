import express from 'express';
import verifyToken from 'middleware/verifyToken';
import * as SettingsController from 'entities/controllers/settings';

const settingsRoutes = express.Router();

settingsRoutes.get('/settings', verifyToken, SettingsController.getSettings);
settingsRoutes.put('/settings', verifyToken, SettingsController.updateSettings);

export default settingsRoutes;
