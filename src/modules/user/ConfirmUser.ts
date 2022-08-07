import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { confirmUserPrefix } from "../constants/redisPrefix";

@Resolver()
export class ConfirmUserResolver {
	@Mutation(() => Boolean)
	async confirmUser(@Arg("token") token: string): Promise<Boolean> {
		const userId = await redis.get(confirmUserPrefix + token);
		if (!userId) return false;

		await User.update({ id: Number(userId) }, { confirmed: true });
		await redis.del(token);

		return true;
	}
}
