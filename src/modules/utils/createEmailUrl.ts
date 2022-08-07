import { redis } from "../../redis";
import { v4 } from "uuid";
import {
	confirmUserPrefix,
	forgotPasswordPrefix,
} from "../constants/redisPrefix";

export const createConfirmationUrl = async (
	userId: number
): Promise<string> => {
	const token = v4();
	await redis.set(confirmUserPrefix + token, userId, "EX", 60 * 60 * 24); // 1 day expiration
	return `http://localhost:3000/user/confirm/${token}`;
};

export const createForgotPasswordUrl = async (
	userId: number
): Promise<string> => {
	const token = v4();
	await redis.set(forgotPasswordPrefix + token, userId, "EX", 60 * 60 * 24); // 1 day expiration
	return `http://localhost:3000/user/change-password/${token}`;
};
