import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    ".next-development/**",
    ".next-production/**",
    "node_modules/**",
    "coverage/**",
    "prisma/generated/**",
  ]),
]);
