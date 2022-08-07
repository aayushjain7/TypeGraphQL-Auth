import { MyContext } from "src/types/MyContext";
import { Ctx, Query, Resolver } from "type-graphql";

import { User } from "../../entity/User";

@Resolver()
export class MeResolver {
	@Query(() => User, { nullable: true })
	async me(@Ctx() ctx: MyContext): Promise<User | null> {
		if (!ctx.req.session.userId) {
			return null;
		}
		return User.findOne({ where: { id: ctx.req.session!.userId } });
	}
}
