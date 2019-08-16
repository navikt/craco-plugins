# craco-plugins

Collection of useful craco-plugins

[![CircleCI](https://circleci.com/gh/navikt/craco-plugins/tree/master.svg?style=svg)](https://circleci.com/gh/navikt/craco-plugins/tree/master)
[![npm version](https://badge.fury.io/js/%40navikt%2Fcraco-plugins.svg)](https://www.npmjs.com/package/@navikt/craco-plugins)

### Plugins

#### ChangeCssFilename
Allows you to change the filenames of css-files outputted by create-react-app.
Most commonly used to remove the `[hash]`-part of filenames in cases where you need static resource-names.

The `filename` is passed to webpack, so any "variable" (e.g `[name]`, `[hash]` etc) can be used.

```
{
    plugin: ChangeCssFilename,
    options: {
        filename: 'my-filename.css' // optional, default filename: static/css/[name].css
    }
}
```



#### ChangeJsFilename
Allows you to change the filenames of js-files outputted by create-react-app.
Most commonly used to remove the `[hash]`-part of filenames in cases where you need static resource-names.
In order for webpack to generate a single file the plugin also disables vendor-chunking.

The `filename` is passed to webpack, so any "variable" (e.g `[name]`, `[hash]` etc) can be used.

```
{
    plugin: ChangeJsFilename,
    options: {
        filename: 'my-filename.js' // optional, default filename: static/js/[name].js
    }
}
```

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
