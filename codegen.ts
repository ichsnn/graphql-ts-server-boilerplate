import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/schema.graphql",
  generates: {
    "./src/types/schema.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};
export default config;
