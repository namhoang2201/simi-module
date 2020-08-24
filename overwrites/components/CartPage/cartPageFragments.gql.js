import gql from 'graphql-tag';

import { GiftCardFragment } from '@magento/venia-ui/lib/components/CartPage/GiftCards/giftCardFragments';
import { PriceSummaryFragment } from '@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummaryFragments';
import { AppliedCouponsFragment } from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode/couponCodeFragments';

export const CartPageFragment = gql`
    fragment CartPageFragment on Cart {
        id
        total_quantity
        ...AppliedCouponsFragment
        ...GiftCardFragment
        ...PriceSummaryFragment
    }
    ${AppliedCouponsFragment}
    ${GiftCardFragment}
    ${PriceSummaryFragment}
`;