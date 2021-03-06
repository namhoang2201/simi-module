import React, { useEffect } from 'react';
import { object, shape, string } from 'prop-types';
import { useOrderConfirmationPage } from '../../../talons/CheckoutPage/OrderConfirmationPage/useOrderConfirmationPage';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Title } from '@magento/venia-ui/lib/components/Head';
import CreateAccount from '@magento/venia-ui/lib/components/CheckoutPage/OrderConfirmationPage/createAccount';
import ItemsReview from '@magento/venia-ui/lib/components/CheckoutPage/ItemsReview';
import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/OrderConfirmationPage/orderConfirmationPage.css';
// custom rewardpoint
import { REWARDPOINT_MODULE } from '../../../../util/checkedPlugin';
import InjectedComponents from '@simicart/simi-module/inject/injectedComponent';
// end customize
const OrderConfirmationPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { data, orderNumber } = props;

    const talonProps = useOrderConfirmationPage({
        data
    });

    const { flatData, isSignedIn } = talonProps;

    const {
        city,
        country,
        email,
        firstname,
        lastname,
        postcode,
        region,
        shippingMethod,
        street
    } = flatData;

    const streetRows = street.map((row, index) => {
        return (
            <span key={index} className={classes.addressStreet}>
                {row}
            </span>
        );
    });

    useEffect(() => {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const createAccountForm = !isSignedIn ? (
        <CreateAccount
            firstname={firstname}
            lastname={lastname}
            email={email}
        />
    ) : null;

    return (
        <div className={classes.root}>
            <Title>{`Receipt - ${STORE_NAME}`}</Title>
            {isSignedIn && (
                <InjectedComponents
                    module={REWARDPOINT_MODULE}
                    func={'RefreshPointCheckoutPage'}
                    parentProps={{}}
                />
            )}
            <div className={classes.mainContainer}>
                <h2 className={classes.heading}>
                    {'Thank you for your order!'}
                </h2>
                <div
                    className={classes.orderNumber}
                >{`Order Number: ${orderNumber}`}</div>
                <div className={classes.shippingInfoHeading}>
                    Shipping Information
                </div>
                <div className={classes.shippingInfo}>
                    <span className={classes.email}>{email}</span>
                    <span
                        className={classes.name}
                    >{`${firstname} ${lastname}`}</span>
                    {streetRows}
                    <span
                        className={classes.addressAdditional}
                    >{`${city}, ${region} ${postcode} ${country}`}</span>
                </div>
                <div className={classes.shippingMethodHeading}>
                    Shipping Method
                </div>
                <div className={classes.shippingMethod}>{shippingMethod}</div>
                <div className={classes.itemsReview}>
                    <ItemsReview data={data} />
                </div>
                <div className={classes.additionalText}>
                    {
                        'You will also receive an email with the details and we will let you know when your order has shipped.'
                    }
                </div>
            </div>
            <div className={classes.sidebarContainer}>{createAccountForm}</div>
        </div>
    );
};

export default OrderConfirmationPage;

OrderConfirmationPage.propTypes = {
    classes: shape({
        addressStreet: string,
        mainContainer: string,
        heading: string,
        orderNumber: string,
        shippingInfoHeading: string,
        shippingInfo: string,
        email: string,
        name: string,
        addressAdditional: string,
        shippingMethodHeading: string,
        shippingMethod: string,
        itemsReview: string,
        additionalText: string,
        sidebarContainer: string
    }),
    data: object.isRequired,
    orderNumber: string
};
