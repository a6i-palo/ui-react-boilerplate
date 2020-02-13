const path = require('path');
const dev = process.env.NODE_ENV !== 'production';
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const plugins = [
    new FriendlyErrorsWebpackPlugin(),
    new HtmlWebpackPlugin({
        inject: true,
        template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
        filename: 'styles.[hash:7].css',
        chunkFilename: '[id].css',
    }),
];
module.exports = {
    mode: dev ? 'development' : 'production',
    context: path.join(__dirname, ''),
    devtool: dev ? 'cheap-eval-source-map' : false,
    entry: {
        app: ['./src/index.tsx'],
    },
    resolve: {
        alias: { '~': path.resolve(__dirname, 'src')},
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: true,
                            localsConvention: 'asIs',
                            modules: {
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                            },
                        },
                    },
                    'postcss-loader',
                ],
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(jpg|png|gif|mp4|webm|mp3|ogg|svg)$/,
                loader: 'file-loader',
                options: {
                  name: './f/[hash:16].[ext]',
                },
            },
        ],
    },
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:7].js',
    },
    plugins,
    devServer: {
        compress: false,
        disableHostCheck: true,
        historyApiFallback: true,
        host: '0.0.0.0',
        inline: true,
        port: 3000,
        stats: {
            colors: true,
            progress: true,
        },
    },
};
