import React from 'react';
import { Archive as HistoryIcon, LogOut as SignOutIcon } from 'react-feather';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import AccountLink from './accountLink';
import defaultClasses from './myAccount.css';
import { useMyAccount } from '@magento/peregrine/lib/talons/MyAccount/useMyAccount';
import { useNavigationHeader } from '@magento/peregrine/lib/talons/Navigation/useNavigationHeader';
require('./index.scss');
// customize
import {
    REWARDPOINT_MODULE,
    checkPlugin
} from '@simicart/simi-module/util/checkedPlugin';
import InjectedComponents from '@simicart/simi-module/inject/injectedComponent';
// end customize

const PURCHASE_HISTORY = 'Purchase History';
const SIGN_OUT = 'Sign Out';
const REWARD_POINT = 'Reward Points';

const MyAccount = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useMyAccount({
        onSignOut: props.onSignOut
    });

    const { handleSignOut, subtitle, title } = talonProps;

    const { onClose } = props;

    const myTalonProps = useNavigationHeader({
        onClose
    });

    const { handleClose } = myTalonProps;

    // customize
    const existModuleRewardPoint = checkPlugin(REWARDPOINT_MODULE);
    // end customize

    return (
        <div className={classes.root}>
            <div className={classes.user}>
                <h2 className={classes.title}>{title}</h2>
                <span className={classes.subtitle}>{subtitle}</span>
            </div>
            <div className={classes.actions}>
                <AccountLink>
                    <HistoryIcon size={18} />
                    {PURCHASE_HISTORY}
                </AccountLink>
                {existModuleRewardPoint && existModuleRewardPoint.PointHeader && (
                    <AccountLink
                        onClick={handleClose}
                        link={'/rewardpoint'}
                        pointComponent={
                            <InjectedComponents
                                module={REWARDPOINT_MODULE}
                                func={'PointHeader'}
                                parentProps={{
                                    classes: classes,
                                    leftMenu: true
                                }}
                            />
                        }
                    >
                        <span className="bss-icon" />
                        {REWARD_POINT}
                    </AccountLink>
                )}
                <AccountLink onClick={handleSignOut}>
                    <SignOutIcon size={18} />
                    {SIGN_OUT}
                </AccountLink>
            </div>
        </div>
    );
};

export default MyAccount;

MyAccount.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    }),
    onSignOut: func.isRequired
};
