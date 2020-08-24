import React from 'react';
import PriceSummary from '../../CartPage/PriceSummary';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/OrderSummary/orderSummary.css';

const OrderSummary = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={classes.root}>
            <h1 className={classes.title}>{'Order Summary'}</h1>
            <PriceSummary isUpdating={props.isUpdating} cartData={props.cartData} />
        </div>
    );
};

export default OrderSummary;