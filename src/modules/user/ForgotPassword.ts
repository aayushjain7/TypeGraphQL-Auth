import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { createForgotPasswordUrl } from "../utils/createEmailUrl";
import { sendEmail } from "../utils/sendEmail";

@Resolver()
export class ForgotPasswordResolver {
	@Mutation(() => Boolean)
	async forgotPassword(@Arg("email") email: string): Promise<boolean> {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return false;
		}

		await sendEmail(email, await createForgotPasswordUrl(user.id));
		return true;
	}
}
