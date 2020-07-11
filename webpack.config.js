module.exports = {
	mode: "development",
	entry: {
		template: "./src/ts/template.ts"
	},
	output: {
		path: `${__dirname}/src/js`,
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader"
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	}
};
