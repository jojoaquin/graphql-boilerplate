import { Request } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";

export interface CustomSession extends Session {
  userId: string;
}

export interface Context {
  redis: Redis;
  url: string;
  session: CustomSession;
  req: Request;
}

export interface ResolverMap {
  [key: string]: {
    [key: string]: (parent: any, args: any, context: Context, info: any) => any;
  };
}
