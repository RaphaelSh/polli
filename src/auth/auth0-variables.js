export const AUTH_CONFIG = {
  domain: process.env.REACT_APP_DOMAIN,
  clientId: process.env.REACT_APP_CLIENT_ID_POLLI,
  callbackUrl: 'https://polli-cloned-gilts.c9users.io',
  databaseConnection: process.env.REACT_APP_DATABASE_CONNECTION
}

export const NON_INTERACTIVE_CONFIG = {
  domain: process.env.REACT_APP_DOMAIN,
  client_id: process.env.REACT_APP_CLIENT_ID_NON_INTERACTIVE,
  client_secret: process.env.REACT_APP_SECRET_NON_INTERACTIVE
}
