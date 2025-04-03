import { fileURLToPath } from 'node:url';

import comments from '@eslint-community/eslint-plugin-eslint-comments';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import antfu from 'eslint-plugin-antfu';
import importX from 'eslint-plugin-import-x';
import node from 'eslint-plugin-n';
import perfectionist from 'eslint-plugin-perfectionist';
import globals from 'globals';
import ts from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	node.configs['flat/recommended'],
	{
		ignores: ['drizzle/**', '.changeset/**', 'CHANGELOG.md'],
		plugins: {
			import: importX,
			comments,
			antfu,
			perfectionist
		},
		languageOptions: {
			globals: {
				...globals.node
			},
			ecmaVersion: 'latest',
			sourceType: 'module'
		},
		rules: {
			'linebreak-style': ['warn', 'windows'],
			'no-debugger': ['error'],
			'no-empty': [
				'warn',
				{
					allowEmptyCatch: true
				}
			],
			'no-undef': 'off',
			'no-process-exit': 'off',
			'no-useless-escape': 'off',
			'prefer-const': [
				'warn',
				{
					destructuring: 'all'
				}
			],

			'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
			'import/first': 'error',
			'import/no-duplicates': 'error',
			'import/no-mutable-exports': 'error',
			'import/no-named-default': 'error',
			'import/no-self-import': 'error',
			'import/no-webpack-loader-syntax': 'error',
			'import/newline-after-import': ['error', { count: 1 }],

			'n/no-missing-import': 'off',
			'n/no-missing-require': 'off',
			'n/no-deprecated-api': 'off',
			'n/no-unpublished-import': 'off',
			'n/no-unpublished-require': 'off',
			'n/no-unsupported-features/es-syntax': 'off',
			'n/no-unsupported-features/node-builtins': 'off',
			'n/no-process-exit': 'off',
			'n/handle-callback-err': ['error', '^(err|error)$'],
			'n/no-exports-assign': 'error',
			'n/no-new-require': 'error',
			'n/no-path-concat': 'error',
			'n/no-process-env': 'error',

			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports'
				}
			],
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/no-empty-function': [
				'error',
				{
					allow: ['arrowFunctions']
				}
			],
			'@typescript-eslint/no-unused-expressions': 'warn',
			'@typescript-eslint/no-empty-interface': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',

			'comments/no-aggregating-enable': 'error',
			'comments/no-duplicate-disable': 'error',
			'comments/no-unlimited-disable': 'error',
			'comments/no-unused-enable': 'error',

			'antfu/consistent-chaining': 'error',
			'antfu/consistent-list-newline': 'error',
			'antfu/import-dedupe': 'error',
			'antfu/no-import-dist': 'error',
			'antfu/no-import-node-modules-by-path': 'error',
			'antfu/top-level-function': 'error',

			'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
			'perfectionist/sort-imports': [
				'error',
				{
					groups: [
						'type',
						['parent-type', 'sibling-type', 'index-type', 'internal-type'],
						'builtin',
						'external',
						'internal',
						['parent', 'sibling', 'index'],
						'side-effect',
						'object',
						'unknown'
					],
					newlinesBetween: 'always',
					order: 'asc',
					type: 'natural'
				}
			],
			'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
			'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'natural' }]
		}
	}
);
