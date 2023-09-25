const limit = 5;
const showMore = true;

const DEFAULT_TOGGLE_FACETS = ['on_sale', 'query'];

const TOGGLE_FACETS = ['product.isInStock', ...DEFAULT_TOGGLE_FACETS];
const SEARCH_TOGGLE_FACETS = ['isInStock', ...DEFAULT_TOGGLE_FACETS];
const DIY_TOGGLE_FACETS = ['hasVideo'];
const WEEKLY_AD_RULE_CONTEXT_TOGGLE_FACETS = [
  'product.isInStock',
  'isInStock',
  ...DEFAULT_TOGGLE_FACETS
];

const pageBasedToggleFacets = {
  PLP: TOGGLE_FACETS,
  SRP: SEARCH_TOGGLE_FACETS,
  DIY: DIY_TOGGLE_FACETS,
  WARC: WEEKLY_AD_RULE_CONTEXT_TOGGLE_FACETS
};

const FACETS_TO_EXCLUDE_CAT = ['department', 'category'];
const FACETS_TO_EXCLUDE_STOCK = ['isInStock', 'product.isInStock'];
const FACETS_TO_EXCLUDE_SUB_CAT = ['department', 'category', 'subcategory'];

const FACETS_TITLE_MAP = {
  isInStock: 'In Stock',
  on_sale: 'On Sale',
  'product.isInStock': 'In Stock',
  hasVideo: 'Has Video',
  skillLevel: 'Skill Level',
  subcategory: 'Product Type',
  brand: 'Brand',
  color: 'Color',
  size: 'Size',
  'ribbon-type': 'Ribbon Type',
  fiber: 'Fiber',
  'ribbon-content': 'Ribbon Content',
  'season-code': 'Season Code'
};

const DIY_FACET = [
  {
    attribute: 'hasVideo',
    isToggle: true
  },
  {
    attribute: 'skillLevel',
    limit,
    showMore
  }
];

const DEFAULT_FACETS = [
  {
    attribute: 'isInStock',
    isToggle: true
  },
  {
    attribute: 'on_sale',
    isToggle: true
  },
  {
    attribute: 'product.isInStock',
    isToggle: true
  },
  {
    attribute: 'hasVideo',
    isToggle: true
  },
  {
    attribute: 'skillLevel',
    limit,
    showMore
  },
  {
    attribute: 'subcategory',
    limit,
    showMore
  },
  {
    attribute: 'brand',
    limit,
    showMore
  },
  {
    attribute: 'color',
    limit,
    showMore
  },
  {
    attribute: 'size',
    limit,
    showMore
  },
  {
    attribute: 'ribbon-type',
    limit,
    showMore
  },
  {
    attribute: 'fiber',
    limit,
    showMore
  },
  {
    attribute: 'ribbon-content',
    limit,
    showMore
  },
  {
    attribute: 'season-code',
    limit,
    showMore
  }
];
const DIY_SORT_BY = {
  items: [
    {
      label: 'Most Recent',
      value: process.env.NEXT_PUBLIC_ALGOLIA_DIY_INDEX_REPLICA_DATE_MOST_RECENT
    },
    { label: 'Oldest', value: process.env.NEXT_PUBLIC_ALGOLIA_DIY_INDEX_REPLICA_DATE_OLDEST }
  ]
};

const SORT_BY = {
  items: [
    { label: 'Relevance', value: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME },
    {
      label: 'Name A-Z',
      value: process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_NAME_ASC_INDEX_NAME
    },
    {
      label: 'Name Z-A',
      value: process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_NAME_DESC_INDEX_NAME
    },
    {
      label: 'Price Low - High',
      value: process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_PRICE_ASC_INDEX_NAME
    },
    {
      label: 'Price High - Low',
      value: process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_PRICE_DESC_INDEX_NAME
    },
    {
      label: 'New',
      value: process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_NEW_ASC_INDEX_NAME
    }
  ]
};

if (typeof window !== 'undefined') {
  const { href } = window?.location;
  const isSrpPage = href.indexOf('/search') !== -1;
  if (isSrpPage) {
    SORT_BY.items.forEach((e) => {
      if (e?.label === 'Price Low - High') {
        e.value = process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_VARIANT_PRICE_ASC_INDEX_NAME;
      }
      if (e?.label === 'Price High - Low') {
        e.value = process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_VARIANT_PRICE_DESC_INDEX_NAME;
      }
    });
  }
}

const SORT_BY_MAP = {
  [process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME]: 'Relevance',
  [process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_NAME_ASC_INDEX_NAME]: 'Name A-Z',
  [process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_NAME_DESC_INDEX_NAME]: 'Name Z-A',
  [process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_PRICE_ASC_INDEX_NAME]: 'Price Low - High',
  [process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_PRICE_DESC_INDEX_NAME]: 'Price High - Low',
  [process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_NEW_ASC_INDEX_NAME]: 'New',
  [process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_VARIANT_PRICE_ASC_INDEX_NAME]: 'Price Low - High',
  [process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_VARIANT_PRICE_DESC_INDEX_NAME]: 'Price High - Low'
};

const DIY_SORT_BY_MAP = {
  [process.env.NEXT_PUBLIC_ALGOLIA_DIY_INDEX_REPLICA_DATE_MOST_RECENT]: 'Most Recent',
  [process.env.NEXT_PUBLIC_ALGOLIA_DIY_INDEX_REPLICA_DATE_OLDEST]: 'Oldest'
};

const DIY_SORT_BY_KEY_TO_INDEX = {
  'Most Recent': process.env.NEXT_PUBLIC_ALGOLIA_DIY_INDEX_REPLICA_DATE_MOST_RECENT,
  Oldest: process.env.NEXT_PUBLIC_ALGOLIA_DIY_INDEX_REPLICA_DATE_OLDEST
};

const SORT_BY_KEY_TO_INDEX = {
  Relevance: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  'Name A-Z': process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_NAME_ASC_INDEX_NAME,
  'Name Z-A': process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_NAME_DESC_INDEX_NAME,
  'Price Low - High': process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_PRICE_ASC_INDEX_NAME,
  'Price High - Low': process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_PRICE_DESC_INDEX_NAME,
  New: process.env.NEXT_PUBLIC_ALGOLIA_REPLICA_NEW_ASC_INDEX_NAME
};

export {
  DIY_FACET,
  DEFAULT_FACETS,
  limit,
  showMore,
  FACETS_TO_EXCLUDE_STOCK,
  FACETS_TO_EXCLUDE_CAT,
  FACETS_TO_EXCLUDE_SUB_CAT,
  FACETS_TITLE_MAP,
  SORT_BY,
  SORT_BY_MAP,
  SORT_BY_KEY_TO_INDEX,
  TOGGLE_FACETS,
  SEARCH_TOGGLE_FACETS,
  DIY_TOGGLE_FACETS,
  pageBasedToggleFacets,
  DIY_SORT_BY,
  DIY_SORT_BY_MAP,
  DIY_SORT_BY_KEY_TO_INDEX
};
