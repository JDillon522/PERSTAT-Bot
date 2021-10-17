import { Client } from 'pg';

export const connectDatabase = (): Client => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    }
  });

  client.connect();

  return client;
}
