/// <reference types="chrome" />
declare global {
  interface Window {
    llamaCpp: { generate: (prompt: string) => Promise<string> };
  }
}
export {};
