const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const { ModuleFederationPlugin } = require("webpack").container
const path = require("path")
const envFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev"
require("dotenv").config({ path: envFile })

module.exports = {
    mode: "development",
    entry: "./src/main.tsx",
    cache: {
        type: "filesystem",
    },
    devServer: {
        port: 3000,
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, "public")
        },
        hot: false,
        liveReload: true
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "auto",
        clean: true,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(css|scss)$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "shell",
            filename: "remoteEntry.js",
            remotes: {
                playground: `playground@${process.env.PLAYGROUND_REMOTE}`,
                templates: `templates@${process.env.TEMPLATES_REMOTE}`,
                evaluation: `evaluation@${process.env.EVALUATION_REMOTE}`
            },
            exposes: {
                "./authStore": "./src/store/auth.store.ts",
                "./savedPromptsStore": "./src/store/savedPrompts.store.ts",
                "./ConfirmModal": "./src/components/modal/ConfirmModal.tsx"
            },
            shared: {
                react: { singleton: true, requiredVersion: false },
                "react-dom": { singleton: true, requiredVersion: false },
                zustand: { singleton: true, requiredVersion: false },
                "react-router-dom": { singleton: true, requiredVersion: false },
                "react-toastify": { singleton: true, requiredVersion: false }
            },
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "public"),
                    globOptions: {
                        ignore: ["**/index.html"],
                    },
                },
            ],
        }),
    ],
}