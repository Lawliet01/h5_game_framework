const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// module.exports = (env) => {
// 	// console.log(env.GAME);
// 	env.GAME = "planeGame";

// 	return {
// 		mode: "development",
// 		entry: `./src/${env.GAME}/index.js`,
// 		output: {
// 			filename: "main.js",
// 			path: path.resolve(__dirname, "dist"),
// 		},
// 		devServer: {
// 			contentBase: "./dist",
// 		},
// 		resolve: {
// 			alias: {
// 				"@": path.resolve(__dirname),
// 				common: path.resolve(__dirname, "common"),
// 				core: path.resolve(__dirname, "core"),
// 			},
// 		},
// 		module: {
// 			rules: [
// 				{
// 					test: /\.(png|svg|jpg|gif)$/,
// 					use: ["file-loader"],
// 				},
// 			],
// 		},
// 		plugins: [
// 			new CleanWebpackPlugin(),
// 			new HtmlWebpackPlugin({
// 				title: "Output Management",
// 				template: "./src/template/index.ejs",
// 			}),
// 		],
// 		devtool: "inline-source-map",
// 	};
// };


module.exports = {
	mode: "development",
	entry: path.resolve(__dirname, "games", `${process.env.GAME}`, 'src', 'index.js'),
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
	},
	devServer: {
		contentBase: "./dist",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname),
			common: path.resolve(__dirname, "common"),
			core: path.resolve(__dirname, "core"),
		},
	},
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: ["file-loader"],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: "Output Management",
		}),
	],
	devtool: "inline-source-map",
};
