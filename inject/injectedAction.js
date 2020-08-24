import {checkPlugin} from '../util/checkedPlugin'

const injectedAction = ({module, func, otherProps }) => {
    const loadModule = checkPlugin(module);
    if(loadModule && loadModule[func]) {
        const loadedFunc = loadModule[func]
        
        return loadedFunc(otherProps)
    }

    return null
}

export default injectedAction;