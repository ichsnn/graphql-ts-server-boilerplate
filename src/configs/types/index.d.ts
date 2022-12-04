import { DataSourceOptions } from "typeorm";

export interface ITypeOrmConfig {
  production: DataSourceOptions;
  development: DataSourceOptions;
  test: DataSourceOptions;
}