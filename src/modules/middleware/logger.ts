import { MiddlewareFn } from "type-graphql";

export const logger: MiddlewareFn = async ({ args }, next) => {
	console.log("args logger", args);
	return next();
};
