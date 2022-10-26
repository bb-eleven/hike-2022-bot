import fetch from "node-fetch";
import * as UpdateScore from "../commands/update-score";
import * as RedeemPoints from "../commands/redeem-points";
import { dotenvConfig } from "../env";

dotenvConfig();

export const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/`;
export const WEBHOOK_ENDPOINT = "/message";

export const setWebhook = (): Promise<any> => {
  const body = {
    url: process.env.BASE_URL + WEBHOOK_ENDPOINT,
    drop_pending_updates: "true",
  };
  return sendMethod("setWebhook", body);
};

export const setCommands = (): Promise<any> => {
  const commands = [
    {
      command: UpdateScore.IDENTIFIER,
      description: UpdateScore.DESCRIPTION
    },
    {
      command: RedeemPoints.IDENTIFIER,
      description: RedeemPoints.DESCRIPTION
    }
  ]
  const body = { commands };
  return sendMethod('setMyCommands', body);
}

export const setChatMenuButton = (): Promise<any> => {
  const body = { menu_button: { type: 'commands' }};
  return sendMethod('setChatMenuButton', body);
}

export const sendMethod = (method: string, body: {}): Promise<any> => {
  return fetch(TELEGRAM_API_URL + method, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => res.json());
};
