const fs = require('fs')
const path = require('path');

const DEFAULT_MODULE = '@simicart/simi-module/defaultModule.js'

module.exports = class CheckModuleExitPlugin {
    constructor(allModule) {
        this.name = 'CheckModuleExitPlugin';
        this.allModule = allModule;
    }

    checkModuleExit(resolve) {
        if(!resolve.request) return;
        const position = __dirname.indexOf('@simicart/simi-module')
        const rootPath = __dirname.substring(0, position)
        const pathName = path.join(rootPath, resolve.request);
        try {
            if (fs.existsSync(pathName)) {
                return true
            } 

            return false
          } catch(err) {
            console.error(err)
          }
    }

    apply(compiler) {
        compiler.hooks.normalModuleFactory.tap(this.name, (nmf) => {
            nmf.hooks.beforeResolve.tap(this.name, (resolve) => {
                if (!resolve) {
                    return;
                }

                if(this.allModule.includes(resolve.request)) {
                    if(!this.checkModuleExit(resolve)) {
                        resolve.request = DEFAULT_MODULE
                    }
                }
        
                return resolve;
            });
        });

        return compiler
    }
}