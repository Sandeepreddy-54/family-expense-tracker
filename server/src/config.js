import 'dotenv/config';

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  relayToken: required('RELAY_TOKEN'),
  relayDefaultPerson: process.env.RELAY_DEFAULT_PERSON || 'you',
};
