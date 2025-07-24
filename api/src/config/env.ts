import dotenv from 'dotenv';

dotenv.config();

const validateEnvVar = (varName: string): string => {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`❌ Environment variable '${varName}' is required but not defined.`);
  }
  return value;
};

const envConfig = {
  DB_PASSWORD: validateEnvVar('DB_PASSWORD'),
  JWT_KEY: validateEnvVar('JWT_KEY'),
  SENDGRID_KEY: validateEnvVar('SENDGRID_KEY'),
} as const;

export default envConfig;
