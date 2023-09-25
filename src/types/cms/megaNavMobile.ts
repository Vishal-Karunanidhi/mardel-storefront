import { Meta } from '@Types/shared';

type BottomNavigationList = {
  bNLText: string;
  bNLURL: string;
};

type TNlStoreFinder = {
  myStoreFinderText: string;
  myStoreFinderURL: string;
};

type TNlMyAccount = {
  myAccountText: string;
  myAccountURL: string;
};

type TNlMyLists = {
  myListsText: string;
  myListsLIURL: string;
  myListsGURL: string;
};

type TNlCart = {
  myCartText: string;
  myCartURL: string;
};

type TopNavigationList = {
  tNLStoreFinder: TNlStoreFinder;
  tNLMyAccount: TNlMyAccount;
  tNLMyLists: TNlMyLists;
  tNLCart: TNlCart;
};

type CreateAccountButton = {
  createAccountButtonText: string;
  createAccountButtonURL: string;
};

type SignInButton = {
  signInButtonText: string;
  signInButtonURL: string;
};

export type MegaNavMobileType = {
  signInButton: SignInButton;
  createAccountButton: CreateAccountButton;
  topNavigationList: TopNavigationList;
  bottomNavigationList: BottomNavigationList[];
  _meta: Meta;
};

export type MegaNavMobileTypeRaw = {
  data: {
    megaNavMobile: MegaNavMobileType;
  };
};
