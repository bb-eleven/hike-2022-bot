import { StationConfig } from "../stations";
import { ReplyKeyboardMarkup, InlineKeyboardButton, Message } from '@grammyjs/types';
import fetch from "node-fetch";
import { TELEGRAM_API_URL } from ".";

export const replyWithSelectTeamNumber = async (message: Message): Promise<any> => {
  const selectTeamKeyboard: ReplyKeyboardMarkup = {
    one_time_keyboard: true,
    keyboard: [Array.from({ length: 7 }, (_, i) => {
      const teamNo = String(i + 1);
      return { text: teamNo, callback_data: teamNo } as InlineKeyboardButton;
    })]
  }

  const body = {
    chat_id: message.chat.id,
    text: 'Which team do you want to update the score for?',
    reply_markup: selectTeamKeyboard
  };

  return fetch(TELEGRAM_API_URL + 'sendMessage', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then(res => res.json());
}

export const replyWithStationOptions = async (stationConfigs: StationConfig[], message: Message): Promise<any> => {
  const selectStationButtons: ReplyKeyboardMarkup = {
    one_time_keyboard: true,
    keyboard: [...stationConfigs.values()].map((station) => [
      {
        text: station.name,
        callback_data: station.name
      } as InlineKeyboardButton
    ])
  };

  const body = {
    chat_id: message.chat.id,
    text: 'Select a station',
    reply_markup: selectStationButtons
  };

  return fetch(TELEGRAM_API_URL + 'sendMessage', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then(res => res.json());
}