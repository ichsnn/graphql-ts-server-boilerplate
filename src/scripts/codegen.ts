import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/modules/**/*.graphql",
  generates: {
    "./src/modules": {
      preset: "graphql-modules",
      presetConfig: {
        baseTypesPath: '../types/graphql.ts',
        filename: 'types.ts'
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};
export default config;
