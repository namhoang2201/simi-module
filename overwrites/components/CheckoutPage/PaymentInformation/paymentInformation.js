import React from 'react';
import { shape, func, string, bool, instanceOf } from 'prop-types';

import { usePaymentInformation } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformation';
import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';

import PaymentMethods from './paymentMethods';
import Summary from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/summary';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import EditModal from './editModal';

import paymentInformationOperations from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentInformation.gql';

import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentInformation.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const PaymentInformation = props => {
    const {
        classes: propClasses,
        onSave,
        resetShouldSubmit,
        setCheckoutStep,
        shouldSubmit,
        checkoutError,
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = usePaymentInformation({
        onSave,
        checkoutError,
        resetShouldSubmit,
        setCheckoutStep,
        shouldSubmit,
        ...paymentInformationOperations
    });

    const {
        doneEditing,
        handlePaymentError,
        handlePaymentSuccess,
        hideEditModal,
        isEditModalActive,
        isLoading,
        showEditModal
    } = talonProps;

    if (isLoading) {
        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                Fetching Payment Information
            </LoadingIndicator>
        );
    }

    const paymentInformation = doneEditing ? (
        <Summary onEdit={showEditModal} />
    ) : (
        <PaymentMethods
            onPaymentError={handlePaymentError}
            onPaymentSuccess={handlePaymentSuccess}
            resetShouldSubmit={resetShouldSubmit}
            shouldSubmit={shouldSubmit}
        />
    );

    const editModal = isEditModalActive ? (
        <EditModal onClose={hideEditModal} />
    ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.payment_info_container}>
                {paymentInformation}
            </div>
            {editModal}
        </div>
    );
};

export default PaymentInformation;

PaymentInformation.propTypes = {
    classes: shape({
        container: string,
        payment_info_container: string,
        review_order_button: string
    }),
    onSave: func.isRequired,
    checkoutError: instanceOf(CheckoutError),
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool
};
