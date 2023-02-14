
const CracoLessPlugin = require("craco-less");
const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

const { when, whenDev, whenProd } = require("@craco/craco");

module.exports = {
	devServer: {
		port: 2222
	},
	webpack: {
		alias: {
			"@": path.resolve("src"),
			"@statics": path.resolve(__dirname, "src/statics"),
			"@views": path.resolve(__dirname, "src/views"),
			"@comp": path.resolve(__dirname, "src/components"),
			"@services": path.resolve(__dirname, "src/services"),
			"@utils": path.resolve(__dirname, "src/utils"),
			"@redux": path.resolve(__dirname, "src/redux"),
			"@styles": path.resolve(__dirname, "src/styles")
		},
		publicPath: "/",
		plugins: [
			// new BundleAnalyzerPlugin(),
			// zip and package
			...whenProd(
				() => [
					new CompressionWebpackPlugin({
						algorithm: "gzip",
						test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
						threshold: 1024,
						minRatio: 0.8
					}),
					// clear console debugger warning， close sourceMap
					new UglifyJsPlugin({
						uglifyOptions: {
							warnings: false,
							drop_debugger: true,
							drop_console: true
						},
						sourceMap: false,
						parallel: true
					})
				],
				[]
			)
		]
	},
	babel: {
		plugins: [
			...whenProd(
				() => [
					["import", { libraryName: "antd", style: true }],
					["@babel/plugin-proposal-decorators", { legacy: true }]
				],
				[]
			)
		]
	},
	// plugins: [
	// 	{
	// 		plugin: CracoLessPlugin,
	// 		options: {
	// 			lessLoaderOptions: {
	// 				lessOptions: {
	// 					// public style
	// 					modifyVars: {
	// 						"var(--theme-color)": "#e6007a"//"#1890ff"
	// 					},
	// 					javascriptEnabled: true
	// 				}
	// 			}
	// 		}
	// 	}
	// ],
	eslint: {
		enable: false
	}
};
