import fetch from "node-fetch";
import { dotenvConfig } from "../env";

dotenvConfig();

const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/`;

export const WEBHOOK_ENDPOINT = '/message';
export const createWebhook = (): Promise<any> => {
  const params = new URLSearchParams({ url: process.env.BASE_URL + WEBHOOK_ENDPOINT });
  return fetch(url + 'setWebhook', {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  }).then(res => res.json());
}