/* eslint-disable no-console */
import packageInfo from "../package.json";

const external = Object.keys(packageInfo.dependencies);

await Bun.$`(rm -rf dist || echo '')`;
console.log("Starting the build process... ✨");

await Bun.build({
	entrypoints: ["src/app.ts"],
	outdir: "dist",
	target: "node",
	format: "esm",
	sourcemap: "linked",
	minify: true,
	external
});

console.log("Build process finished! 🎉");
