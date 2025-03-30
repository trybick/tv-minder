import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import { fixupPluginRules } from '@eslint/compat';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(['node_modules/*', 'public/*', 'build/*']),
  {
    extends: compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:prettier/recommended'
    ),

    plugins: {
      'react-hooks': fixupPluginRules(reactHooks),
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'module',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'prettier/prettier': 1,
      '@typescript-eslint/ban-ts-ignore': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-use-before-define': 0,
      '@typescript-eslint/camelcase': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      'react-hooks/rules-of-hooks': 2,
      'react-hooks/exhaustive-deps': 1,
      'arrow-parens': ['warn', 'as-needed'],
      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/ban-types': 0,
      'react/jsx-uses-react': 0,
      'react/react-in-jsx-scope': 0,

      'react/jsx-sort-props': [
        1,
        {
          shorthandLast: true,
        },
      ],

      'sort-imports': [
        1,
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
    },
  },
]);
