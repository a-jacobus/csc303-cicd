import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  region: process.env.AWS_DEFAULT_REGION,
  table: process.env.USERS_TABLE,
}));
