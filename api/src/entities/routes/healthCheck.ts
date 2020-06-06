import express from 'express';

// This route is used by ECS to check if container is healthy

export const healthCheckRoutes = express.Router();

healthCheckRoutes.get('/healthCheck', (req, res) => {
  res.status(200).json({ status: 'Word Up' });
});
