import React, { Fragment } from 'react';
import { bool, func, number, object, shape, string, array } from 'prop-types';

import PaymentMethodSummary from '@magento/venia-ui/lib/components/Checkout/paymentMethodSummary';
import ShippingAddressSummary from '@magento/venia-ui/lib/components/Checkout//shippingAddressSummary';
import ShippingMethodSummary from '@magento/venia-ui/lib/components/Checkout//shippingMethodSummary';
import Section from '@magento/venia-ui/lib/components/Checkout/section';
import Button from '@magento/venia-ui/lib/components/Button';
import { Price } from '@magento/peregrine';
import { useOverview } from '@magento/peregrine/lib/talons/Checkout/useOverview';
// custom rewardpoint
import { REWARDPOINT_MODULE, checkPlugin } from '../../../util/checkedPlugin';
import InjectedComponents from '@simicart/simi-module/inject/injectedComponent';
import injectedAction from '../../../inject/injectedAction';
import { getDataFromStoreage } from '../../../util/storeData';
// end custom rewardpoint

/**
 * The Overview component renders summaries for each section of the editable
 * form.
 */
const Overview = props => {
    const {
        cancelCheckout,
        cart,
        classes,
        hasPaymentMethod,
        hasShippingAddress,
        hasShippingMethod,
        isSubmitting,
        paymentData,
        ready,
        setEditing,
        submitOrder
    } = props;

    const {
        currencyCode,
        handleAddressFormClick,
        handleCancel,
        handlePaymentFormClick,
        handleShippingFormClick,
        handleSubmit,
        isSubmitDisabled,
        numItems,
        subtotal
    } = useOverview({
        cancelCheckout,
        cart,
        isSubmitting,
        ready,
        setEditing,
        submitOrder
    });

    // custom simi-rewardpoint
    const existModuleRewardPoint = checkPlugin(REWARDPOINT_MODULE);
    const storeConfig = getDataFromStoreage('SESSION_STOREAGE', 'STORE_CONFIG');
    let activeBssRewardPointModule = true;
    if (
        storeConfig &&
        storeConfig.hasOwnProperty('bssRewardPointStoreConfig') &&
        storeConfig.bssRewardPointStoreConfig.active === 0
    ) {
        activeBssRewardPointModule = false;
    }
    // end custom simi-rewardpoint

    return (
        <Fragment>
            <div className={classes.body}>
                <Section
                    label="Ship To"
                    onClick={handleAddressFormClick}
                    showEditIcon={hasShippingAddress}
                >
                    <ShippingAddressSummary classes={classes} />
                </Section>
                <Section
                    label="Pay With"
                    onClick={handlePaymentFormClick}
                    showEditIcon={hasPaymentMethod}
                >
                    <PaymentMethodSummary
                        classes={classes}
                        hasPaymentMethod={hasPaymentMethod}
                        paymentData={paymentData}
                    />
                </Section>
                <Section
                    label="Use"
                    disabled={!hasShippingAddress}
                    onClick={handleShippingFormClick}
                    showEditIcon={hasShippingMethod}
                >
                    <ShippingMethodSummary classes={classes} />
                </Section>
                {existModuleRewardPoint &&
                    existModuleRewardPoint.OverviewRewardPoint &&
                    activeBssRewardPointModule &&
                    props.isSignedIn && (
                        <Section
                            label="Reward Point"
                            onClick={() => setEditing('rewardpoint')}
                            showEditIcon={true}
                        >
                            <InjectedComponents
                                module={REWARDPOINT_MODULE}
                                func={'OverviewRewardPoint'}
                                parentProps={{}}
                            />
                        </Section>
                    )}
                <Section label="TOTAL">
                    <Price currencyCode={currencyCode} value={subtotal} />
                    <br />
                    <span>{numItems} Items</span>
                </Section>
            </div>
            <div className={classes.footer}>
                <Button onClick={handleCancel}>Back to Cart</Button>
                <Button
                    priority="high"
                    disabled={isSubmitDisabled}
                    onClick={handleSubmit}
                >
                    Confirm Order
                </Button>
            </div>
        </Fragment>
    );
};

Overview.propTypes = {
    cancelCheckout: func.isRequired,
    cart: shape({
        details: shape({
            items: array,
            prices: shape({
                grand_total: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            })
        }).isRequired
    }).isRequired,
    classes: shape({
        body: string,
        footer: string
    }),
    hasPaymentMethod: bool,
    hasShippingAddress: bool,
    hasShippingMethod: bool,
    isSubmitting: bool,
    paymentData: object,
    ready: bool,
    setEditing: func,
    submitOrder: func,
    submitting: bool
};

export default Overview;
