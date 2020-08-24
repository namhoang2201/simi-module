import React from 'react';
import { func } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import CouponCode from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode';
import GiftCardSection from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/giftCardSection';
import GiftOptions from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions';
import ShippingMethods from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods';
import defaultClasses from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/priceAdjustments.css';

// begin custom
import InjectComponents from '../../../../inject/injectedComponent';
import {
    GIFTCARD_MODULE,
    REWARDPOINT_MODULE,
    checkPlugin
} from '../../../../util/checkedPlugin';
// end custom

const PriceAdjustments = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { setIsCartUpdating, updateTotal } = props;

    const existModuleRewardPoint = checkPlugin(REWARDPOINT_MODULE);

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section
                    id={'shipping_method'}
                    title={'Estimate your Shipping'}
                >
                    <ShippingMethods setIsCartUpdating={setIsCartUpdating} />
                </Section>
                <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                    <CouponCode setIsCartUpdating={setIsCartUpdating} />
                </Section>
                <GiftCardSection setIsCartUpdating={setIsCartUpdating} />
                <Section id={'gift_options'} title={'See Gift Options'}>
                    <GiftOptions />
                </Section>
                <InjectComponents
                    module={GIFTCARD_MODULE}
                    func={'GiftCardOptionsCoupon'}
                />
                {existModuleRewardPoint &&
                    existModuleRewardPoint.FormRewardPoint &&
                    props.isSignedIn && (
                        <Section id={'rewardpoint'} title={'Apply Reward'}>
                            <InjectComponents
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
    setIsCartUpdating: func
};
