import * as redis from './src/services/redis';
import countries from './src/configs/country';

const username = process.env.AUTH_USERNAME || 'username';
const password = process.env.AUTH_PASSWORD || 'password';

(async () => {
  try {
    const redisClient = await redis.connect();

    console.log('Seeding data...');

    const countryData = countries.map(country => ({
      ...country,
      population: Math.floor((Math.random() * 10000000) + 1000000),
    }));
    await redis.set('countries', countryData);
    await redis.set('authentication', {
      username,
      password,
    });

    console.log('Seeded data.');

    redisClient.end(true);
  } catch (error) {
    console.error('Something went wrong while seeding data.', error.message);
    process.exit(1);
  }
})();
