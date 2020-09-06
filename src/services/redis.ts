import redis, { RedisClient } from 'redis';

let client: RedisClient;

export const connect = (): Promise<RedisClient> =>
  new Promise((resolve, reject) => {
    client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT as string),
      password: process.env.REDIS_PASSWORD || undefined,
    });
    client.on('error', reject);
    client.on('connect', () => {
      resolve(client);
    });
  });

export const get = <T> (key: string): Promise<T | null> =>
  new Promise((resolve, reject) => {
    client.get(key, (err, value) => {
      if (err) {
        return reject(err);
      }
      resolve(value ? JSON.parse(value) : null);
    });
  });

export const set = <T> (key: string, value: T): Promise<void> =>
  new Promise((resolve, reject) => {
    client.set(key, JSON.stringify(value), (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
