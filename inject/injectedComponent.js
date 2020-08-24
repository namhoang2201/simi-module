import React from 'react';
import {object, string} from 'prop-types';
import {checkPlugin} from '../util/checkedPlugin'
    
const InjectedComponents = ({ module, func, parentProps }) => {
    const loadModule = checkPlugin(module);
    if(loadModule && loadModule[func]) {
        const LoadedComponent = loadModule[func]
        
        
        return <LoadedComponent {...parentProps} />
    }

    return null;
} 

InjectedComponents.propTypes = {
    module: string,
    func: string,
    props: object
};

export default InjectedComponents