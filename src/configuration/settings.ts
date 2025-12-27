export const Settings = {
  API: {
    URL: 'https://14.design.htmlacademy.pro/six-cities',
    TIMEOUT: 5000
  },
  AUTH_TOKEN_KEY_NAME: 'six-cities-token',
  NEARBY_OFFERS_LIMIT: 3,
  OFFER_MAX_IMAGES: 6,
  OFFER_REVIEW: {
    MAX_TO_SHOW: 10,
    COMMENT_MIN_LENGTH: 50,
    COMMENT_MAX_LENGTH: 300
  }
} as const;
