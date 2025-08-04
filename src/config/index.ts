import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

export type ConfigType = {
    DATABASE_URL: string;
    JWT_ACCESS_KEY: string;
    JWT_REFRESH_KEY: string;
    EMAIL: string;
    EMAIL_KEY: string
};

const requiredVariables = [
  'DATABASE_URL',
  'JWT_ACCESS_KEY',
  'JWT_REFRESH_KEY',
  'EMAIL',
  'EMAIL_KEY'
];

const missingVariables = requiredVariables.filter((variable) => {
  const value = process.env[variable];
  return !value || value.trim() === '';
});

if (missingVariables.length > 0) {
  Logger.error(
    `Missing or empty required environment variables: ${missingVariables.join(', ')}`,
  );
  process.exit(1);
}

export const config: ConfigType = {
  DATABASE_URL: process.env.DB_URL  as string,
  JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY as string,
  JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY as string,
  EMAIL: process.env.EMAIL as string,
  EMAIL_KEY: process.env.EMAIL_KEY as string
};
