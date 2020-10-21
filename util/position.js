import React from 'react'

import SimiGiftcard from '@simicart/simi-giftcard'
import SimiRewardpoint from '@simicart/simi-rewardpoint'
import SimiStorecredit from '@simicart/simi-storecredit'

const modules = [
    SimiGiftcard,
    SimiRewardpoint,
    SimiStorecredit
]

export const positionComponent = (name, position, props) => {
    const components = []
    modules.forEach((module) => {
        const moduleProps = module.useComponents && module.useComponents(props)
        if(moduleProps && moduleProps[name] && moduleProps[name][position]) {
            const injectComponents = moduleProps[name][position];
            if(injectComponents && injectComponents.length && injectComponents.length) {
                injectComponents.forEach((Component, index) => {
                    components.push(<Component {...props} key={index}/>)
                })
            }
        }
    })


    return components
}