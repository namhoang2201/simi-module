import modules from '../modules'
import SimiGiftcard from '@simicart/simi-giftcard'
import SimiRewardpoint from '@simicart/simi-rewardpoint'

export const GIFTCARD_MODULE = '@simicart/simi-giftcard'
export const REWARDPOINT_MODULE = '@simicart/simi-rewardpoint'

export const checkPlugin = (module) => {
    if(modules && modules.length && modules.includes(module)) {
        switch(module) {
            case GIFTCARD_MODULE: 
                return SimiGiftcard
            case REWARDPOINT_MODULE:
                return SimiRewardpoint
            default: 
                return null
        }
    }

    return null
}

export const checkModule = (module) => {
    if(modules.includes(module)) {
        return true
    }

    return false
}