import express from 'express';

import routes from './routes';
import authenticate from './api/authenticate';
import * as redis from './services/redis';

const port = process.env.PORT || 8080;

redis.connect();
const app = express();

app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());

app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const credentials = req.headers.authorization?.split('Basic ')[1];

  if (credentials) {
    const [
      username,
      password,
    ] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':');
    const authorizedAccess = await authenticate(username, password);

    if (authorizedAccess) {
      next();
      return;
    }
  }

  res.status(400).json({
    message: 'Unauthorized access.',
  });
  return;
});

app.use('/api', routes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: err.message || 'Something went wrong.',
  });
});

const server = app.listen(port, () => {
  console.info(`App is now running on port ${port}.`);
});

export default server;
