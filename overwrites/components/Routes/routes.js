import React, { Suspense } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator/index';
import HomePage from '@magento/venia-ui/lib/components/HomePage';
import CartPage from '../CartPage';
import CheckoutPage from '@magento/venia-ui/lib/components/CheckoutPage';
import MagentoRoute from '../MagentoRoute';
// rewardpoint customize
import InjectedComponents from '@simicart/simi-module/inject/injectedComponent';
import {
    REWARDPOINT_MODULE,
    GIFTCARD_MODULE,
    checkPlugin
} from '@simicart/simi-module/util/checkedPlugin';
// rewardpoint customize
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';

const Routes = () => {
    const { pathname } = useLocation();
    useScrollTopOnChange(pathname);
    const existModuleRewardPoint = checkPlugin(REWARDPOINT_MODULE);
    return (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Switch>
                <Route>
                    <Route exact path="/cart">
                        <CartPage />
                    </Route>
                    <Route exact path="/checkout">
                        <CheckoutPage />
                    </Route>
                    <Route exact path="/rewardpoint">
                        {existModuleRewardPoint &&
                        existModuleRewardPoint.MyRewardPoint ? (
                            <InjectedComponents
                                module={REWARDPOINT_MODULE}
                                func={'MyRewardPoint'}
                                parentProps={{}}
                            />
                        ) : (
                            <HomePage />
                        )}
                    </Route>
                    <Route exact path="/pointTransactions">
                        {existModuleRewardPoint &&
                        existModuleRewardPoint.AllPointTransactions ? (
                            <InjectedComponents
                                module={REWARDPOINT_MODULE}
                                func={'AllPointTransactions'}
                                parentProps={{}}
                            />
                        ) : (
                            <HomePage />
                        )}
                    </Route>
                    <Route exact path="/pointTransactionDetail/:transactionId">
                        {existModuleRewardPoint &&
                        existModuleRewardPoint.PointTransactionDetail ? (
                            <InjectedComponents
                                module={REWARDPOINT_MODULE}
                                func={'PointTransactionDetail'}
                                parentProps={{}}
                            />
                        ) : (
                            <HomePage />
                        )}
                    </Route>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <MagentoRoute />
                </Route>
            </Switch>
        </Suspense>
    );
};

export default Routes;
