const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
    {
        basePath: "./src/",
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js }, 
        extends: ["js/recommended"],
        rules: {
            complexity: ["warn", 4],
            "max-depth": ["error", 2],
            "max-statements": ["error", 12],
            "max-params": ["error", 3],
        }
    },
    tseslint.configs.recommended
]);
