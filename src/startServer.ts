import { isAuthMiddleware } from "./middleware";
import { genSchema } from "./utils/genSchema";
import { confirmEmail } from "./routes/confirmEmail";
import { redis } from "./redis";
import { createTypeOrmConn } from "./utils/createTypeOrmConn";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { applyMiddleware } from "graphql-middleware";
import session from "express-session";
import RedisStore from "connect-redis";
import cors from "cors";

export const startServer = async () => {
  const schema = genSchema();

  const app = express();

  const schemaWithMiddleware = applyMiddleware(schema, isAuthMiddleware);

  const server = new ApolloServer({
    schema: schemaWithMiddleware,
    formatError: (error) => {
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
        extensions: {
          code: error.extensions!.code,
        },
      };
    },
  });

  await server.start();

  app.use(
    cors({
      credentials: true,
      origin: process.env.NODE_ENV === "test" ? "*" : process.env.FRONTEND_HOST,
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: "qid",
      resave: false,
      saveUninitialized: false,
      secret: "adwadawdaw",
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
      },
    })
  );

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
        redis,
        url: req.protocol + "://" + req.get("host"),
        userId: 1,
        session: req.session,
      }),
    })
  );

  app.get("/confirm/:id", confirmEmail);

  await createTypeOrmConn();

  const PORT = process.env.NODE_ENV === "test" ? 4001 : 4000;
  app.listen(PORT, () => {
    console.log(`🚀  Server ready at: http://localhost:${PORT}/graphql`);
  });
};
