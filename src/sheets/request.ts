import { dotenvConfig } from '../env';

dotenvConfig();

export interface SheetsRequest {
  spreadsheetId: string;
  range: string;
  majorDimension?: MajorDimension;
  valueInputOption?: string;
  requestBody?: { values: any[][]; majorDimension?: MajorDimension };
}

export enum MajorDimension {
  ROWS = 'ROWS',
  COLUMNS = 'COLUMNS',
}

export const createSheetsGetRequest = (
  range: string,
  majorDimension?: MajorDimension
): SheetsRequest => ({
  spreadsheetId: process.env.SHEET_ID as string,
  range,
  majorDimension: majorDimension ?? MajorDimension.ROWS,
});

export const createSheetsUpdateRequest = (
  range: string,
  requestBody: { values: any[]; majorDimension?: MajorDimension }
): SheetsRequest => ({
  spreadsheetId: process.env.SHEET_ID as string,
  range,
  requestBody,
  valueInputOption: 'USER_ENTERED',
});
