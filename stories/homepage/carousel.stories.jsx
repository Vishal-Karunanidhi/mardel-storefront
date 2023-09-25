import React from 'react';
import Slider from '@Components/carousel/carousel';
import departmentStyles from '@Styles/components/departments.module.scss';

export default {
  title: 'Homepage/Carousel',
  component: Slider,
  argTypes: {},
};

const Template = (args) => <Slider {...args} />;

export const CarouselComp = Template.bind({});
CarouselComp.args = {
  cardsPerPage: 5,
  cardStyles: {
    card: departmentStyles.card,
    image: departmentStyles.image,
    text: departmentStyles.text,
  },
  data: [
    {
      title: 'Home Decor & Frames',
      link: 'https://www.hobbylobby.com/Home-Decor-Frames/c/3',
      media: {
        image: {
          _meta: {
            name: null,
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'hobbylobbydev',
          id: '5f451425-f9cf-4b65-be58-a3b657e7fb03',
          name: '1000017-1019-px',
        },
      },
    },
    {
      link: 'https://www.hobbylobby.com/Crafts-Hobbies/c/9',
      media: {
        image: {
          _meta: {
            name: null,
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'hobbylobbydev',
          id: '4f7c1788-4443-44c0-82cd-3d2249a64ffb',
          name: '1001114-a-062619',
        },
      },
      title: 'Crafts & Hobbies',
    },
    {
      link: 'https://www.hobbylobby.com/Fabric-Sewing/c/6',
      media: {
        image: {
          _meta: {
            name: null,
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'hobbylobbydev',
          id: '9d953f1a-76ac-443b-9004-066098b702d9',
          name: '1000934-a_1',
        },
      },
      title: 'Fabric & Sewing',
    },
    {
      link: 'https://www.hobbylobby.com/Scrapbook-Paper-Crafts/c/7',
      media: {
        image: {
          _meta: {
            name: null,
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'hobbylobbydev',
          id: '13c6435a-f6b4-439c-9f8a-d979bc2c5c5d',
          name: 'hipster-bag',
        },
      },
      title: 'Scrapbook & Paper Crafts',
    },
    {
      link: 'https://www.hobbylobby.com/Yarn-Needle-Art/c/5',
      media: {
        image: {
          _meta: {
            name: null,
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'hobbylobbydev',
          id: '1fc0747d-bc62-480d-baef-2651b800c012',
          name: '1000728-a_1',
        },
      },
      title: 'Yarn & Needle Art',
    },
    {
      link: 'https://www.hobbylobby.com/Art-Supplies/c/8',
      media: {
        image: {
          _meta: {
            name: null,
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'hobbylobbydev',
          id: 'dbbcbf47-56da-4595-beee-f5907847b193',
          name: '1000819-b-0317',
        },
      },
      title: 'Art Supplies',
    },
    {
      link: 'https://www.hobbylobby.com/Floral-Wedding/c/4',
      media: {
        image: {
          _meta: {
            name: null,
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'hobbylobbydev',
          id: '72899e30-d34d-4542-a9a1-d6142af8139a',
          name: '1161389-0220',
        },
      },
      title: 'Floral & Wedding',
    },
    {
      link: 'https://www.hobbylobby.com/Party-Baking/c/10',
      media: {
        image: {
          _meta: {
            name: null,
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'hobbylobbydev',
          id: 'b07ffb1b-40ac-406f-8414-78a1950768a0',
          name: '1000447_1',
        },
      },
      title: 'Party & Baking',
    },
    {
      link: 'https://www.hobbylobby.com/Seasonal/c/12',
      media: {
        image: {
          _meta: {
            name: null,
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'hobbylobbydev',
          id: '18ff1f74-c5f6-46dd-b2b5-c47a8d74cc90',
          name: '350Wx350H-381681-122319',
        },
      },
      title: 'Seasonal',
    },
    {
      link: 'https://www.hobbylobby.com/Beads-Jewelry/c/2',
      media: {
        image: {
          _meta: {
            name: null,
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'hobbylobbydev',
          id: 'f9ab4755-7721-4440-b308-17f67135b83e',
          name: '2134328-0122-PX',
        },
      },
      title: 'Beads and Jewelry',
    },
    {
      link: 'https://www.hobbylobby.com/Wearable-Art/c/11',
      media: {
        image: {
          _meta: {
            name: null,
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'hobbylobbydev',
          id: '5a561108-cdb6-4555-bd52-1bc39d39d50a',
          name: '1000488_1',
        },
      },
      title: 'Wearable Art',
    },
    {
      link: 'https://www.hobbylobby.com/Gift-Cards/c/14',
      media: {
        image: {
          _meta: {
            name: null,
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'hobbylobbydev',
          id: '3d7a9193-1d1f-4a80-8dd4-95a384c8b2e0',
          name: 'glasses',
        },
      },
      title: 'Gift Cards',
    },
  ],
};
