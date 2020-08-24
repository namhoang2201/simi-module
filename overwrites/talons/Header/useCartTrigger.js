import { useCallback, useEffect } from 'react';
import { useApolloClient, useQuery, useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { checkModule, GIFTCARD_MODULE } from '../../../util/checkedPlugin'

export const useCartTrigger = props => {
    const {
        mutations: { createCartMutation },
        queries: { getCartDetailsQuery, getItemCountQuery }
    } = props;

    const apolloClient = useApolloClient();
    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }, { getCartDetails }] = useCartContext();
    
    // customize use giftcard query
    // const checkModuleGiftCard = checkModule(GIFTCARD_MODULE)

    // console.log(checkModuleGiftCard)

    const { data } = useQuery(getItemCountQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            cartId,
        },
        skip: !cartId
    });

    const [fetchCartId] = useMutation(createCartMutation);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const itemCount = data ? data.cart.total_quantity : 0;

    useEffect(() => {
        // Passing apolloClient to wipe the store in event of auth token expiry
        // This will only happen if the user refreshes.
        getCartDetails({ apolloClient, fetchCartId, fetchCartDetails });
    }, [apolloClient, fetchCartDetails, fetchCartId, getCartDetails]);

    const handleClick = useCallback(async () => {
        toggleDrawer('cart');
        // TODO: Cart details should be fetched by MiniCart.
        await getCartDetails({
            fetchCartId,
            fetchCartDetails
        });
    }, [fetchCartDetails, fetchCartId, getCartDetails, toggleDrawer]);

    return {
        handleClick,
        itemCount
    };
};
