// augment NodeJS.ProcessEnv for TS hints
declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    DATABASE_URL: string;
  }
}
