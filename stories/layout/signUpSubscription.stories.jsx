import React from 'react';
import SignUpSubscription from '@Components/layout/signUpSubscription';

export default {
    title: 'Layout/SignUpSubscription',
    component: SignUpSubscription,
    argTypes: {},
};

const Template = (args) => <SignUpSubscription {...args} />;

export const SignUpSubscriptionComp = Template.bind({});
SignUpSubscriptionComp.args = {
    description: "Join our email list to receive our Weekly Ad, special promotions, fun project ideas and store news.",
    button: "Sign Up",
    successMessageHeading: "Thank you for signing up for the Hobby Lobby newsletter!",
    successMessage: "We’ll keep you updated on our weekly ad and special promotions, as well as new and trending products!",
    errorMessageHeading: "Error",
    errorMessage: "Already Subscribed"
};
