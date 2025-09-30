import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET should be at least 32 characters'),
  CLIENT_ORIGIN: z.string().default('*')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

export const env = {
  port: Number(parsed.data.PORT),
  mongoUri: parsed.data.MONGODB_URI,
  jwtSecret: parsed.data.JWT_SECRET,
  clientOrigin: parsed.data.CLIENT_ORIGIN
};
