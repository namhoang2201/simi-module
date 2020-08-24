import React, { Suspense } from 'react';
import { bool, number, object, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Checkout from '@magento/venia-ui/lib/components/Checkout';
import CheckoutButton from '@magento/venia-ui/lib/components/Checkout/checkoutButton';

import defaultClasses from '@magento/venia-ui/lib/components/MiniCart/footer.css';
import TotalsSummary from '@magento/venia-ui/lib/components/MiniCart/totalsSummary';

const Footer = props => {
    const {
        currencyCode,
        isMiniCartMaskOpen,
        numItems,
        setStep,
        step,
        subtotal
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const footerClassName = isMiniCartMaskOpen
        ? classes.root_open
        : classes.root;
    const placeholderButton = (
        <div className={classes.placeholderButton}>
            <CheckoutButton disabled={true} />
        </div>
    );

    return (
        <div className={footerClassName}>
            <TotalsSummary
                currencyCode={currencyCode}
                numItems={numItems}
                subtotal={subtotal}
            />
            <Suspense fallback={placeholderButton}>
                <Checkout setStep={setStep} step={step} currencyCode={currencyCode} />
            </Suspense>
        </div>
    );
};

Footer.propTypes = {
    cart: object,
    classes: shape({
        placeholderButton: string,
        root: string,
        root_open: string,
        summary: string
    }),
    currencyCode: string,
    isMiniCartMaskOpen: bool,
    numItems: number,
    subtotal: number
};

export default Footer;
