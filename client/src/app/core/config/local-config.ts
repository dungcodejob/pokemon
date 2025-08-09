export type PKLocalConfig = {
  development: boolean;
  mode: 'dev' | 'staging' | 'prod';
  apiBaseUrl: string;
  appVersion: string;
  apiKey: string;
};
