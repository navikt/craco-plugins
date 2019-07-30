jest.mock('yargs', () => ({
    argv: {
        proxy: ['target2']
    }
}));

import { RemoveCssHashPlugin, RemoveJsHashPlugin, ConfigurableProxyTarget } from '../src';
const BUILD_PATH = require('path').resolve(__dirname, './build').replace('\\test\\', '\\src\\');

describe('RemoveCssHashPlugin', () => {
    const baseWebpackConfig = (filename: string) => ({
        plugins: [
            {
                options: {
                    filename: 'not-a-css.js'
                }
            },
            {
                options: {
                    filename: filename
                }
            },
            {options: {}},
            {}
        ]
    });

    it('should mutate webpackconfig with default value', () => {
        const webpackConfig = RemoveCssHashPlugin.overrideWebpackConfig({
            webpackConfig: baseWebpackConfig('main.css')
        });

        expect(webpackConfig).toEqual(baseWebpackConfig('static/css/[name].css'));
    });

    it('should mutate webpackconfig with provided value', () => {
        const webpackConfig = RemoveCssHashPlugin.overrideWebpackConfig({
            webpackConfig: baseWebpackConfig('main.css'),
            pluginOptions: { filename: 'my-custom.css' }
        });

        expect(webpackConfig).toEqual(baseWebpackConfig('my-custom.css'));
    });
});

describe('RemoveJsHashPlugin', () => {
    const baseCracoConfig = (enableChunking: boolean, buildPath: string, filename: string) => ({
           webpack: {
               configure:  {
                   optimization: {
                       splitChunks: {
                           cacheGroups: {
                               default: enableChunking,
                               vendors: enableChunking
                           }
                       },
                       runtimeChunk: enableChunking
                   },
                   output: {
                       path: buildPath,
                       filename: filename
                   }
               }
           }
    });

    it('should disable chunking, set build-path and default filename', () => {
        const cracoConfig = RemoveJsHashPlugin.overrideCracoConfig({
          cracoConfig: baseCracoConfig(true, 'defualt-buildpath', 'default.js')
        });

        expect(cracoConfig).toEqual(baseCracoConfig(false, BUILD_PATH, 'static/js/[name].js'))
    });

    it('should disable chunking, set build-path and filename from pluginsOptions', () => {
        const cracoConfig = RemoveJsHashPlugin.overrideCracoConfig({
            cracoConfig: baseCracoConfig(true, 'defualt-buildpath', 'default.js'),
            pluginOptions: {
                filename: 'customfile.js',
                buildPath: 'mypath'
            }
        });

        expect(cracoConfig).toEqual(baseCracoConfig(false, 'mypath', 'customfile.js'))
    });
});

describe('ConfigurableProxyTarget', () => {
    const defaultDevserverConfig = (value: any) => value;
    const baseDevserverConfig = (...targets: string[]) => ({
        proxy: targets.map((target) => ({ target }))
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
