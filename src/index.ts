import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express, { Express } from "express";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";

import { redis } from "./redis";
import { createSchema } from "./utils/createSchema";

const main = async () => {
	const isProduction = process.env.NODE_ENV === "production";

	await createConnection();
	const schema = await createSchema();

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }: any) => ({ req, res }),
	});

	const app: Express = express();

	const RedisStore = connectRedis(session);

	!isProduction && app.set("trust proxy", 1);

	app.use(
		session({
			store: new RedisStore({
				client: redis,
			}),
			name: "qid",
			secret: "sdijdncjansj23239slmas",
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				// secure: process.env.NODE_ENV === "production",
				maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
				sameSite: "none",
				secure: true,
			},
		} as any)
	);

	await apolloServer.start();
	apolloServer.applyMiddleware({
		app,
		cors: {
			origin: ["https://studio.apollographql.com"],
			credentials: true,
		},
	});

	app.listen(4000, () => {
		console.log("server started on http://localhost:4000/graphql");
	});
};
main();
