const path = require("path");
const { PanoramaTargetPlugin } = require("webpack-panorama");

const isDevelopment = process.env.NODE_ENV == 'development'

/** @type {import('webpack').Configuration} */
module.exports = {
    entry: {
        example: "./index.ts",
    },

    mode: isDevelopment ? 'production' : "development",
    context: path.resolve(__dirname, "."),
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "../content/panorama/scripts/custom_game"),
        publicPath: "file://{resources}/scripts/custom_game/",
        chunkFormat: false,
        clean: true,
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader", options: { transpileOnly: true } },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", "..."],
        symlinks: false,
    },

    plugins: [new PanoramaTargetPlugin()],
};
