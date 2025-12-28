import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        basePath: "src/",
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js }, 
        extends: ["js/recommended"],
        rules: {
            complexity: ["warn", 4],
            "max-depth": ["warn", 1]
        }
    },
    tseslint.configs.recommended
]);
