const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const WebpackDevServer = require('webpack-dev-server');
const TerserPlugin = require("terser-webpack-plugin");


require('dotenv').config();

const webpackConfig = {
    devtool: 'source-map',

    entry: {
        'frontend': path.resolve(__dirname, 'src/frontend.js'),
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../assets/js'),
    },


    resolve: {
        extensions: [".js", ".jsx", ".json"],
        alias: {
            "react": "preact-compat",
            "react-dom": "preact-compat"
        }

    },
    devServer: {},

    plugins: [
        new MiniCssExtractPlugin({
              // Options similar to the same options in webpackOptions.output
              // both options are optional
            filename: "../css/[name].css",
            chunkFilename: "../css/[id].css"
          }),
        new BrowserSyncPlugin(
            // BrowserSync options
            {
                // browse to http://localhost:3000/ during development
                host: process.env.HOST,
                port: process.env.PORT,
                // proxy the Webpack Dev Server endpoint
                // (which should be serving on http://localhost:3100/)
                // through BrowserSync
                proxy: process.env.PROXY

            },
            // plugin options
            {
                // prevent BrowserSync from reloading the page
                // and let Webpack Dev Server take care of this
                reload: true
            }
        )
    ],
module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', "preact"],
                    "plugins": [
                        ["@babel/plugin-proposal-class-properties"],
                        ["@wordpress/babel-plugin-makepot", { "output": "../languages/acowebs-plugin-boiler-plate-text-domain-en_US.po"}]
                    ]
                }
            }
        },

        {
            test: /\.scss$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // you can specify a publicPath here
                        // by default it use publicPath in webpackOptions.output
                        publicPath: '../'
                    }
            },
                // {loader: 'style-loader'},
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: 'lmsc_[local][hash:base64:5]',
                        },

                    }
            },
                {loader: 'sass-loader'},
                {
                    loader: 'sass-resources-loader',
                    options: {
                        sourceMap: true,
                        resources: [
                            path.resolve('src/variables.scss'),
                        ]
                    }
            }
            ],

    },
        {
            test: /\.css$/,
            use: [{
                loader: 'style-loader'
            },
                {
                    loader: 'css-loader'
            },

            ],
    },
    // {
    //     test: /\.(png|jp(e*)g|svg|gif)$/,
    //     use: [
    //       {
    //         loader: 'file-loader',
    //         options: {
    //             limit: 0,
    //             name: '../images/[name].[ext]',
    //             publicPath: './'
    //         },
    //       },
    //     ],
    // },

    {
        test: /\.(png|jpg|gif|svg|mp3)$/i,
        use: [
            {
                // loader: 'file-loader?name=[name].[ext]',
                loader: 'url-loader',
                options: {
                    limit: 0,
                    name: '../images/[name].[ext]',
                    publicPath: './'
                },
        }
        ]
    }


    ]
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {
                        drop_console: (process.env.NODE_ENV === 'production'),
                    },
                    mangle: {
                        reserved: ['__'],
                    },

                    module: false,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false,
                },
            }),
        ],
    },
};

if (process.env.NODE_ENV === 'production') {
    // webpackConfig.devtool = 'cheap-source-map';
    webpackConfig.devtool = false;
}

module.exports = webpackConfig;
