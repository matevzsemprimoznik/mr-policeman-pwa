export {};

declare global {
  namespace Express {
    interface User {
      email: string;
    }
  }
}
