import { Session } from "express-session";
import { Redis } from "ioredis";

export interface CustomSession extends Session {
  userId: string;
}

export interface ResolverMap {
  [key: string]: {
    [key: string]: (
      parent: any,
      args: any,
      context: { redis: Redis; url: string; session: CustomSession },
      info: any
    ) => any;
  };
}
