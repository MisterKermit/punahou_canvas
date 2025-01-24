import { config } from "dotenv"

export interface EnvSchema {
  corsDomain: string
  appPort: number
  wsPort: number
  db: {
    user: string
    host: string
    password: string
    port: number
    database: string
  }
}

function getEnv(key: string): string {
  const env = process.env[key];
  if (env === undefined) {
    throw new Error(`env var '${key}' does not exist`);
  }
  return env!;
}

function getNum(key: string): number {
  const val = getEnv(key);
  const res = parseInt(val);
  if (isNaN(res)) {
    throw new Error(`env var '${key}' is not a number`);
  }
  return res;
}

export function loadEnv() {
  config() // dotenv
  const env: EnvSchema = {
    corsDomain: getEnv("CORS_DOMAIN"),
    appPort: getNum("APP_PORT"),
    wsPort: getNum("WS_PORT"),
    db: {
      user: getEnv("DB_USER"),
      host: getEnv("DB_HOST"),
      password: getEnv("DB_PASSWORD"),
      port: getNum("DB_PORT"),
      database: getEnv("DB_NAME")
    }
  };
  return env
}
