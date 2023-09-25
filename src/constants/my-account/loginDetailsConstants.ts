const sideNavData = [
  {
    navHeader: 'My Account',
    clickable: false,
    key: 'myAccount',
    children: [
      {
        key: 'accountOverview',
        navLabel: 'Account Overview',
        svgIcon: 'accountOverview'
      },
      {
        key: 'loginDetails',
        navLabel: 'Login Details',
        svgIcon: 'loginDetails'
      }
    ]
  },
  {
    navHeader: 'My Orders',
    clickable: false,
    key: 'myOrders',
    children: [
      {
        key: 'orderHistory',
        navLabel: 'Order History',
        svgIcon: 'orderHistory'
      },
      {
        key: 'lists',
        navLabel: 'Lists',
        svgIcon: 'favorite'
      }
    ]
  },
  {
    navHeader: 'My Wallet',
    clickable: false,
    key: 'myWallet',

    children: [
      {
        key: 'addressBook',
        navLabel: 'Address Book',
        svgIcon: 'addressBook'
      },
      {
        key: 'paymentOptions',
        navLabel: 'Payment Options',
        svgIcon: 'payment'
      },
      {
        key: 'giftCardLookup',
        navLabel: 'Gift Card Lookup',
        svgIcon: 'giftCard'
      }
    ]
  }
];

const loginDetailsData = [
  {
    key: 'email',
    label: 'Email',
    value: ''
  },
  {
    key: 'password',
    label: 'Password',
    value: '****************'
  },
  {
    key: 'phone',
    label: 'Mobile Phone Number',
    value: ''
  }
];

export { sideNavData, loginDetailsData };
