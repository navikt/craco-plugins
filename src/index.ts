const argv = require('yargs').argv;

export enum ChunkingStrategy {
    NO_CHUNKING= "NO_CHUNKING",
    VENDOR_CHUNKING = "VENDOR_CHUNKING",
    DEFAULT_CHUNKING = 'DEFAULT_CHUNKING'
}
interface ChunkingConfig {
    cacheGroups?: { [key: string]: boolean | { test: RegExp; name: string; chunks: string; } };
    chunks?: string;
    name?: boolean;
}
const chunkingStrategyConfig: Record<ChunkingStrategy, ChunkingConfig> = {
    [ChunkingStrategy.NO_CHUNKING]: {
        cacheGroups: {
            default: false,
            vendors: false
        }
    },
    [ChunkingStrategy.VENDOR_CHUNKING]: {
        cacheGroups: {
            default: false,
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all'
            }
        }
    },
    [ChunkingStrategy.DEFAULT_CHUNKING]: {}, // Do nothing, allows default configuration to be used
}

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
                options.chunkFilename = pluginOptions.chunkFilename || "static/css/[name].chunk.css";
            }

        });

        return webpackConfig;
    }
};

export const ChangeJsFilename = {
    overrideCracoConfig: ({cracoConfig, pluginOptions = {}}: any) => {
        const allowRuntimeChunk = pluginOptions.runtimeChunk || false;
        const chunkingStrategy: ChunkingStrategy = pluginOptions.splitChunks || ChunkingStrategy.NO_CHUNKING;
        const chunkingConfig: ChunkingConfig = chunkingStrategyConfig[chunkingStrategy];
        const optimization = {
            splitChunks: chunkingConfig,
            runtimeChunk: allowRuntimeChunk ? { name: 'runtime' } : false
        };

        cracoConfig.webpack = {
            configure: {
                optimization: optimization,
                output: {
                    filename: pluginOptions.filename || 'static/js/[name].js',
                    chunkFilename: pluginOptions.chunkFilename || "static/js/[name].chunk.js",
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
