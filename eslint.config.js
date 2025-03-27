import antfu from "@antfu/eslint-config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default antfu(
	{
		type: "app",
		typescript: true,
		ignores: ["**/drizzle/*", "**/*.yaml", "**/*.yml"]
	},
	{
		rules: {
			"no-console": ["warn"],
			"antfu/no-top-level-await": ["off"],
			"node/prefer-global/process": ["off"],
			"node/no-process-env": ["error"],
			"perfectionist/sort-imports": ["off"],
			"unicorn/filename-case": [
				"error",
				{
					case: "kebabCase",
					ignore: ["README.md"]
				}
			],
			"jsonc/indent": ["off"]
		}
	},
	eslintConfigPrettier
);
