import { StationConfig, StationNames, STATION_CELLS } from '../stations';
import { InlineKeyboardMarkup, InlineKeyboardButton, Message } from '@grammyjs/types';
import { sendMethod } from '../bot';
import { createMessageState } from '../bot/message-state';
import { sheets } from '../sheets';
import {
  createSheetsGetRequest,
  createSheetsUpdateRequest,
  MajorDimension,
} from '../sheets/request';

export const IDENTIFIER = 'redeem_points';
export const DESCRIPTION = 'Redeem points for a team.';

// 0
export const replyWithSelectTeamNumber = async (
  stationConfigs: StationConfig[],
  message: Message
): Promise<any> => {
  const selectTeamKeyboard: InlineKeyboardMarkup = {
    inline_keyboard: [
      Array.from({ length: 8 }, (_, i) => {
        const teamNo = String(i);
        return {
          text: teamNo,
          callback_data: createMessageState(IDENTIFIER, 0, teamNo),
        } as InlineKeyboardButton;
      }),
    ],
  };

  const body = {
    chat_id: message.chat.id,
    text: 'Which team is cashing in?\n10 points = $1',
    reply_markup: selectTeamKeyboard,
  };

  return sendMethod('sendMessage', body);
};

// 1
export const replyWithSelectPointsToRedeem = async (
  stationConfigs: StationConfig[],
  message: Message,
  data: string
): Promise<any> => {
  const [teamNo] = data.split(';');

  const pointsVals = (
    await sheets.spreadsheets.values.get(
      createSheetsGetRequest('Team' + teamNo + '!B10:B12', MajorDimension.COLUMNS)
    )
  ).data.values?.[0];
  if (!pointsVals) {
    return;
  }

  const [total, spent, balance] = pointsVals;
  const len = balance / 10;
  const buttons: InlineKeyboardButton[][] = [];
  let buttonRow: InlineKeyboardButton[] = [];

  for (let i = 0; i <= len; i++) {
    if (i > 4 && i % 5 === 0) {
      buttons.push(buttonRow);
      buttonRow = [];
    }
    buttonRow.push({
      text: String(i * 10),
      callback_data: createMessageState(IDENTIFIER, 1, `${i * 10};${data}`),
    });
  }
  buttons.push(buttonRow);

  const body = {
    chat_id: message.chat.id,
    text: `Team ${teamNo} can spend up to ${balance} points`,
    reply_markup: { inline_keyboard: buttons },
  };

  return sendMethod('sendMessage', body);
};

// 2
export const redeemPoints = async (
  stationConfigs: StationConfig[],
  message: Message,
  data: string
): Promise<any> => {
  const dataArr = data.split(';');
  const teamNo = dataArr[1];
  const pointsRedeemed = Number(dataArr[0]);

  if (!teamNo || !pointsRedeemed) {
    return;
  }

  const pointsVals = (
    await sheets.spreadsheets.values.get(
      createSheetsGetRequest('Team' + teamNo + '!B10:B12', MajorDimension.COLUMNS)
    )
  ).data.values?.[0];

  if (!pointsVals) {
    return;
  }

  const [total, oldSpent, oldBalance] = pointsVals.map((x) => Number(x));

  await sheets.spreadsheets.values.update(
    createSheetsUpdateRequest('Team' + teamNo + '!B11', { values: [[oldSpent + pointsRedeemed]] })
  );

  const body = {
    chat_id: message.chat.id,
    text: `Team ${teamNo} has redeemed $${
      pointsRedeemed / 10
    } for ${pointsRedeemed} points.\n\nTotal: ${total} points\nSpent: ${
      oldSpent + pointsRedeemed
    } points\nBalance: ${oldBalance - pointsRedeemed} points`,
  };

  return sendMethod('sendMessage', body);
};
