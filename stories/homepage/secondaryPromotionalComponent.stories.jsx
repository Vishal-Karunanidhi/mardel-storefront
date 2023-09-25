import React from 'react';
import SecondaryPromotionComp from '@Components/homepage/secondaryPromotion';

export default {
    title: 'Homepage/secondaryPromotion',
    component: SecondaryPromotion,
    argTypes: {},
};

const Template = (args) => <SecondaryPromotionComp {...args} />;

export const SecondaryPromotion = Template.bind({});
SecondaryPromotion.args = {
    "__typename": "SecondaryPromoComponent",
    "_meta": {
        "__typename": "Meta",
        "name": "Seconday Promo Component"
    },
    "Promos": [
        {
            "__typename": "PromoCard",
            "_meta": {
                "__typename": "Meta",
                "name": null
            },
            "link": "https://www.hobbylobby.com/Spring-Shop/c/50",
            "media": {
                "__typename": "Media",
                "image": {
                    "__typename": "MediaImage",
                    "_meta": {
                        "__typename": "Meta",
                        "name": null
                    },
                    "defaultHost": "cdn.media.amplience.net",
                    "endpoint": "hobbylobbydev",
                    "id": "9e55b592-2231-4805-b0e5-eec94823f1ea",
                    "name": "lighting",
                    "url": "cdn.media.amplience.net/i/hobbylobbydev/lighting"
                },
                "imageAltText": "Green something"
            },
            "discountLabel": "50% Off",
            "description": "Home Decor Featuring Table Decor"
        },
        {
            "__typename": "PromoCard",
            "_meta": {
                "__typename": "Meta",
                "name": null
            },
            "link": "https://www.hobbylobby.com/Spring-Shop/Crafts/c/50-030",
            "media": {
                "__typename": "Media",
                "image": {
                    "__typename": "MediaImage",
                    "_meta": {
                        "__typename": "Meta",
                        "name": null
                    },
                    "defaultHost": "cdn.media.amplience.net",
                    "endpoint": "hobbylobbydev",
                    "id": "29884f8b-0808-46b6-ae4d-7d2c641364f7",
                    "name": "BasketPromo",
                    "url": "cdn.media.amplience.net/i/hobbylobbydev/BasketPromo"
                },
                "imageAltText": "Test something else"
            },
            "discountLabel": "40% Off",
            "description": "Home Decor Featuring Baskets"
        }
    ],
    "Title": "Secondary Promo Component"
};
