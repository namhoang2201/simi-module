import React, { useEffect } from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';

import { useWindowSize, useToasts } from '@magento/peregrine';
import {
    CHECKOUT_STEP,
    useCheckoutPage
} from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';

import { Title } from '@magento/venia-ui/lib/components/Head';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import AddressBook from '@magento/venia-ui/lib/components/CheckoutPage/AddressBook';
import OrderSummary from './OrderSummary';
import PaymentInformation from './PaymentInformation';
import PriceAdjustments from './PriceAdjustments';
import ShippingMethod from '@magento/venia-ui/lib/components/CheckoutPage/ShippingMethod';
import ShippingInformation from '@magento/venia-ui/lib/components/CheckoutPage/ShippingInformation';
import OrderConfirmationPage from './OrderConfirmationPage';
import ItemsReview from '@magento/venia-ui/lib/components/CheckoutPage/ItemsReview';

import CheckoutPageOperations from '@magento/venia-ui/lib/components/CheckoutPage/checkoutPage.gql.js';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/checkoutPage.css';

// customize
import { useRestCart } from '../../talons/CartPage/useRestCart';
import injectedAction from '../../../inject/injectedAction' 
import InjectedComponent from '../../../inject/injectedComponent'
import {GIFTCARD_MODULE} from '../../../util/checkedPlugin'
// end customize

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

