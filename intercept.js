const moduleOverridePlugin = require('./moduleOverrideWebpackPlugin');
const checkModuleExitToResovle = require('./checkModuleExitToResovle');
const componentOverrideMapping = require('./componentOverrideMapping');
const allModule = require('./modules')

module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
         /**
          *  Wee need to actived esModules and cssModules to allow build pack to load our extension
          * {@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}.
          */
        flags[targets.name] = {esModules: true, cssModules: true, graphqlQueries: true};
    });
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        // registers our own overwrite plugin for webpack
        new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
        new checkModuleExitToResovle(allModule).apply(compiler);
    })
}