module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
        jest: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: 12,
    },
    ignorePatterns: ["/build", "/node_modules"],
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        semi: ["error", "never"],
        "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
}
