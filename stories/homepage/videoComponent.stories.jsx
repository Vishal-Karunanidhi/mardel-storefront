import React from 'react';
import VideoComponent from '@Components/homepage/videoComponent';

export default {
    title: 'Homepage/VideoComponent',
    component: VideoComponent,
    argTypes: {},
};

const Template = (args) => <VideoComponent {...args} />;

export const VideoComp = Template.bind({});
VideoComp.args = {
    key: "VideoComponent",
    cta: {
        "label": "Browse Event Items",
        "value": "https://www.hobbylobby.com/"
    },
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis,  praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla.",
    video: {
        image: {
            defaultHost: "cdn.media.amplience.net",
            endpoint: "hobbylobbydev",
            name: "hipster-bag"
        },
        videotitle: "Consectetur adipiscing elit",
        videolink: "https://www.youtube.com/watch?v=ucfZIEF2fRo"
    }
};