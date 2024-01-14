module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module"
    },
    plugins: ["@typescript-eslint/eslint-plugin"],
    extends: [
        "plugin:@typescript-eslint/recommended"
    ],
    root: true,
    env: {
        node: true,
        jest: true
    },
    ignorePatterns: [".eslintrc.js"],
    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-member-accessibility": ["error", {
            accessibility: "explicit",
            overrides: {
                accessors: "explicit",
                constructors: "explicit",
                methods: "explicit",
                properties: "explicit",
                parameterProperties: "explicit"
            }
        }],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/prefer-readonly": "error",
        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/typedef": "error",
        "arrow-parens": ["error", "as-needed"],
        "comma-dangle": ["error", "never"],
        "curly": ["error", "all"],
        "eqeqeq": "error",
        "indent": ["error", 4],
        "new-parens": ["error", "always"],
        "newline-before-return": "error",
        "no-shadow": "error",
        "object-curly-spacing": ["error", "always"],
        "prefer-const": "error",
        "quotes": ["error", "double", {
            "allowTemplateLiterals": true
        }],
        "semi": ["error", "always"],
        "spaced-comment": ["error", "always"]
    },
};
