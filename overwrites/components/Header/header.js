import React, { Suspense } from 'react';
import { shape, string } from 'prop-types';

import Logo from '@magento/venia-ui/lib/components/Logo';
import { Link, resourceUrl, Route } from '@magento/venia-drivers';

import CartTrigger from '@magento/venia-ui/lib/components/Header/cartTrigger';
import NavTrigger from '@magento/venia-ui/lib/components/Header/navTrigger';
import SearchTrigger from '@magento/venia-ui/lib/components/Header/searchTrigger';
import OnlineIndicator from '@magento/venia-ui/lib/components/Header/onlineIndicator';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './header.css';
import PageLoadingIndicator from '@magento/venia-ui/lib/components//PageLoadingIndicator';
import { ShoppingBag as ShoppingBagIcon } from 'react-feather';

const SearchBar = React.lazy(() =>
    import('@magento/venia-ui/lib/components/SearchBar')
);

// customize
import { REWARDPOINT_MODULE } from '../../../util/checkedPlugin';
import InjectedComponents from '@simicart/simi-module/inject/injectedComponent';
import { getDataFromStoreage } from '../../../util/storeData';
require('./header.scss');
// end customize

const Header = props => {
    const {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        searchOpen,
        isPageLoading
    } = useHeader();

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = searchOpen ? classes.open : classes.closed;
    const searchBarFallback = (
        <div className={classes.searchFallback}>
            <div className={classes.input}>
                <div className={classes.loader} />
            </div>
        </div>
    );
    const searchBar = searchOpen ? (
        <Suspense fallback={searchBarFallback}>
            <Route>
                <SearchBar isOpen={searchOpen} />
            </Route>
        </Suspense>
    ) : null;
    const pageLoadingIndicator = isPageLoading ? (
        <PageLoadingIndicator />
    ) : null;

    // customize
    const storeConfig = getDataFromStoreage('SESSION_STOREAGE', 'STORE_CONFIG');
    let sw_point_header = false;
    if (
        storeConfig &&
        storeConfig.hasOwnProperty('bssRewardPointStoreConfig') &&
        storeConfig.bssRewardPointStoreConfig.hasOwnProperty('sw_point_header')
    ) {
        sw_point_header =
            storeConfig.bssRewardPointStoreConfig.sw_point_header === '1'
                ? true
                : false;
    }
    // end customize

    return (
        <header className={rootClass}>
            <div className={classes.toolbar}>
                <div className={classes.primaryActions}>
                    <NavTrigger />
                    {pageLoadingIndicator}
                </div>
                <OnlineIndicator
                    hasBeenOffline={hasBeenOffline}
                    isOnline={isOnline}
                />
                {sw_point_header ? (
                    <InjectedComponents
                        module={REWARDPOINT_MODULE}
                        func={'PointHeader'}
                        parentProps={{
                            classes: classes
                        }}
                    />
                ) : (
                    <Link to={resourceUrl('/cart')}>
                        <ShoppingBagIcon size={18} />
                    </Link>
                )}

                <CartTrigger />
                <div className={classes.secondaryActions}>
                    <Link to={resourceUrl('/')}>
                        <Logo classes={{ logo: classes.logo }} />
                    </Link>
                    <SearchTrigger
                        active={searchOpen}
                        onClick={handleSearchTriggerClick}
                    />
                </div>
            </div>
            {searchBar}
        </header>
    );
};

Header.propTypes = {
    classes: shape({
        closed: string,
        logo: string,
        open: string,
        primaryActions: string,
        secondaryActions: string,
        toolbar: string
    })
};

export default Header;
