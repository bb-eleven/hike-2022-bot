import { sheets } from './sheets';
import { createSheetsGetRequest } from './sheets/request';

export enum StationNames {
  UNCLE_RAYMOND_DANCE = 'Uncle Raymond Dance',
  CHAPTEH = 'Chapteh',
  SHOPPING_CHALLENGE = 'Mystery Item Shopping Challenge',
  TRASH_CLEANING = 'Trash Cleaning',
  MATHS_QUIZ = 'Maths Quiz',
  PLACE_BINGO = 'Place bingo',
  CHECKPOINT = 'Checkpoint',
  FLAG = 'Flag',
}

export const STATION_CELLS: {
  [stationName: string]: string;
} = {
  [StationNames.UNCLE_RAYMOND_DANCE]: 'B3',
  [StationNames.CHAPTEH]: 'B4',
  [StationNames.SHOPPING_CHALLENGE]: 'B5',
  [StationNames.TRASH_CLEANING]: 'B6',
  [StationNames.MATHS_QUIZ]: 'B7',
  [StationNames.PLACE_BINGO]: 'B8',
  [StationNames.CHECKPOINT]: 'B9',
  [StationNames.FLAG]: 'B10',
};

export interface StationConfig {
  name: StationNames | string;
  scores: number[];
}

export const loadStationConfigs = async () => {
  const stationConfigs: StationConfig[] = [];
  const stationConfigsVals = (
    await sheets.spreadsheets.values.get(createSheetsGetRequest('Stations!B2:D9'))
  ).data.values;

  Object.keys(STATION_CELLS).forEach((name, index) => {
    const scores: number[] = stationConfigsVals?.[index].map((scoreStr) => Number(scoreStr)) ?? [
      20, 50,
    ];
    stationConfigs.push({ name, scores });
  });

  return stationConfigs;
};
