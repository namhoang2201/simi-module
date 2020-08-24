import React from "react";
import { array, bool, func, object, oneOf, shape, string } from "prop-types";

import { useEditableForm } from "@magento/peregrine/lib/talons/Checkout/useEditableForm";

import AddressForm from "@magento/venia-ui/lib/components/Checkout/addressForm";
import PaymentsForm from "@magento/venia-ui/lib/components/Checkout/paymentsForm";
import ShippingForm from "@magento/venia-ui/lib/components/Checkout/shippingForm";
// custom rewardpoint
import { REWARDPOINT_MODULE, checkModule } from "../../../util/checkedPlugin";
import InjectedComponents from "@simicart/simi-module/inject/injectedComponent";
import injectedAction from "../../../inject/injectedAction";
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './editableForm.css';
// end custom rewardpoint

/**
 * The EditableForm component renders the actual edit forms for the sections
 * within the form.
 */
const EditableForm = (props) => {
  const {
    countries,
    editing,
    isSubmitting,
    setEditing,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod,
  } = props;

  const {
    handleCancel,
    handleSubmitAddressForm,
    handleSubmitPaymentsForm,
    handleSubmitShippingForm,
  } = useEditableForm({
    countries,
    setEditing,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod,
  });

  const classes = mergeClasses(defaultClasses, props.classes)

  switch (editing) {
    case "address": {
      return (
        <AddressForm
          onCancel={handleCancel}
          countries={countries}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitAddressForm}
        />
      );
    }
    case "paymentMethod": {
      const { billingAddress } = props;

      return (
        <PaymentsForm
          onCancel={handleCancel}
          countries={countries}
          initialValues={billingAddress}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitPaymentsForm}
        />
      );
    }
    case "shippingMethod": {
      const { availableShippingMethods, shippingMethod } = props;
      return (
        <ShippingForm
          availableShippingMethods={availableShippingMethods}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          shippingMethod={shippingMethod}
          onSubmit={handleSubmitShippingForm}
        />
      );
    }
    case "rewardpoint": {
      return (
        props.isSignedIn && (
          <InjectedComponents
            module={REWARDPOINT_MODULE}
            func={"FormRewardPoint"}
            parentProps={{
              onCancel: handleCancel,
              isMiniCart: true,
              classes: classes
            }}
          />
        )
      );
    }
    default: {
      return null;
    }
  }
};

EditableForm.propTypes = {
  availableShippingMethods: array,
  editing: oneOf(["address", "paymentMethod", "shippingMethod", "rewardpoint"]),
  isSubmitting: bool,
  setEditing: func.isRequired,
  shippingAddress: object,
  shippingMethod: string,
  submitShippingMethod: func.isRequired,
  submitPaymentMethodAndBillingAddress: func.isRequired,
  checkout: shape({
    countries: array,
  }).isRequired,
};

export default EditableForm;
