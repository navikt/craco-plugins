jest.mock('yargs', () => ({
    argv: {
        proxy: ['target2']
    }
}));

import {ChangeCssFilename, ChangeJsFilename, ConfigurableProxyTarget} from '../src';

interface CracoConfigOptions {
    filename: string;
    chunkFilename: string;
    runtimeChunk: object | boolean;
    splitChunks: object;
}

function defaultCracoConfig(
    options?: Partial<CracoConfigOptions>
) {
    const mergedOptions = {
        filename: "static/js/[name].[contenthash:8].js",
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
        runtimeChunk: {},
        splitChunks: {},
        ...options
    };
    return {
        webpack: {
            configure: {
                optimization: {
                    splitChunks: mergedOptions.splitChunks,
                    runtimeChunk: mergedOptions.runtimeChunk
                },
                output: {
                    filename: mergedOptions.filename,
                    chunkFilename: mergedOptions.chunkFilename
                }
            }
        }
    };
}

function defaultWebpackConfig(
    filename: string = "static/css/[name].[contenthash:8].css",
    chunkFilename: string = "static/css/[name].[contenthash:8].chunk.css"
) {
    return {
        plugins: [
            {
                options: {
                    type: "Plugin not related to CSS",
                    filename: 'not-a-css.js'
                }
            },
            {
                options: {
                    filename,
                    chunkFilename
                }
            },
            {options: {}},
            {}
        ]
    };
}

describe('ChangeCssFilename', () => {
    it('should mutate webpackconfig with default value', () => {
        const webpackConfig = ChangeCssFilename.overrideWebpackConfig({
            webpackConfig: defaultWebpackConfig()
        });

        expect(webpackConfig).toEqual(defaultWebpackConfig('static/css/[name].css', 'static/css/[name].chunk.css'));
    });

    it('should mutate webpackconfig with provided value', () => {
        const webpackConfig = ChangeCssFilename.overrideWebpackConfig({
            webpackConfig: defaultWebpackConfig(),
            pluginOptions: {filename: 'my-custom.css', chunkFilename: 'my-chunk.css'}
        });

        expect(webpackConfig).toEqual(defaultWebpackConfig('my-custom.css', 'my-chunk.css'));
    });
});

describe('ChangeJsFilename', () => {
    it('should use no-chunking as default', () => {
        const cracoConfig = ChangeJsFilename.overrideCracoConfig({
            cracoConfig: defaultCracoConfig()
        });

        const expected = defaultCracoConfig({
            filename: 'static/js/[name].js',
            chunkFilename: 'static/js/[name].chunk.js',
            runtimeChunk: false,
            splitChunks: {
                cacheGroups: {
                    default: false,
                    vendors: false
                }
            }
        });
        expect(cracoConfig).toEqual(expected);
    });

    it('should respect filename and chunkFilename options', () => {
        const cracoConfig = ChangeJsFilename.overrideCracoConfig({
            cracoConfig: defaultCracoConfig(),
            pluginOptions: {
                filename: 'customfile.js',
                chunkFilename: 'chunk.js'
            }
        });
        const expected = defaultCracoConfig({
            filename: 'customfile.js',
            chunkFilename: 'chunk.js',
            runtimeChunk: false,
            splitChunks: {
                cacheGroups: {
                    default: false,
                    vendors: false
                }
            }
        });
        expect(cracoConfig).toEqual(expected);
    });

    it('should respect runtimeChunk option name', () => {
        const cracoConfig = ChangeJsFilename.overrideCracoConfig({
            cracoConfig: defaultCracoConfig(),
            pluginOptions: {
                filename: 'customfile.js',
                chunkFilename: 'chunk.js',
                runtimeChunk: true
            }
        });

        const expected = defaultCracoConfig({
            filename: 'customfile.js',
            chunkFilename: 'chunk.js',
            runtimeChunk: { name: 'runtime' },
            splitChunks: {
                cacheGroups: {
                    default: false,
                    vendors: false
                }
            }
        });
        expect(cracoConfig).toEqual(expected);
    });

    it('should support simple vendor chunking', () => {
        const cracoConfig = ChangeJsFilename.overrideCracoConfig({
            cracoConfig: defaultCracoConfig(),
            pluginOptions: {
                filename: 'customfile.js',
                chunkFilename: 'chunk.js',
                splitChunks: 'VENDOR_CHUNKING',
                runtimeChunk: false
            }
        });

        const expected = defaultCracoConfig({
            filename: 'customfile.js',
            chunkFilename: 'chunk.js',
            runtimeChunk: false,
            splitChunks: {
                cacheGroups: {
                    default: false,
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        });
        expect(cracoConfig).toEqual(expected);
    });

    it('should support enabling full chunking', () => {
        const cracoConfig = ChangeJsFilename.overrideCracoConfig({
            cracoConfig: defaultCracoConfig(),
            pluginOptions: {
                filename: 'customfile.js',
                chunkFilename: 'chunk.js',
                splitChunks: 'DEFAULT_CHUNKING',
                runtimeChunk: true
            }
        });

        const expected = defaultCracoConfig({
            filename: 'customfile.js',
            chunkFilename: 'chunk.js',
            runtimeChunk: { name: 'runtime' },
            splitChunks: {}
        });
        expect(cracoConfig).toEqual(expected);
    });
});

describe('ConfigurableProxyTarget', () => {
    const defaultDevserverConfig = (value: any) => value;
    const baseDevserverConfig = (...targets: string[]) => ({
        proxy: targets.map((target) => ({target}))
    });

    it('should allow replacing dev-server-proxy with command-line attribute', () => {
        const cracoConfig = ConfigurableProxyTarget.overrideCracoConfig({
            cracoConfig: {
                devServer: defaultDevserverConfig
            }
        });
        const devServerConfig = cracoConfig.devServer(baseDevserverConfig('target1'));

        expect(cracoConfig.devServer).not.toBe(defaultDevserverConfig);
        expect(devServerConfig).toEqual(baseDevserverConfig('target2'))
    });
});
