import { ITypeOrmConfig } from "../types";

const typeOrmConfig: ITypeOrmConfig = {
  production: {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "graphql-ts-server-boilerplate",
    synchronize: true,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
  },
  development: {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "graphql-ts-server-boilerplate",
    synchronize: true,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
  },
  test: {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "graphql-ts-server-boilerplate-test",
    synchronize: true,
    logging: false,
    dropSchema: true,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
  },
};

export default typeOrmConfig;
