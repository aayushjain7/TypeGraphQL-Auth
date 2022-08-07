import { gCall } from "../../../test-utils/gCall";
import { Connection } from "typeorm";
import { testConn } from "../../../test-utils/testConn";

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
    firstName
    lastName
    email
    name
  }
}
`;

describe("Register", () => {
	it("create user", async () => {
		console.log(
			await gCall({
				source: registerMutation,
				variableValues: {
					password: "1234",
					email: "typegraphauth2@yopmail.com",
					lastName: "graph",
					firstName: "type",
				},
			})
		);
	});
});
