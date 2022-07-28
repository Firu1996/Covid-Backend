export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      API_Total_Daily: string;
      API_Total_Daily_PROVINCES: string;
      REDIS_URL: string;
    }
  }
}
