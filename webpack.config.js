const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, "games", `${process.env.GAME}`, "src", "index.js"),
    output:
        process.env.NODE_ENV !== "production"
            ? {
                  filename: "main.js",
                  path: path.resolve(__dirname, "dist"),
              }
            : {
                  filename: "main.js",
                  path: path.resolve(__dirname, "dist"),
                  library: "game_generator",
                  libraryTarget: "umd",
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
            // {
            //     test: /\.(png|svg|jpg|gif)$/,
            //     use: ["file-loader"],
            // },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 200000,
                        },
                    },
                ],
            },
        ],
    },
    plugins:
        process.env.NODE_ENV !== "production"
            ? [
                  new HtmlWebpackPlugin({
                      title: "Output Management",
                  }),
              ]
            : [new CleanWebpackPlugin()],
    devtool: "inline-source-map",
};
