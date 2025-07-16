// src/types/global.d.ts
export {};

declare global {
  interface HttpError extends Error {
    statusCode?: number;
  }
}
