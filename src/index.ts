import express from 'express';
import { dotenvConfig } from './env';

import { createWebhook, WEBHOOK_ENDPOINT } from './bot';

dotenvConfig();

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post(WEBHOOK_ENDPOINT, (req, res) => {
  console.log(req)
})

app.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
  createWebhook().then(console.log);
});
