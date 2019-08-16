const argv = require('yargs').argv;

export const ChangeCssFilename = {
    overrideWebpackConfig: ({webpackConfig, pluginOptions = {}}: any) => {
        const plugins = webpackConfig.plugins;
        plugins.forEach((plugin: any) => {

            const options = plugin.options;

            if (!options) {
                return;
            }

            if (options.filename && options.filename.endsWith('.css')) {
                options.filename = pluginOptions.filename || "static/css/[name].css";
            }

        });

        return webpackConfig;
    }
};

export const ChangeJsFilename = {
    overrideCracoConfig: ({cracoConfig, pluginOptions = {}}: any) => {
        cracoConfig.webpack = {
            configure:{
                optimization: {
                    splitChunks: {
                        cacheGroups: {
                            default: false,
                            vendors: false
                        },
                    },
                    runtimeChunk: false
                },
                output: {
                    filename: pluginOptions.filename || 'static/js/[name].js',
                },
            }
        };

        return cracoConfig
    }
};

export const ConfigurableProxyTarget = {
    overrideCracoConfig: ({cracoConfig}: any) => {
        cracoConfig.devServer = (devServerConfig: any) => {
            const proxyOverrides = Array.isArray(argv.proxy) ? argv.proxy : [ argv.proxy ].filter((override) => override);
            for (let i = 0; i < Math.min(proxyOverrides.length, devServerConfig.proxy.length); i++) {
                devServerConfig.proxy[i].target = proxyOverrides[i]
            }

            return devServerConfig;
        };

        return cracoConfig;
    }
};
