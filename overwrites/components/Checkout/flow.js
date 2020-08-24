import React, { useCallback } from 'react';
import { func, shape, string } from 'prop-types';
import { AlertCircle as AlertCircleIcon } from 'react-feather';

import { useToasts } from '@magento/peregrine';
import { useFlow } from '@magento/peregrine/lib/talons/Checkout/useFlow';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import isObjectEmpty from '@magento/venia-ui/lib/util/isObjectEmpty';
import Icon from '@magento/venia-ui/lib/components/Icon';
import CheckoutButton from '@magento/venia-ui/lib/components/Checkout/checkoutButton';
import Form from './form';
import Receipt from './Receipt';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';

import defaultClasses from '@magento/venia-ui/lib/components/Checkout/flow.css';

// simi customize
import { useUserContext } from '@magento/peregrine/lib/context/user';
import injectedAction from '../../../inject/injectedAction' 
import {GIFTCARD_MODULE} from '../../../util/checkedPlugin'
// end customize

const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

/**
 * This Flow component's primary purpose is to take relevant state and actions
 * and pass them to the current checkout step.
 */
const Flow = props => {
    // nam customize
    const [{ isSignedIn }] = useUserContext();
    // end customize
    const { setStep, step } = props;
    const [, { addToast }] = useToasts();
    const onSubmitError = useCallback(() => {
        addToast({
            type: 'error',
            icon: ErrorIcon,
            message:
                'Something went wrong submitting your order! Try again later.',
            timeout: 7000
        });
    }, [addToast]);

    const talonProps = useFlow({
        createCartMutation: CREATE_CART_MUTATION,
        onSubmitError,
        setStep: props.setStep
    });

    const {
        cartState,
        checkoutDisabled,
        checkoutState,
        isReady,
        submitPaymentMethodAndBillingAddress,
        submitShippingMethod,
        handleBeginCheckout,
        handleCancelCheckout,
        handleCloseReceipt,
        handleSubmitOrder
    } = talonProps;

    const {
        availableShippingMethods,
        billingAddress,
        isSubmitting,
        paymentData,
        shippingAddress,
        shippingAddressError,
        shippingMethod
    } = checkoutState;

    const classes = mergeClasses(defaultClasses, props.classes);

    // simi customize
    const giftCardCheckoutProps = injectedAction({
        module: GIFTCARD_MODULE,
        func: 'useGiftCardCheckOut',
    }) || {}

    const {
        handleRedirectCheckout,
        checkGiftCartVitrualType
    } = giftCardCheckoutProps

    const isGiftCardVitrualProduct = checkGiftCartVitrualType && checkGiftCartVitrualType()
    const customClick = isGiftCardVitrualProduct ? handleRedirectCheckout : handleBeginCheckout
    // end customize

    let child;
    switch (step) {
        case 'cart': {
            child = (
                <div className={classes.footer}>
                    <CheckoutButton
                        disabled={checkoutDisabled}
                        onClick={customClick}
                    />
                </div>
            );
            break;
        }
        case 'form': {
            const stepProps = {
                availableShippingMethods,
                billingAddress,
                cancelCheckout: handleCancelCheckout,
                cart: cartState,
                checkout: checkoutState,
                hasPaymentMethod: !!paymentData && !isObjectEmpty(paymentData),
                hasShippingAddress:
                    !!shippingAddress && !isObjectEmpty(shippingAddress),
                hasShippingMethod:
                    !!shippingMethod && !isObjectEmpty(shippingMethod),
                isSubmitting,
                paymentData,
                ready: isReady,
                setStep,
                shippingAddressError,
                shippingMethod,
                submitOrder: handleSubmitOrder,
                submitPaymentMethodAndBillingAddress,
                submitShippingMethod,
                isSignedIn
            };

            child = <Form {...stepProps} />;
            break;
        }
        case 'receipt': {
            child = <Receipt onClose={handleCloseReceipt} />;
            break;
        }
        default: {
            child = null;
        }
    }

    return <div className={classes.root}>{child}</div>;
};

Flow.propTypes = {
    classes: shape({
        root: string
    }),
    setStep: func,
    step: string
};

export default Flow;
