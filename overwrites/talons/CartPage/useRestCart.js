import { useCallback, useState, useEffect } from "react";
import { getRestCart } from "@simicart/simi-module/rest/Cart";
import { useCartContext } from "@magento/peregrine/lib/context/cart";
import { useUserContext } from "@magento/peregrine/lib/context/user";

export const useRestCart = (props) => {
  const [{ isSignedIn }] = useUserContext();
  const [, { cartId }] = useCartContext();
  const [cartData, setCartData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const callBack = useCallback(
    (data) => {
      if (data) {
        setCartData(data);
        setLoading(false);
      }
    },
    [setCartData, setLoading]
  );

  const getCartDetailCustom = useCallback(() => {
    setLoading(true)
    getRestCart(callBack, isSignedIn, cartId);
  }, [callBack, isSignedIn, cartId]);

  useEffect(() => {
    getCartDetailCustom();
  }, []);

  let earn_point = 0;
  let spend_point = 0;
  let spend_amount = 0;
  let quote_currency_code = null;
  if (cartData) {
    const { extension_attributes } = cartData;
    if(cartData&&cartData.hasOwnProperty('quote_currency_code')){
      quote_currency_code = cartData.quote_currency_code;
    }
    if(extension_attributes&&extension_attributes.hasOwnProperty('earn_points')){
      earn_point = extension_attributes.earn_points;
    }
    if (
      extension_attributes &&extension_attributes.hasOwnProperty("spend_points")
    ) {
      spend_point = extension_attributes.spend_points;
    }
    if (
      cartData &&
      cartData.total_segments &&
      Array.isArray(cartData.total_segments) &&
      cartData.total_segments.length
    ) {
      cartData.total_segments.forEach((item) => {
        if (item.code === "spend_point") {
          spend_amount = item.value;
        }
      });
    }
  }

  return {
    isSignedIn,
    cartId,
    isLoading,
    setLoading,
    cartData,
    getCartDetailCustom,
    earn_point,
    spend_point,
    spend_amount,
    quote_currency_code,
  };
};
