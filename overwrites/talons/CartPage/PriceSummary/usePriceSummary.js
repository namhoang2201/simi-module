import { useEffect, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

/**
 * Flattens query data into a simple object. We create this here rather than
 * having each line summary line component destructure its own data because
 * only the parent "price summary" component knows the data structure.
 *
 * @param {Object} data query data
 */
const flattenData = data => {
    if (!data) return {};
    return {
        subtotal: data.cart.prices.subtotal_excluding_tax,
        total: data.cart.prices.grand_total,
        discounts: data.cart.prices.discounts,
        giftCards: data.cart.applied_gift_cards,
        taxes: data.cart.prices.applied_taxes,
        shipping: data.cart.shipping_addresses
    };
};

export const usePriceSummary = props => {
    const {
        queries: { getPriceSummary }
    } = props;

    const [{ cartId, details }] = useCartContext();
    const history = useHistory();
    // We don't want to display "Estimated" or the "Proceed" button in checkout.
    // simi customize route
    const path = window.location.pathname;
    // const match = useRouteMatch('/checkout');
    const match = path.includes('/checkout')
    const isCheckout = !!match;
    // end customize

    const { error, loading, data } = useQuery(getPriceSummary, {
        skip: !cartId,
        variables: {
            cartId
        }
    });

    useEffect(() => {
        if (error) {
            console.error('GraphQL Error:', error);
        }
    }, [error]);

    const handleProceedToCheckout = useCallback(() => {
        history.push('/checkout');
    }, [history]);

    // simi customize: add 2 fields prices and cartId
    return {
        handleProceedToCheckout,
        hasError: !!error,
        hasItems: data && !!data.cart.items.length,
        isCheckout,
        isLoading: !!loading,
        flatData: flattenData(data),
        prices: details.prices,
        cartId
    };
};
