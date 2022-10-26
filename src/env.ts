import * as dotenv from 'dotenv';

export const dotenvConfig = () =>
  dotenv.config({ path: `./.env.${process.env.NODE_ENV ?? 'development'}` });
