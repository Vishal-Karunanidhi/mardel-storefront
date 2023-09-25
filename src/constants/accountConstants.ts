const breadCrumbs = {
  links: [
    {
      label: 'Home',
      value: '/',
      openInNewTab: false
    },
    {
      label: 'Account',
      value: null,
      openInNewTab: false
    }
  ]
};

const accountListBreadCrumbs = {
  links: [
    {
      label: 'Home',
      value: '/',
      openInNewTab: false
    },
    {
      label: 'Account',
      value: '/my-account',
      openInNewTab: false
    },
    {
      label: 'My Lists',
      value: null,
      openInNewTab: false
    }
  ]
};

const listBreadCrumbs = {
  links: [
    {
      label: 'Home',
      value: '/',
      openInNewTab: false
    },
    {
      label: 'Account',
      value: '/my-account',
      openInNewTab: false
    },
    {
      label: 'My Lists',
      value: '/myList',
      openInNewTab: false
    },
    {
      label: 'My List',
      value: null,
      openInNewTab: false
    }
  ]
};

const accountLabels = {
  signUpLabels: {
    createAccount: 'Create an Account',
    firstName: 'First name',
    lastName: 'Last name',
    signUp: ' Create Account',
    phoneNumberFieldRule:
      ' Must be a US or Canada mobile phone number, available to receive text messages for verification.',
    passwordFieldRule:
      ' Passwords must be minimum 8 characters, and include 1 upper and lowercase letter, number and special character',
    smsCheckboxText: ' I would like to to receive promotional SMS texts from Hobby Lobby.',
    emailCheckBoxText: ' I would like to to receive promotional emails from Hobby Lobby.',
    createAccountRule: 'By clicking on “Create account”, you agree to the',
    privacyPolicy: 'privacy policy',
    termsOfUse: 'terms of use.',
    accountBenefitTitle: 'Enjoy these account benefits'
  },

  signInLabels: {
    signInTitle: 'Sign In',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signInButton: 'Sign In',
    email: 'Email',
    password: 'Password'
  }
};

const defaultAccountValues = {
  defaultSignUpFieldValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  },

  defaultSignInFieldValues: {
    username: '',
    password: ''
  }
};

const dialogLabels = {
  dialogTitle: 'Welcome to Hobby Lobby!',
  dialogContent:
    ' Thank you for creating an account with Hobby Lobby. You now have access to the following online features:',
  resetPassword: 'Reset password.',
  signedUpMessage: 'is already signed up. Did you forget your password?'
};

const accountFormFields = {
  section1: [
    {
      key: 'firstName',
      label: 'First name',
      type: 'text'
    },

    {
      key: 'lastName',
      label: 'Last name',
      type: 'text'
    }
  ],

  section2: [
    {
      key: 'email',
      label: 'Email',
      type: 'text'
    },

    {
      key: 'phone',
      label: 'Mobile phone number',
      type: 'phone'
    }
  ],
  section3: [
    {
      key: 'password',
      label: 'Password',
      type: 'password'
    }
  ],
  section4: [
    {
      key: 'sms',
      label: 'I would like to receive promotional SMS texts from Hobby Lobby.',
      type: 'text'
    },
    {
      key: 'email',
      label: ' I would like to receive promotional emails from Hobby Lobby.',
      type: 'text'
    }
  ]
};

const accountBenefits = {
  benefit1: [
    {
      label: 'Personalized suggestions',
      image: 'account'
    },
    {
      label: 'Check-out faster',
      image: 'cart'
    }
  ],
  benefit2: [
    {
      label: 'Manage your lists',
      image: 'favorite'
    },
    {
      label: 'Track orders',
      image: 'location'
    }
  ]
};

const accountRule = {
  anchorSection: [
    {
      label: 'privacy policy',
      href: '/customer-service/privacy-terms#PrivacyPolicy'
    },
    {
      label: 'terms of use.',
      href: '/customer-service/privacy-terms#TermsOfUse'
    }
  ]
};

const signInRememberFieldKey = {
  REMEMBER_ME: 'rememberMe',
  REMEMBER_EMAIL: 'userName'
};

const individualListBreadCrumbs = {
  links: [
    {
      label: 'Home',
      value: '/',
      openInNewTab: false
    },
    {
      label: 'Account',
      value: '/my-account',
      openInNewTab: false
    },
    {
      label: 'My Lists',
      value: '/my-account#lists',
      openInNewTab: false
    }
  ]
};

export {
  breadCrumbs,
  accountLabels,
  dialogLabels,
  accountFormFields,
  accountBenefits,
  accountRule,
  defaultAccountValues,
  signInRememberFieldKey,
  listBreadCrumbs,
  accountListBreadCrumbs,
  individualListBreadCrumbs
};
