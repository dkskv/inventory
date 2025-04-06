import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  // @ts-expect-error нужно установить @types/node, но скрыть эти типы для кода src
  schema: process.env.VITE_API_URL,
  documents: "src/**/*.graphql",
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
