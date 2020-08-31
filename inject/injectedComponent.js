import React from 'react';
import {object, string} from 'prop-types';
import {checkPlugin} from '../util/checkedPlugin'
    
const InjectedComponents = ({ module, func, parentProps }) => {
    const loadModule = checkPlugin(module);

    if(loadModule && loadModule[func]) {
        const talonProps = loadModule.useStoreview && loadModule.useStoreview()

        const {data, load} = talonProps
        const LoadedComponent = loadModule[func]

        if(load) {
            return (
                <LoadingIndicator />
            );
        }

        if(data && !data.active) {
            return null
        }
        
        return <LoadedComponent {...parentProps} storeConfig={data}/>
    }

    return null;
} 

InjectedComponents.propTypes = {
    module: string,
    func: string,
    props: object
};

export default InjectedComponents