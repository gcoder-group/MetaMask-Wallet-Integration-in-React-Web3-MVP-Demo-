export const environment = {
  APP_NAME: import.meta.env.VITE_APP_NAME || "EVM React DApp",
  APP_URL: import.meta.env.VITE_APP_URL || window.location.href,
  INFURA_API_KEY: (import.meta.env.VITE_INFURA_API_KEY || "").trim(),
};
