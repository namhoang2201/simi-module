import React, { useMemo } from 'react';
import { array, func, number, shape, string } from 'prop-types';

import { Price } from '@magento/peregrine';
import { useProduct } from '@magento/peregrine/lib/talons/MiniCart/useProduct';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../../queries/getCartDetails.graphql';
import Image from '@magento/venia-ui/lib/components/Image';
import { REMOVE_ITEM_MUTATION } from '@magento/venia-ui/lib/components/MiniCart/cartOptions.gql';
import Kebab from '@magento/venia-ui/lib/components/MiniCart/kebab';
import defaultClasses from '@magento/venia-ui/lib/components/MiniCart/product.css';
import ProductOptions from '@magento/venia-ui/lib/components/MiniCart/productOptions';
import Section from '@magento/venia-ui/lib/components/MiniCart/section';

import InjectedComponents from '../../../inject/injectedComponent';
import {GIFTCARD_MODULE} from '../../../util/checkedPlugin'

const PRODUCT_IMAGE_WIDTH = 80;

const Product = props => {
    const { beginEditItem, currencyCode, item } = props;

    const talonProps = useProduct({
        beginEditItem,
        createCartMutation: CREATE_CART_MUTATION,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        item,
        removeItemMutation: REMOVE_ITEM_MUTATION
    });

    const {
        handleEditItem,
        handleFavoriteItem,
        handleRemoveItem,
        isFavorite,
        isLoading,
        productImage,
        productName,
        productOptions,
        productPrice,
        productQuantity
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const productImageComponent = useMemo(() => {
        const imageProps = {
            alt: productName,
            classes: { image: classes.image, root: classes.imageContainer },
            width: PRODUCT_IMAGE_WIDTH
        };

        if (!productImage) {
            imageProps.src = transparentPlaceholder;
        } else {
            imageProps.resource = productImage;
        }

        return <Image {...imageProps} />;
    }, [classes.image, classes.imageContainer, productImage, productName]);

    const mask = isLoading ? <div className={classes.mask} /> : null;

    

    return (
        <li className={classes.root}>
            {productImageComponent}
            <div className={classes.name}>{productName}</div>
            <ProductOptions options={productOptions} />
            <InjectedComponents 
                module={GIFTCARD_MODULE} 
                func={'CartGiftCardOptions'} 
                parentProps={{
                    item, 
                    currencyCode
                }}
             />
            <div className={classes.quantity}>
                <div className={classes.quantityRow}>
                    <span>{productQuantity}</span>
                    <span className={classes.quantityOperator}>{'×'}</span>
                    <span className={classes.price}>
                        <Price
                            currencyCode={currencyCode}
                            value={productPrice}
                        />
                    </span>
                </div>
            </div>
            {mask}
            <Kebab>
                <Section
                    text="Add to favorites"
                    onClick={handleFavoriteItem}
                    icon="Heart"
                    isFilled={isFavorite}
                />
                <Section
                    text="Edit item"
                    onClick={handleEditItem}
                    icon="Edit2"
                />
                <Section
                    text="Remove item"
                    onClick={handleRemoveItem}
                    icon="Trash"
                />
            </Kebab>
        </li>
    );
};

Product.propTypes = {
    beginEditItem: func.isRequired,
    currencyCode: string,
    item: shape({
        image: shape({
            file: string
        }),
        name: string,
        options: array,
        price: number,
        qty: number
    }).isRequired
};

export default Product;