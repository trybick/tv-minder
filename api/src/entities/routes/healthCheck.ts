import express from 'express';

// This route is used by ECS to check if container is healthy
// Set via Load Balancers --> Target Group --> Health Checks

const healthCheckRoutes = express.Router();

healthCheckRoutes.get('/healthCheck', (req, res) => {
  res.status(200).json({ status: 'Word Up' });
});

export default healthCheckRoutes;
