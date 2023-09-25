import '@Constants/contactUsConstants';

type Topic = '' | 'Hobby Lobby Stores' | 'Online Orders' | 'Miscellaneous';
type SubTopic =
  | ''
  | 'Contact Us'
  | 'Cancel Order'
  | 'Update Address'
  | 'Order Status & Tracking Number'
  | 'Damaged or Defective Items'
  | 'Wrong or Missing Items'
  | 'Lost or Missing Order'
  | 'Product Questions'
  | 'Privacy Policy'
  | 'Website Feedback'
  | 'Holiday Messages'
  | 'Communication Preferences'
  | 'Other';

type FormFields =
  | 'First name'
  | 'Last name'
  | 'Email address'
  | 'Phone number (optional)'
  | 'Comment'
  | 'What store number or location are you referencing?'
  | 'City & State'
  | 'Store name and #'
  | 'Address line 1'
  | 'Apt, Ste, Bldg (optional)'
  | 'City'
  | 'State'
  | 'Zip code'
  | 'Damaged SKU# (optional)'
  | 'Wrong SKU# received (optional)'
  | 'Missing SKU# (optional)'
  | 'SKU# (optional)'
  | 'Order number'
  | 'Order number (optional)';

// TODO - Use key value pairs for contact us options
/*
  cons valueKeyMapping = {
   'First name':"firstName",
   'Last name':"lastName",
   'Email address': "emailAddress",
   ... similarly others
  }
*/

const topics: Topic[] = ['', 'Hobby Lobby Stores', 'Online Orders', 'Miscellaneous'];

const subTopics: Record<Topic, SubTopic[]> = {
  'Hobby Lobby Stores': [],
  'Online Orders': [
    '',
    'Cancel Order',
    'Update Address',
    'Order Status & Tracking Number',
    'Damaged or Defective Items',
    'Wrong or Missing Items',
    'Lost or Missing Order',
    'Other'
  ],
  Miscellaneous: [
    '',
    'Product Questions',
    'Privacy Policy',
    'Website Feedback',
    'Holiday Messages',
    'Communication Preferences',
    'Other'
  ],
  '': []
};

const standardForm: FormFields[] = [
  'First name',
  'Last name',
  'Email address',
  'Phone number (optional)',
  'Comment'
];

const orderForm: FormFields[] = insert(standardForm, -1, 'Order number');

const formVariants: Record<SubTopic, FormFields[]> = {
  '': [],
  'Contact Us': insert(
    standardForm,
    -1,
    'What store number or location are you referencing?',
    'City & State',
    'Store name and #'
  ),
  'Cancel Order': orderForm,
  'Update Address': insert(
    orderForm,
    -2,
    'Address line 1',
    'Apt, Ste, Bldg (optional)',
    'City',
    'State',
    'Zip code'
  ),
  'Order Status & Tracking Number': orderForm,
  'Damaged or Defective Items': insert(orderForm, -2, 'Damaged SKU# (optional)'),
  'Wrong or Missing Items': insert(
    standardForm,
    -1,
    'Wrong SKU# received (optional)',
    'Missing SKU# (optional)',
    'Order number'
  ),
  'Lost or Missing Order': orderForm,
  'Product Questions': insert(standardForm, -1, 'SKU# (optional)'),
  'Privacy Policy': standardForm,
  'Website Feedback': standardForm,
  'Holiday Messages': standardForm,
  'Communication Preferences': standardForm,
  Other: insert(standardForm, -1, 'Order number (optional)')
};

function insert(arrayToAddTo: FormFields[], index: number, ...items: FormFields[]) {
  const array = arrayToAddTo.slice();
  array.splice(index, 0, ...items);
  return array;
}

export type { Topic, SubTopic, FormFields };
export { topics, subTopics, formVariants };
