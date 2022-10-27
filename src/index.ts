import express from 'express';
import { dotenvConfig } from './env';

import { setChatMenuButton, setCommands, setWebhook, WEBHOOK_ENDPOINT } from './bot';
import { loadStationConfigs, StationConfig } from './stations';
import * as UpdateScore from './commands/update-score';
import * as RedeemPoints from './commands/redeem-points';
import * as Leaderboards from './commands/leaderboards';
import { MessageStateFnMap, parseMessageState } from './bot/message-state';

dotenvConfig();

let stationConfigs: StationConfig[] = [];
let messageStateFnMap: MessageStateFnMap = {
  [UpdateScore.IDENTIFIER]: {
    0: UpdateScore.replyWithSelectTeamNumber,
    1: UpdateScore.replyWithStationOptions,
    2: UpdateScore.replyWithScoreOptions,
    3: UpdateScore.updateScore,
  },
  [RedeemPoints.IDENTIFIER]: {
    0: RedeemPoints.replyWithSelectTeamNumber,
    1: RedeemPoints.replyWithSelectPointsToRedeem,
    2: RedeemPoints.redeemPoints,
  },
  [Leaderboards.IDENTIFIER]: {
    0: Leaderboards.getLeaderboards,
  }
};

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post(WEBHOOK_ENDPOINT, (req, res) => {
  console.log(req.body);
  if (req.body.callback_query) {
    const callback_query = req.body.callback_query;
    const messageState = parseMessageState(callback_query.data);

    if (messageState !== null) {
      const { identifier, state, data } = messageState;

      const fn = messageStateFnMap[identifier]?.[state + 1];
      if (fn) fn(stationConfigs, callback_query.message, data);
    }
  } else if (req.body.message?.text[0] === '/') {
    const message = req.body.message;
    // remove '/' prefix and get only first word
    const identifier = message.text.slice(1).split(' ')[0];

    const initFn = messageStateFnMap[identifier]?.[0];
    if (initFn) initFn(stationConfigs, message);
  }
  res.status(200).send();
});

app.listen(process.env.PORT, async () => {
  console.log(`server started at port ${process.env.PORT}`);

  setWebhook().then(console.log);
  setCommands().then(console.log);
  setChatMenuButton().then(console.log);

  stationConfigs = await loadStationConfigs();
});
