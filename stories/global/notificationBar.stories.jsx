import React from 'react';
import NotificationBar from '@Components/global/notificationBar';

export default {
    title: 'Global/Notification',
    component: NotificationBar,
    argTypes: {},
};

const Template = (args) => <NotificationBar {...args} />;

export const Notification = Template.bind({});
Notification.args = {
    prevLable: "left",
    nextLable: "right",
    notificationTitle: "Hi Vairavan"
};
