import React from 'react';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import {
    INTERNAL_ERROR,
    NOT_FOUND,
    useMagentoRoute
} from '@magento/peregrine/lib/talons/MagentoRoute';
import {
    REWARDPOINT_MODULE,
    GIFTCARD_MODULE,
    checkPlugin
} from '@simicart/simi-module/util/checkedPlugin';

import InjectedComponents from '@simicart/simi-module/inject/injectedComponent';

import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

const MESSAGES = new Map()
    .set(NOT_FOUND, 'That page could not be found. Please try again.')
    .set(INTERNAL_ERROR, 'Something went wrong. Please try again.');

const MagentoRoute = () => {
    const talonProps = useMagentoRoute();
    const { component: RootComponent, id, isLoading, routeError } = talonProps;
    const path = window.location.pathname;
    const listCustomRoute = [
        '/cart', '/checkout', '/rewardpoint', '/pointTransactions', '/my-giftcard'
    ]

    if(path === '/my-giftcard') {
        const module = checkPlugin(GIFTCARD_MODULE) 
        if(module && module['MyGiftCard']) {
            return <InjectedComponents 
                module={GIFTCARD_MODULE}
                func="MyGiftCard"
            />
        } else {
            <ErrorView>
                <h1>{MESSAGES.get(routeError)}</h1>
            </ErrorView>
        }
    }
    if (listCustomRoute.includes(path) || path.includes('/pointTransactionDetail')) {
        return null;
    }
  
    if (isLoading) {
        return fullPageLoadingIndicator;
    } else if (RootComponent) {
        return <RootComponent id={id} />;
    } else if (routeError === NOT_FOUND) {
        return (
            <ErrorView>
                <h1>{MESSAGES.get(routeError)}</h1>
            </ErrorView>
        );
    }

    return (
        <ErrorView>
            <h1>{MESSAGES.get(INTERNAL_ERROR)}</h1>
        </ErrorView>
    );
};

export default MagentoRoute;
