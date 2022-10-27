import { StationConfig } from '../stations';
import { Message } from '@grammyjs/types';
import { sheets } from '../sheets';
import { createSheetsGetRequest } from '../sheets/request';
import { sendMethod } from '../bot';

export const IDENTIFIER = 'leaderboards';
export const DESCRIPTION = 'View team rankings';

// 0
export const getLeaderboards = async (
  stationConfigs: StationConfig[],
  message: Message
) => {
  const leaderboardsVals = (await sheets.spreadsheets.values.get(createSheetsGetRequest('Leaderboards!A2:D9'))).data.values;
  if (!leaderboardsVals) {
    return;
  }

  let teamNameMaxWidth = 0;
  let totalScoreMaxWidth = 0;
  const leaderboards: { team: string, total: number, spent: number, balance: number }[] =
    leaderboardsVals.map(([team, _total, _spent, _balance]) => {
      if (team.length > teamNameMaxWidth) {
        teamNameMaxWidth = team.length;
      }
      if (_total.length > totalScoreMaxWidth) {
        totalScoreMaxWidth = _total.length;
      }
      return {
        team: String(team),
        total: Number(_total),
        spent: Number(_spent),
        balance: Number(_balance)
      };
    })
      .sort((a, b) => b.total - a.total)
  
  const formattedLeaderboards = leaderboards
    .map(({ team, total }, index) => `${index + 1}. ${team.padEnd(teamNameMaxWidth + 4)}${String(total).padStart(totalScoreMaxWidth)}\n`)

  let leaderboardsTextView = '';
  for (const row of formattedLeaderboards) {
    leaderboardsTextView += row;
  }

  const body = {
    chat_id: message.chat.id,
    text: `Leaderboards\n\`\`\`\n${leaderboardsTextView}\n\`\`\``,
    parse_mode: 'MarkdownV2'
  }

  return sendMethod('sendMessage', body);
}