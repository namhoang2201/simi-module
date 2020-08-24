import React from 'react';
import { func } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import CouponCode from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode';
import GiftCardSection from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/giftCardSection';
import GiftOptions from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions';

import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/PriceAdjustments/priceAdjustments.css';

// customize
import InjectedComponents from '../../../../inject/injectedComponent';
import {
    GIFTCARD_MODULE,
    REWARDPOINT_MODULE
} from '../../../../util/checkedPlugin';
// end customize

/**
 * PriceAdjustments component for the Checkout page.

 * @param {Function} props.setPageIsUpdating callback that sets checkout page updating state
 */
const PriceAdjustments = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { setPageIsUpdating, updateTotal } = props;

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                    <CouponCode setIsCartUpdating={setPageIsUpdating} />
                </Section>
                <GiftCardSection setIsCartUpdating={setPageIsUpdating} />
                <Section id={'gift_options'} title={'See Gift Options'}>
                    <GiftOptions />
                </Section>
                <InjectedComponents
                    module={GIFTCARD_MODULE}
                    func={'GiftCardOptionsCoupon'}
                />
                {props.isSignedIn && (
                    <Section id={'rewardpoint'} title={'Apply Reward'}>
                        <InjectedComponents
                            module={REWARDPOINT_MODULE}
                            func={'FormRewardPoint'}
                            parentProps={{
                                onCancel: null,
                                isMiniCart: false,
                                classes: classes,
                                updateTotal: updateTotal
                            }}
                        />
                    </Section>
                )}
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    setPageIsUpdating: func
};
