import 'dotenv/config';

const requiredEnv = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'CLIENT_ORIGIN'] as const;

type EnvKey = (typeof requiredEnv)[number];

function getEnv(key: EnvKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: Number(getEnv('PORT')),
  mongoUri: getEnv('MONGODB_URI'),
  jwtSecret: getEnv('JWT_SECRET'),
  clientOrigin: getEnv('CLIENT_ORIGIN')
};
