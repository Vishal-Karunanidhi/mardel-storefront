import React from 'react';
import Header from '@Components/layout/header';

export default {
    title: 'Layout/Header',
    component: Header,
    argTypes: {
        menuItems: [{
            "name": "SSG-Graphql",
            "path": ""
        },
        {
            "name": "StaticSG",
            "path": "strategies/render/ssg"
        }],
    },
};

const Template = (args) => <Header {...args} />;

export const HeaderComp = Template.bind({});
HeaderComp.args = {
    menuItems: [{
        "name": "SSG-Graphql",
        "path": ""
    },
    {
        "name": "StaticSG",
        "path": "strategies/render/ssg"
    }]
};
