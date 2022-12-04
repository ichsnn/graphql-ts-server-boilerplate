import { DataSource } from "typeorm";
import typeOrmConfig from "../configs/typeormConfig";

const configEnv = () => {
  const nodeEnv = String(process.env.NODE_ENV).trim();
  if (nodeEnv === "production") {
    return typeOrmConfig.production;
  } else if (nodeEnv === "test") {
    return typeOrmConfig.test;
  } else {
    return typeOrmConfig.development;
  }
};

export const AppDataSource = new DataSource(configEnv());
