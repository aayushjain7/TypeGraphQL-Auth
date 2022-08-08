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

const meQuery = `
query Me{
  me {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("Me", () => {
	it("get user", async () => {
		const user = await User.create({
			password: faker.internet.password(),
			email: faker.internet.email(),
			lastName: faker.name.lastName(),
			firstName: faker.name.firstName(),
		}).save();
		const response = await gCall({
			source: meQuery,
			userId: user.id,
		});
		console.log(response);
		expect(response).toMatchObject({
			data: {
				me: {
					id: `${user.id}`,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
				},
			},
		});
	});

	it("return null", async () => {
		const response = await gCall({
			source: meQuery,
		});

		expect(response).toMatchObject({
			data: {
				me: null,
			},
		});
	});
});
