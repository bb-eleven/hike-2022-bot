import { google } from "googleapis";
import { dotenvConfig } from "../env";

dotenvConfig();

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

export const sheets = google.sheets({
  version: "v4",
  auth,
});
