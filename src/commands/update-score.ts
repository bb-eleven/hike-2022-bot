import { StationConfig } from "../stations";
import {
  InlineKeyboardMarkup,
  InlineKeyboardButton,
  Message,
} from "@grammyjs/types";
import { sendMethod } from "../bot";
import { createMessageState } from "../bot/message-state";

export const IDENTIFIER = "updateScore";

// 0
export const replyWithSelectTeamNumber = async (
  stationConfigs: StationConfig[],
  message: Message
): Promise<any> => {
  const selectTeamKeyboard: InlineKeyboardMarkup = {
    inline_keyboard: [
      Array.from({ length: 7 }, (_, i) => {
        const teamNo = String(i + 1);
        return {
          text: teamNo,
          callback_data: createMessageState(IDENTIFIER, 0, teamNo),
        } as InlineKeyboardButton;
      }),
    ],
  };

  const body = {
    chat_id: message.chat.id,
    text: "Which team do you want to update the score for?",
    reply_markup: selectTeamKeyboard,
  };

  return sendMethod("sendMessage", body);
};

// 1
export const replyWithStationOptions = async (
  stationConfigs: StationConfig[],
  message: Message,
  data: string
): Promise<any> => {
  const selectStationButtons: InlineKeyboardMarkup = {
    inline_keyboard: [...stationConfigs.values()].map((station, index) => [
      {
        text: station.name,
        callback_data: createMessageState(IDENTIFIER, 1, `${index};${data}`),
      } as InlineKeyboardButton,
    ]),
  };

  const body = {
    chat_id: message.chat.id,
    text: "Select a station",
    reply_markup: selectStationButtons,
  };

  return sendMethod("sendMessage", body);
};

// 2
export const replyWithScoreOptions = async (
  stationConfigs: StationConfig[],
  message: Message,
  data: string
): Promise<any> => {
  const dataArr = data.split(";");
  const teamNo = dataArr[1];

  const station = stationConfigs[Number(dataArr[0])];
  if (!station) {
    return;
  }

  const selectStationButtons: InlineKeyboardMarkup = {
    inline_keyboard: [
      station.scores.map(
        (score) =>
          ({
            text: String(score),
            callback_data: createMessageState(
              IDENTIFIER,
              2,
              `${score};${data}`
            ),
          } as InlineKeyboardButton)
      ),
    ],
  };

  const body = {
    chat_id: message.chat.id,
    text: `What score will you give Team ${teamNo} for ${station.name}?`,
    reply_markup: selectStationButtons,
  };

  return sendMethod("sendMessage", body);
};
