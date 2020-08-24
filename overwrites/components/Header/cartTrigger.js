import React from 'react';
import { shape, string } from 'prop-types';
import { ShoppingCart as ShoppingCartIcon } from 'react-feather';

import { useCartTrigger } from '../../talons/Header/useCartTrigger';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../../queries/getCartDetails.graphql';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from '@magento/venia-ui/lib/components/Header/cartTrigger.css';
import { GET_ITEM_COUNT_QUERY } from '@magento/venia-ui/lib/components/Header/cartTrigger.gql';

const CartTrigger = props => {
    const { handleClick, itemCount } = useCartTrigger({
        mutations: {
            createCartMutation: CREATE_CART_MUTATION
        },
        queries: {
            getCartDetailsQuery: GET_CART_DETAILS_QUERY,
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        }
    });

    const classes = mergeClasses(defaultClasses, props.classes);
    const isFilled = itemCount > 0;
    const iconClass = isFilled ? classes.icon_filled : classes.icon_empty;
    const iconClasses = { root: iconClass };
    const buttonAriaLabel = `Toggle mini cart. You have ${itemCount} items in your cart.`;

    const itemCounter = itemCount ? (
        <span className={classes.counter}>{itemCount}</span>
    ) : null;

    return (
        <button
            aria-label={buttonAriaLabel}
            className={classes.root}
            onClick={handleClick}
        >
            <Icon classes={iconClasses} src={ShoppingCartIcon} />
            {itemCounter}
        </button>
    );
};

export default CartTrigger;

CartTrigger.propTypes = {
    classes: shape({
        icon_empty: string,
        icon_filled: string,
        root: string
    })
};