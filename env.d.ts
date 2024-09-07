/// <reference path="./.astro/types.d.ts" />
// .env.d.ts
declare module NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      NODE_ENV: "development" | "production";
    }
  }
  