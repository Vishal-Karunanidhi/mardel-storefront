import React from 'react';
import FreeShipping from '@Components/homepage/freeShipping';

export default {
    title: 'Homepage/FreeShipping',
    component: FreeShipping,
    argTypes: {},
};

const Template = (args) => <FreeShipping {...args} />;

export const FreeShippingComp = Template.bind({});
FreeShippingComp.args = {
    key: "Free Shipping Content",
    policies: "*Applies to Hobby Lobby’s standard shipping fees only.",
    subtitle: "Not all items eligible. Carrier peak season surcharges may apply.",
    title: "Free Shipping* on online orders of $50 or more Fr Test1234 - Sample ping",
    image: {
        defaultHost: "cdn.media.amplience.net",
        endpoint: "hobbylobbydev",
        id: "a12e1adf-1134-47db-b7bf-42643d244e26",
        name: "creative_life_van"
    }
};
