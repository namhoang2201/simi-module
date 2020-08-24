import React from "react";
import gql from "graphql-tag";
import { Price } from "@magento/peregrine";
import { usePriceSummary } from "../../../talons/CartPage/PriceSummary/usePriceSummary";
import Button from "@magento/venia-ui/lib/components/Button";
import { mergeClasses } from "@magento/venia-ui/lib/classify";
import defaultClasses from "./priceSummary.css";
import DiscountSummary from "@magento/venia-ui/lib/components/CartPage/PriceSummary/discountSummary";
import GiftCardSummary from "@magento/venia-ui/lib/components/CartPage/PriceSummary/giftCardSummary";
import ShippingSummary from "@magento/venia-ui/lib/components/CartPage/PriceSummary/shippingSummary";
import TaxSummary from "@magento/venia-ui/lib/components/CartPage/PriceSummary/taxSummary";
import { PriceSummaryFragment } from "@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummaryFragments";

// import custom
import InjectedComponent from '../../../../inject/injectedComponent'
import {GIFTCARD_MODULE} from '../../../../util/checkedPlugin'
// end import custom

const GET_PRICE_SUMMARY = gql`
  query getPriceSummary($cartId: String!) {
    cart(cart_id: $cartId) @connection(key: "Cart") {
      id
      ...PriceSummaryFragment
    }
  }
  ${PriceSummaryFragment}
`;

/**
 * A component that fetches and renders cart data including:
 *  - subtotal
 *  - discounts applied
 *  - gift cards applied
 *  - tax
 *  - shipping
 *  - total
 */
const PriceSummary = (props) => {
  const { isUpdating } = props;
  const classes = mergeClasses(defaultClasses, props.classes);
  const talonProps = usePriceSummary({
    queries: {
      getPriceSummary: GET_PRICE_SUMMARY,
    },
  });

  const {
    handleProceedToCheckout,
    hasError,
    hasItems,
    isCheckout,
    isLoading,
    flatData,
  } = talonProps;

  if (hasError) {
    return (
      <div className={classes.root}>
        Something went wrong. Please refresh and try again.
      </div>
    );
  } else if (!hasItems || isLoading) {
    return null;
  }

  const { subtotal, total, discounts, giftCards, taxes, shipping } = flatData;

  const priceClass = isUpdating ? classes.priceUpdating : classes.price;
  const totalPriceClass = isUpdating
    ? classes.priceUpdating
    : classes.totalPrice;

  const proceedToCheckoutButton = !isCheckout ? (
    <div className={classes.checkoutButton_container}>
      <Button
        disabled={isUpdating}
        priority={"high"}
        onClick={handleProceedToCheckout}
      >
        {"Proceed to Checkout"}
      </Button>
    </div>
  ) : null;

  // customize
  const { cartData } = props;
  let customGrandTotal = null;
  if (
    cartData &&
    cartData.hasOwnProperty("total_segments") &&
    Array.isArray(cartData.total_segments) &&
    cartData.total_segments.length
  ) {
    cartData.total_segments.forEach((item) => {
      if (item.code === "grand_total" && item.value) {
        customGrandTotal = item.value;
      }
    });
  }
  let discount = null;
  if (
    cartData &&
    cartData.hasOwnProperty("total_segments") &&
    Array.isArray(cartData.total_segments) &&
    cartData.total_segments.length
  ) {
    cartData.total_segments.forEach((item) => {
      if (item.code === "spend_point" && item.value) {
        discount = item.value;
      }
    });
  }
  let earnPoint = null;
  if (
    cartData &&
    cartData.hasOwnProperty("total_segments") &&
    Array.isArray(cartData.total_segments) &&
    cartData.total_segments.length
  ) {
    cartData.total_segments.forEach((item) => {
      if (item.code === "earn_point" && item.value) {
        earnPoint = item.value;
      }
    });
  }
  // end customize

  return (
    <div className={classes.root}>
      <div className={classes.lineItems}>
        <span className={classes.lineItemLabel}>{"Subtotal"}</span>
        <span className={priceClass}>
          <Price value={subtotal.value} currencyCode={subtotal.currency} />
        </span>
        <DiscountSummary
          classes={{
            lineItemLabel: classes.lineItemLabel,
            price: priceClass,
          }}
          data={discounts}
        />
        <GiftCardSummary
          classes={{
            lineItemLabel: classes.lineItemLabel,
            price: priceClass,
          }}
          data={giftCards}
        />
        <TaxSummary
          classes={{
            lineItemLabel: classes.lineItemLabel,
            price: priceClass,
          }}
          data={taxes}
          isCheckout={isCheckout}
        />
        <ShippingSummary
          classes={{
            lineItemLabel: classes.lineItemLabel,
            price: priceClass,
          }}
          data={shipping}
          isCheckout={isCheckout}
        />
        <InjectedComponent
          module={GIFTCARD_MODULE}
          func="GiftCardCouponDiscount"
          parentProps={{
            prices,
            cartId,
            currency: total.currency,
          }}
        />
        {cartData && discount && (
          <React.Fragment>
            <span className={classes.lineItemLabel}>
              {"RewardPoint Discount"}
            </span>
            <span className={classes.price}>
              <Price value={discount} currencyCode={total.currency} />
            </span>
          </React.Fragment>
        )}
        {cartData && earnPoint && (
          <React.Fragment>
            <span className={classes.lineItemLabel}>{"Earn Point"}</span>
            <span className={classes.price}>{earnPoint}</span>
          </React.Fragment>
        )}
        <span className={classes.totalLabel}>
          {isCheckout ? "Total" : "Estimated Total"}
        </span>
        <span className={totalPriceClass}>
          <Price
            value={
              cartData && customGrandTotal ? customGrandTotal : total.value
            }
            currencyCode={total.currency}
          />
        </span>
      </div>
      {proceedToCheckoutButton}
    </div>
  );
};

export default PriceSummary;
