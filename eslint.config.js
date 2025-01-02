import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'


/** @type {import('eslint').Linter.Config[]} */

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['dist'],
        files: ["src/**/*.ts"],
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
        }
    }
];

