import { Connection } from "typeorm";
import { faker } from "@faker-js/faker";

import { gCall } from "../../../test-utils/gCall";
import { testConn } from "../../../test-utils/testConn";
import { User } from "../../../entity/User";

let conn: Connection;
beforeAll(async () => {
	conn = await testConn();
});
afterAll(async () => {
	await conn.close();
});

const registerMutation = `
mutation Register(
  $password: String!
  $email: String!
  $lastName: String!
  $firstName: String!
) {
  register(
    data: {
      password: $password
      email: $email
      lastName: $lastName
      firstName: $firstName
    }
  ) {
    id
    email
    firstName
    lastName
  }
}
`;

describe("Register", () => {
	it("create user", async () => {
		const user = {
			password: faker.internet.password(),
			email: faker.internet.email(),
			lastName: faker.name.lastName(),
			firstName: faker.name.firstName(),
		};
		const response = await gCall({
			source: registerMutation,
			variableValues: user,
		});

		expect(response).toMatchObject({
			data: {
				register: {
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
				},
			},
		});

		const dbUser = await User.findOne({ where: { email: user.email } });
		expect(dbUser).toBeDefined();
		expect(dbUser!.confirmed).toBeFalsy();
		expect(dbUser!.firstName).toBe(user.firstName);
	});
});
