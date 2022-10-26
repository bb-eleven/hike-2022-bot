import express from 'express';
import { dotenvConfig } from './env';

import { createWebhook, WEBHOOK_ENDPOINT } from './bot';
import { loadStationConfigs, StationConfig } from './stations';
import * as UpdateScore from './bot/update-score';

dotenvConfig();

let stationConfigs: StationConfig[] = [];
const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post(WEBHOOK_ENDPOINT, (req, res) => {
  console.log(req.body);
  const message = req.body.message;
  switch (message?.text) {
    case '/updateScore':
      UpdateScore.replyWithSelectTeamNumber(message);
      // UpdateScore.replyWithStationOptions(stationConfigs, message);
  }
  res.status(200).send();
});

app.listen(process.env.PORT, async () => {
  console.log(`server started at port ${process.env.PORT}`);

  createWebhook().then(console.log);
  stationConfigs = await loadStationConfigs();
});
