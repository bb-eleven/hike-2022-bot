import fetch from "node-fetch";
import { dotenvConfig } from "../env";

dotenvConfig();

export const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/`;
export const WEBHOOK_ENDPOINT = '/message';

export const createWebhook = (): Promise<any> => {
  const params = new URLSearchParams({ url: process.env.BASE_URL + WEBHOOK_ENDPOINT, drop_pending_updates: 'true' });
  return fetch(TELEGRAM_API_URL + 'setWebhook', {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  }).then(res => res.json());
}

export const sendMethod = (method: string, body: {}): Promise<any> => {
  return fetch(TELEGRAM_API_URL + method, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(res => res.json());
}