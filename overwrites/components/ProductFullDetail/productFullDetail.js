import React, { Fragment, Suspense } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';

import { Price } from '@magento/peregrine';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import Quantity from '@magento/venia-ui/lib/components/ProductQuantity';
import RichText from '@magento/venia-ui/lib/components/RichText';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../../queries/getCartDetails.graphql';
import defaultClasses from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.css';
import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION
} from './productFullDetail.gql';
// custom gift card
import {
    GIFTCARD_MODULE,
    REWARDPOINT_MODULE
} from '../../../util/checkedPlugin';
import InjectedComponents from '@simicart/simi-module/inject/injectedComponent';
import injectedAction from '../../../inject/injectedAction';
// end custome gift card

const Options = React.lazy(() =>
    import('@magento/venia-ui/lib/components/ProductOptions')
);

const ProductFullDetail = props => {
    const { product } = props;
    // nam customize
    const { url_key } = product;
    // end customize

    const talonProps = useProductFullDetail({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        createCartMutation: CREATE_CART_MUTATION,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        product
    });

    const {
        breadcrumbCategoryId,
        handleAddToCart,
        handleSelectionChange,
        handleSetQuantity,
        isAddToCartDisabled,
        mediaGalleryEntries,
        productDetails,
        quantity
    } = talonProps;

    const giftCardProps = injectedAction({
        module: GIFTCARD_MODULE,
        func: 'useProductGiftCard',
        otherProps: {
            quantity,
            product,
            productDetails,
            mediaGalleryEntries,
            createCartMutation: CREATE_CART_MUTATION,
            getCartDetailsQuery: GET_CART_DETAILS_QUERY
        }
    });

    let customAddToCardDisable = isAddToCartDisabled
    if(giftCardProps && giftCardProps.isProductGiftCard && !giftCardProps.isAddGiftCardProductLoading) customAddToCardDisable = false

    let customHandleAddToCart = handleAddToCart
    if(giftCardProps && giftCardProps.isProductGiftCard && giftCardProps.handleAddProductGiftCartToCart) customHandleAddToCart = giftCardProps.handleAddProductGiftCartToCart

    const classes = mergeClasses(defaultClasses, props.classes);

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
            />
        </Suspense>
    ) : null;

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
        />
    ) : null;

    return (
        <Fragment>
            {breadcrumbs}
            <Form className={classes.root}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>
                        {productDetails.name}
                    </h1>
                    <p className={classes.productPrice}>
                        <Price
                            currencyCode={productDetails.price.currency}
                            value={productDetails.price.value}
                        />
                    </p>
                </section>
                <section className={classes.imageCarousel}>
                    <Carousel images={mediaGalleryEntries} />
                </section>
                {
                    <InjectedComponents
                        module={GIFTCARD_MODULE}
                        func={'ProductGiftCardOptions'}
                        parentProps={{
                            product,
                            currencyCode: productDetails.price.currency,
                            giftCardProps
                        }}
                    />
                }
                {url_key && (
                    <InjectedComponents
                        module={REWARDPOINT_MODULE}
                        func={'PointMessage'}
                        parentProps={{
                            url_key,
                            type: 'submit_review'
                        }}
                    />
                )}
                <section className={classes.options}>{options}</section>
                <section className={classes.quantity}>
                    <h2 className={classes.quantityTitle}>Quantity</h2>
                    <Quantity
                        initialValue={quantity}
                        onValueChange={handleSetQuantity}
                    />
                </section>
                <section className={classes.cartActions}>
                    <Button
                        priority="high"
                        onClick={customHandleAddToCart}
                        disabled={customAddToCardDisable}
                    >
                        Add to Cart
                    </Button>
                </section>
                {url_key && (
                    <InjectedComponents
                        module={REWARDPOINT_MODULE}
                        func={'PointMessage'}
                        parentProps={{
                            url_key,
                            type: 'product_config'
                        }}
                    />
                )}
                <section className={classes.description}>
                    <h2 className={classes.descriptionTitle}>
                        Product Description
                    </h2>
                    <RichText content={productDetails.description} />
                </section>
                <section className={classes.details}>
                    <h2 className={classes.detailsTitle}>SKU</h2>
                    <strong>{productDetails.sku}</strong>
                </section>
            </Form>
        </Fragment>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        root: string,
        title: string
    }),
    product: shape({
        __typename: string,
        id: number,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string
    }).isRequired
};

export default ProductFullDetail;
