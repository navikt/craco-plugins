# craco-plugins

Collection of useful craco-plugins

[![npm version](https://badge.fury.io/js/%40navikt%2Fcraco-plugins.svg)](https://www.npmjs.com/package/@navikt/craco-plugins)

### Plugins

#### ChangeCssFilename
Allows you to change the filenames of css-files outputted by create-react-app.
Most commonly used to remove the `[hash]`-part of filenames in cases where you need static resource-names.

The `filename` is passed to webpack, so any "variable" (e.g `[name]`, `[hash]` etc) can be used.
In order to control how css-files are split/chunked you must use this plugin together with `ChangeJsFilename`, 
which changes the chunk-strategy.

**Options:**

|Option|Default|Description|
|------|-------|-----------|
|filename|`static/css/[name].css`|Changes how the default css file is named|
|chunkFilename|`static/css/[name].chunk.css`|Changes how the css chunk files are named|

**Example:**
```
{
    plugin: ChangeCssFilename,
    options: {
        filename: 'myapp.css',
        chunkFilename: 'myapp.[name].chunk.css'
    }
}
```



#### ChangeJsFilename
Allows you to change the filenames of js-files outputted by create-react-app, and control the chunk-strategy.
Most commonly used to remove the `[hash]`-part of filenames in cases where you need static resource-names.

The `filename` is passed to webpack, so any "variable" (e.g `[name]`, `[hash]` etc) can be used.

**Options:**

|Option|Default|Description|
|------|-------|-----------|
|filename|`static/js/[name].js`|Changes how the default js file is named|
|chunkFilename|`static/sj/[name].chunk.js`|Changes how the js chunk files are named|
|runtimeChunk|`false`|Controls whether or not it should create a runtime-chunk|
|splitChunk|`NO_CHUNKING`|Controls the chunking-strategy|

**Example:**
```
{
    plugin: ChangeJsFilename,
    options: {
        filename: 'myapp.js',
        chunkFilename: 'myapp.[name].chunk.js',
        runtimeChunk: true,
        splitChunk: 'VENDOR_CHUNKING'
    }
}
```

If `runtimeChunk` (default: `false`) is set to `true`, then webpack will split it runtime (e.g code used to load other chunks etc)
into its own chunk. 

`splitChunk` accepts the following options;
* `NO_CHUNKING`, which prevents all chunking except if your app uses manual codesplitting
* `VENDOR_CHUNKING`, splits code located in `node_modules` into their own chunk
* `DEFAULT_CHUNKING`, uses CRA default settings for chunking. Naming of chunks through other options will still affect filenames.

#### ConfigurableProxyTarget
Augments create-react-app to allow passing a `--proxy http://localhost/` argument when starting the application locally.
Create-react-app does by default read the `proxy`-key in the package.json, but in some cases it may be useful
to have multiple proxy-targets.

```
{
    plugin: ConfigurableProxyTarget
}
```

In package.json
```
"proxy": "http://localhost:8080/",
"scripts": {
    "startCustom": "craco start --proxy http://localhost:7070
}
```

## Inqueries
For inquries please create a GitHub-issue. For NAV internal inqueries please contact Team Personoversikt on slack at #personoversikt-intern
