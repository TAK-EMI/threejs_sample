module.exports = {
	mode: "development",
	entry: {
		template: "./src/ts/template.ts",
		draw_style: "./src/ts/draw_style.ts",
		transform: "./src/ts/transform.ts",
		select_transform: "./src/ts/select_transform.ts",
		cubic_bezier: "./src/ts/cubic_bezier.ts",
		file_load_obj: "./src/ts/file_load_obj.ts",
		one_view: "./src/ts/one_view.ts"
	},
	output: {
		path: `${__dirname}/docs/js`,
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				enforce: 'pre',
				exclude: /node_modules/,
				loader: 'eslint-loader',
				options: {
					fix: true
				}
			},
			{
				test: /\.ts$/,
				loader: "ts-loader"
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	}
};
