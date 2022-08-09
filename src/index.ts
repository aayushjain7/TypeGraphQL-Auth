import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express, { Express } from "express";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";

import { redis } from "./redis";
import { createSchema } from "./utils/createSchema";
import queryComplexity, { simpleEstimator } from "graphql-query-complexity";

const main = async () => {
	const isProduction = process.env.NODE_ENV === "production";

	await createConnection();
	const schema = await createSchema();

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }: any) => ({ req, res }),
		validationRules: [
			queryComplexity({
				// The maximum allowed query complexity, queries above this threshold will be rejected
				maximumComplexity: 8,
				// The query variables. This is needed because the variables are not available
				// in the visitor of the graphql-js library
				variables: {},
				// Optional callback function to retrieve the determined query complexity
				// Will be invoked weather the query is rejected or not
				// This can be used for logging or to implement rate limiting
				onComplete: (complexity: number) => {
					console.log("Query Complexity:", complexity);
				},
				estimators: [
					// This will assign each field a complexity of 1 if no other estimator
					// returned a value. We can define the default value for field not explicitly annotated
					simpleEstimator({
						defaultComplexity: 1,
					}),
				],
			}) as any,
		],
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
