import { User } from "../../entity/User";
import {
	Arg,
	ClassType,
	Field,
	InputType,
	Mutation,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import { RegisterInput } from "./register/RegisterInput";
import { Product } from "../../entity/Product";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";

function createResolver<T extends ClassType, X extends ClassType>(
	suffix: string,
	returnType: T,
	InputType: X,
	entity: any,
	middleware?: Middleware<any>[]
) {
	@Resolver()
	class BaseResolver {
		@Mutation(() => returnType, { name: `create${suffix}` })
		@UseMiddleware(...(middleware || []))
		async create(@Arg("data", () => InputType) data: any) {
			return entity.create(data).save();
		}
	}
	return BaseResolver;
}

@InputType()
class ProductInput {
	@Field()
	name: string;
}

export const CreateUserResolver = createResolver(
	"User",
	User,
	RegisterInput,
	User
);
export const CreateProductResolver = createResolver(
	"Product",
	Product,
	ProductInput,
	Product
);
