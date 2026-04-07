// Configuration constants for the application
export const CONFIG = {
  PRECISION: {
    DECIMAL_THRESHOLD: 0.01,
    ROUNDING_DECIMALS: 2,
  },
  VALIDATION: {
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 1_000_000,
    MAX_NAME_LENGTH: 10,
  },
  NOTIFICATIONS: {
    AUTO_HIDE_DELAY: 3000,
  },
} as const;