const CheckoutPage = props => {
    const { classes: propClasses } = props;
    const talonProps = useCheckoutPage({
        ...CheckoutPageOperations
    });

    const {
        /**
         * Enum, one of:
         * SHIPPING_ADDRESS, SHIPPING_METHOD, PAYMENT, REVIEW
         */
        activeContent,
        checkoutStep,
        customer,
        error,
        handleSignIn,
        handlePlaceOrder,
        hasError,
        isCartEmpty,
        isGuestCheckout,
        isLoading,
        isUpdating,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber,
        placeOrderLoading,
        setCheckoutStep,
        setIsUpdating,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        toggleActiveContent
    } = talonProps;

    // giftcard customize
    const giftCardCheckoutProps = injectedAction({
        module: GIFTCARD_MODULE,
        func: 'useGiftCardCheckOut',
    }) || {}

    const {
        checkGiftCartVitrualType
    } = giftCardCheckoutProps

    const isGiftCardVitrual = checkGiftCartVitrualType && checkGiftCartVitrualType()
    // end customize

    const [, { addToast }] = useToasts();

    // reward customize
    const restTalons = useRestCart();
    const {
        cartData,
        getCartDetailCustom
    } = restTalons;
    
    const updateTotal = () => {
        getCartDetailCustom()
    }
    // end customize

    useEffect(() => {
        if (hasError) {
            const message =
                error && error.message
                    ? error.message
                    : 'Oops! An error occurred while submitting. Please try again.';

            addToast({
                type: 'error',
                icon: errorIcon,
                message,
                dismissable: true,
                timeout: 7000
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    }, [addToast, error, hasError]);

    // giftcard customize
    useEffect(() => {
        if(!isGuestCheckout && isGiftCardVitrual) {
            setCheckoutStep(CHECKOUT_STEP.PAYMENT)
        }
    }, [isGuestCheckout, isGiftCardVitrual])
    // end customize

    const classes = mergeClasses(defaultClasses, propClasses);

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 960;

    let checkoutContent;

    if (orderNumber) {
        return (
            <OrderConfirmationPage
                data={orderDetailsData}
                orderNumber={orderNumber}
            />
        );
    } else if (isLoading) {
        return fullPageLoadingIndicator;
    } else if (isCartEmpty) {
        checkoutContent = (
            <div className={classes.empty_cart_container}>
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>
                        {isGuestCheckout ? 'Guest Checkout' : 'Checkout'}
                    </h1>
                </div>
                <h3>{'There are no items in your cart.'}</h3>
            </div>
        );
    } else {
        const loginButton = isGuestCheckout ? (
            <div className={classes.signin_container}>
                <Button
                    className={classes.sign_in}
                    onClick={handleSignIn}
                    priority="high"
                >
                    {'Login and Checkout Faster'}
                </Button>
            </div>
        ) : null;

        // giftcard customize
        let shippingMethodSection = null;
        if(!isGiftCardVitrual) {
            shippingMethodSection =
                checkoutStep >= CHECKOUT_STEP.SHIPPING_METHOD ? (
                    <ShippingMethod
                        pageIsUpdating={isUpdating}
                        onSave={setShippingMethodDone}
                        setPageIsUpdating={setIsUpdating}
                    />
                ) : (
                    <h3 className={classes.shipping_method_heading}>
                        {'2. Shipping Method'}
                    </h3>
                );
        }
        // end customize

        const paymentInformationSection =
            checkoutStep >= CHECKOUT_STEP.PAYMENT ? (
                <PaymentInformation
                    onSave={setPaymentInformationDone}
                    checkoutError={error}
                    resetShouldSubmit={resetReviewOrderButtonClicked}
                    setCheckoutStep={setCheckoutStep}
                    shouldSubmit={reviewOrderButtonClicked}
                />
            ) : (
                <h3 className={classes.payment_information_heading}>
                    {'3. Payment Information'}
                </h3>
            );

        const priceAdjustmentsSection =
            checkoutStep === CHECKOUT_STEP.PAYMENT ? (
                <div className={classes.price_adjustments_container}>
                    <PriceAdjustments setPageIsUpdating={setIsUpdating} isSignedIn={!isGuestCheckout} updateTotal={updateTotal} />
                </div>
            ) : null;

        const reviewOrderButton =
            checkoutStep === CHECKOUT_STEP.PAYMENT ? (
                <Button
                    onClick={handleReviewOrder}
                    priority="high"
                    className={classes.review_order_button}
                    disabled={reviewOrderButtonClicked || isUpdating}
                >
                    {'Review Order'}
                </Button>
            ) : null;

        const itemsReview =
            checkoutStep === CHECKOUT_STEP.REVIEW ? (
                <div className={classes.items_review_container}>
                    <ItemsReview />
                </div>
            ) : null;

        const placeOrderButton =
            checkoutStep === CHECKOUT_STEP.REVIEW ? (
                <Button
                    onClick={handlePlaceOrder}
                    priority="high"
                    className={classes.place_order_button}
                    disabled={
                        isUpdating || placeOrderLoading || orderDetailsLoading
                    }
                >
                    {'Place Order'}
                </Button>
            ) : null;
        // giftcard customize
        const shippingInformation = 
            !isGiftCardVitrual ? (
                <div className={classes.shipping_information_container}>
                    <ShippingInformation
                        onSave={setShippingInformationDone}
                        toggleActiveContent={toggleActiveContent}
                    />
                </div>
            ) : (
                isGuestCheckout ? <div className={classes.shipping_information_container}>
                    <InjectedComponent 
                        module={GIFTCARD_MODULE} 
                        func="ShippingInfoGiftCardVitrual"
                        parentProps={{
                            setCheckoutStep,
                            checkOutStep: CHECKOUT_STEP
                        }}
                    />
                </div> : null
            )
        // end customize
        
        // If we're on mobile we should only render price summary in/after review.
        const shouldRenderPriceSummary = !(
            isMobile && checkoutStep < CHECKOUT_STEP.REVIEW
        );

        const orderSummary = shouldRenderPriceSummary ? (
            <div className={classes.summaryContainer}>
                <OrderSummary isUpdating={isUpdating} cartData={cartData} />
            </div>
        ) : null;

        const guestCheckoutHeaderText = isGuestCheckout
            ? 'Guest Checkout'
            : customer.default_shipping
            ? 'Review and Place Order'
            : `Welcome ${customer.firstname}!`;

        const checkoutContentClass =
            activeContent === 'checkout'
                ? classes.checkoutContent
                : classes.checkoutContent_hidden;

        checkoutContent = (
            <div className={checkoutContentClass}>
                {loginButton}
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>
                        {guestCheckoutHeaderText}
                    </h1>
                </div>
                {shippingInformation}
                <div className={classes.shipping_method_container}>
                    {shippingMethodSection}
                </div>
                <div className={classes.payment_information_container}>
                    {paymentInformationSection}
                </div>
                {priceAdjustmentsSection}
                {reviewOrderButton}
                {itemsReview}
                {orderSummary}
                {placeOrderButton}
            </div>
        );
    }

    const addressBookElement = !isGuestCheckout ? (
        <AddressBook
            activeContent={activeContent}
            toggleActiveContent={toggleActiveContent}
        />
    ) : null;

    return (
        <div className={classes.root}>
            <Title>{`Checkout - ${STORE_NAME}`}</Title>
            {checkoutContent}
            {addressBookElement}
        </div>
    );
};

export default CheckoutPage;
