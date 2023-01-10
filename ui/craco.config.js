/*
 * @description: webpack配置文件
 * @author: Jack Chen @懒人码农
 * @Date: 2022-04-24 10:01:40
 * @LastEditors: fage
 * @LastEditTime: 2022-07-07 14:32:46
 */

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
			// 打压缩包
			...whenProd(
				() => [
					new CompressionWebpackPlugin({
						algorithm: "gzip",
						test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
						threshold: 1024,
						minRatio: 0.8
					}),
					// 去除 console debugger warning， 关闭 sourceMap
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
	plugins: [
		{
			plugin: CracoLessPlugin,
			options: {
				lessLoaderOptions: {
					lessOptions: {
						// 所有公共样式在此处配置
						modifyVars: {
							"@primary-color": "#1890ff"
						},
						javascriptEnabled: true
					}
				}
			}
		}
	],
	eslint: {
		enable: false
	}
};
