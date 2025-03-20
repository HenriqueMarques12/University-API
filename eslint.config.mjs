import prettier from 'eslint-plugin-prettier';
import tseslint from '@typescript-eslint/eslint-plugin';
import path from 'path';

const tsconfigRootDir = path.resolve(__dirname);

export default {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    tsconfigRootDir,
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
