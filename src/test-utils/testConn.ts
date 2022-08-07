import { createConnection } from "typeorm";

export const testConn = (drop: boolean = false) => {
	return createConnection({
		name: "default",
		type: "postgres",
		host: "localhost",
		port: 5432,
		username: "cepl",
		password: "postgres",
		database: "typegraphql-basic-test",
		synchronize: drop,
		dropSchema: drop,
		entities: [__dirname + "/../entity/*.*"],
	});
};
