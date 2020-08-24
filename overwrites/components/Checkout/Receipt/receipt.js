import React, { Fragment } from 'react';
import { func, shape, string } from 'prop-types';

import { useReceipt } from '@magento/peregrine/lib/talons/Checkout/Receipt/useReceipt';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from '@magento/venia-ui/lib/components/Checkout/Receipt/receipt.css';

// custom rewardpoint
import {
    REWARDPOINT_MODULE
} from '../../../../util/checkedPlugin';
import InjectedComponents from '@simicart/simi-module/inject/injectedComponent';
// end customize

/**
 * A component that displays some basic information about an order and has
 * a call to action for viewing order details and creating an account.
 */
const Receipt = props => {
    const { onClose } = props;
    const talonProps = useReceipt({
        onClose
    });

    const {
        handleCreateAccount,
        handleViewOrderDetails,
        isSignedIn
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const content = isSignedIn ? (
        <Fragment>
            <div className={classes.textBlock}>
                You can also visit your account page for more information.
            </div>
            <Button onClick={handleViewOrderDetails}>View Order Details</Button>
        </Fragment>
    ) : (
        <Fragment>
            <hr />
            <div className={classes.textBlock}>
                Track order status and earn rewards for your purchase by
                creating an account.
            </div>
            <Button priority="high" onClick={handleCreateAccount}>
                Create an Account
            </Button>
        </Fragment>
    );

    return (
        <div className={classes.root}>
            <div className={classes.body}>
                {isSignedIn && (
                    <InjectedComponents
                        module={REWARDPOINT_MODULE}
                        func={'RefreshPointCheckoutPage'}
                        parentProps={{}}
                    />
                )}
                <h2 className={classes.header}>Thank you for your purchase!</h2>
                <div className={classes.textBlock}>
                    You will receive an order confirmation email with order
                    status and other details.
                </div>
                {content}
            </div>
        </div>
    );
};

Receipt.propTypes = {
    classes: shape({
        body: string,
        footer: string,
        root: string
    }),
    drawer: string,
    onClose: func.isRequired,
    order: shape({
        id: string
    }).isRequired
};

Receipt.defaultProps = {
    order: {}
};

export default Receipt;
