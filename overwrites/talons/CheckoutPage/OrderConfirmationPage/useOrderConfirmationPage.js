import { useUserContext } from '@magento/peregrine/lib/context/user';

export const flatten = data => {
    const { cart } = data;
    const { shipping_addresses } = cart;
    const address = shipping_addresses[0];

    const shippingMethod = address ? `${
        address.selected_shipping_method.carrier_title
    } - ${address.selected_shipping_method.method_title}` : '';

    return {
        city: address ? address.city : '',
        country: address ? address.country.label : '',
        email: cart.email,
        firstname: address ? address.firstname : '',
        lastname: address ? address.lastname : '',
        postcode: address ? address.postcode : '',
        region: address ? address.region.label : '',
        shippingMethod,
        street: address ? address.street : [],
        totalItemQuantity: cart.total_quantity
    };
};

export const useOrderConfirmationPage = props => {
    const { data } = props;
    const [{ isSignedIn }] = useUserContext();

    return {
        flatData: flatten(data),
        isSignedIn
    };
};
