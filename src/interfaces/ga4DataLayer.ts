export interface Ga4DataLayer {
  anonymous_user_id: string;

  event: string;

  user_id: string;
}

// events: `view_all_search_results`, `view_more_search_results`
export interface Ga4ViewSearchResultsDataLayer extends Ga4DataLayer {
  email: string;

  event: 'view_all_search_results' | 'view_more_search_results';
  // The search term user searched for. e.g. decor
  search_term: string;
}

// events: `find_store_by_locator`
export interface Ga4FindStoreByLocatorDataLayer extends Ga4DataLayer {
  // The number of search results. e.g. 15
  search_results: number;
  // The search term user searched for. e.g. decor
  search_term: string;
}

// events: `search_filter`
export interface Ga4SearchFilterDataLayer extends Ga4DataLayer {
  event: 'search_filter';
  // The name of filter user applying. e.g. Black, Green
  filter_name: string;
  // The type of filter user applying. e.g. Color, Pattern
  filter_type: string | boolean;
  click_action: string;
}

// events: `search_sort`
export interface Ga4SearchSortDataLayer extends Ga4DataLayer {
  event: 'search_sort';
  // The label user sorting results based on. e.g. A-Z
  sort_label: string;
}

// events: `navigation_click`
export interface Ga4NavigationClickDataLayer extends Ga4DataLayer {
  event: 'navigation_click';
  // The click text that user clicks upon. e.g. Books
  link_text: string;
  // The whole path of the item that was clicked. e.g. Shop department | Home and decor | Canvas
  nav_tree_text: string;
  // The type of navigation user performing. e.g. global | top | footer
  nav_type: string;
}

// events: `phone_click`
export interface Ga4PhoneClickDataLayer extends Ga4DataLayer {
  event: 'phone_click';
  // The click text that user clicks upon. e.g. Books
  link_text: string;
  // The url of the clicked link. e.g. https://www.hobbylobby.com/
  link_url: string;
}

// events: `social_click`
export interface Ga4SocialClickDataLayer extends Ga4DataLayer {
  event: 'social_click';
  // The domain of the clicked link. e.g. hobbylobby.com
  link_domain: string;
  // The click text that user clicks upon. e.g. Books
  link_text: string;
  // The url of the clicked link. e.g. https://www.hobbylobby.com/
  link_url: string;
}

// events: `login`, `sign_up`
export interface Ga4LoginDataLayer extends Ga4DataLayer {
  event: 'login' | 'sign_up' | 'login_attempt' | 'sign_up_attempt' | 'reset_password';
  // The method user using to share content and for login/signup. e.g. Facebook, Twitter
  method?: string;
}

// events: `content_expand`, `content_collapse`
export interface Ga4ContentDataLayer extends Ga4DataLayer {
  // The name of the content the user engaging with. e.g. Gift Cards
  content_name: string;
}

// events: `carousel_click`
export interface Ga4CarouselClickDataLayer extends Ga4DataLayer {
  // The carousel card name
  carousel_card: string;
  // The category of the carousel the user engaging with
  carousel_cat: string;
}

// events: `item_review_submit`, `item_review_abandon`, `notify_when_in_stock`
export interface Ga4ItemReviewDataLayer extends Ga4DataLayer {
  // The ID of the item. item_id or item_name is required. e.g. SKU_12346
  item_id: string;
  // The name of the item. item_id or item_name is required. e.g. Grey Women's Tee
  item_name: string;
}

// events: `share`
export interface Ga4ShareDataLayer extends Ga4DataLayer {
  // The name of the content. e.g. 1001 N. Dupont Hwy
  content_name: string;
  // The ID of the item. item_id or item_name is required. e.g. SKU_12346
  item_id: string;
  // The name of the item. item_id or item_name is required. e.g. Grey Women's Tee
  item_name: string;
  // The method user using to share content and for login/signup. e.g. Facebook, Twitter
  method: string;
}
