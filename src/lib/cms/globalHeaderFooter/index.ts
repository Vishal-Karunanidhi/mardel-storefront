import { fetchDataViaGql, modifyDataViaGql } from '@Graphql/client';
import GlobalHeaderContent from '@GqlQueries/headless/globalHeaderContent.graphql';
import GlobalHeaderContentLite from '@GqlQueries/headless/globalHeaderContentLite.graphql';
import GlobalFooterContent from '@GqlQueries/headless/globalFooterContent.graphql';
import GlobalFooterContentLite from '@GqlQueries/headless/globalFooterContentLite.graphql';
import SignupForEmailsGql from '@GqlMutations/headerSignUp/headerAccountSignUp.graphql';
import { gql } from '@apollo/client';
import GQL_CONST from '@Constants/gqlConstants';
import HeaderMegaNav from '@GqlQueries/headless/headerMegaNav.graphql';
import { HeaderContent, HeaderContentBlockData } from 'src/types/header';
import {
  FooterTypeRaw,
  FooterTypeFromBff,
  FooterItemsBffUnion
} from 'src/types/cms/raw/footer.raw';
import { MegaNavTypeRaw, MegaNavChildren } from 'src/types/cms/raw/megaNav.raw';
import { FooterTypeCompiled } from 'src/types/cms/compiled/footer.compiled';
import { MegaNavMobileType, MegaNavMobileTypeRaw } from '@Types/cms/megaNavMobile';
import MegaNavMobileDrawer from '@GqlQueries/headless/megaNavMobile.graphql';

/*
 * Extract Global Header & Footer CMS data
 */
async function getGlobalHeaderData(
  headers = {},
  isCheckoutPage = false
): Promise<HeaderContentBlockData[]> {
  const queryToExecute = isCheckoutPage ? GlobalHeaderContentLite : GlobalHeaderContent;
  try {
    const {
      data: { globalHeaderContent }
    }: { data: { globalHeaderContent: HeaderContent } } = await fetchDataViaGql(
      queryToExecute,
      GQL_CONST._UNUSED,
      GQL_CONST._UNUSED,
      headers
    );
    return processGlobalHeaderData(globalHeaderContent, isCheckoutPage);
  } catch (err) {
    console.error('getGlobalHeaderData-----', err);
    return null;
  }
}

async function getCartCount(headers): Promise<any> {
  const otherProps = {
    variables: {
      recalculate: false,
      recalculateTax: false
    }
  };
  try {
    const { data } = await fetchDataViaGql(
      gql`
        query getCartCount($recalculate: Boolean, $recalculateTax: Boolean) {
          getCart(recalculate: $recalculate, recalculateTax: $recalculateTax) {
            lineItemCount
          }
        }
      `,
      GQL_CONST._UNUSED,
      otherProps,
      headers
    );
    return data?.getCart?.lineItemCount ?? 0;
  } catch (err) {
    return 0;
  }
}

const processGlobalHeaderData = (
  { __typename: _headTypeName, contents }: HeaderContent,
  isCheckoutPage
): HeaderContentBlockData[] => {
  const extractData = (prev: HeaderContentBlockData[], curr: any) => {
    let key = curr.__typename;

    switch (key) {
      case 'NotificationBarSlot':
        const { notifications } = curr?.slotContent ?? [];
        notifications?.forEach((e) => {
          if (!e.link) {
            e.link = {
              label: null,
              value: null,
              openInNewTab: false
            };
          }
        });
        prev.push({ ...curr, key, notifications });
        break;
      case 'PlaceholderContent':
        prev.push({ ...curr, key });
        break;
      case 'LinkContent':
        key = curr.theme;
        prev.push({ ...curr, key });
        break;
      default:
        key = curr.theme;
        prev.push({ ...curr, key });
        break;
    }
    return prev;
  };
  const result = contents.reduce(extractData, []);
  if (isCheckoutPage) {
    result?.forEach(({ key }, i) => {
      if (['NotificationBarSlot', 'PlaceholderContent', 'LinkContent'].indexOf(key) !== -1) {
        result.splice(i, 1);
      }
    });
  }
  return result;
};

/*
 * Extract Hompage Card & promotional CMS data
 */
async function getGlobalFooterData(
  headers = {},
  isCheckoutPage = false
): Promise<FooterTypeCompiled> {
  const queryToExecute = isCheckoutPage ? GlobalFooterContentLite : GlobalFooterContent;
  try {
    const {
      data: { globalFooterContent }
    }: FooterTypeRaw = await fetchDataViaGql(
      queryToExecute,
      GQL_CONST._UNUSED,
      GQL_CONST._UNUSED,
      headers
    );
    return processGlobalFooterData(globalFooterContent, isCheckoutPage);
  } catch (err) {
    console.error('Error occurred GetGlobalFooterData-----', err);
    return null;
  }
}

const processGlobalFooterData = (
  { __typename: _headTypeName, contents }: FooterTypeFromBff,
  isCheckoutPage
): FooterTypeCompiled => {
  const extractData = (prev: FooterTypeCompiled, curr: FooterItemsBffUnion) => {
    let key = curr?.['__typename'] ?? '';

    switch (key) {
      case 'FooterLinks':
        const linkItems = curr?.['groups']?.reduce((acc, item) => {
          key = item?.title;
          acc[key] = { ...item, key };
          return acc;
        }, {});
        prev = { ...prev, ...linkItems };
        break;
      case 'SocialLinks':
      case 'AppLinks':
      case 'Logo':
      case 'SignupComponent':
      case 'TermsAndPrivacy':
        prev[key] = { ...curr, key };
        break;
    }
    return prev;
  };
  const result = contents.reduce(extractData, {});
  if (isCheckoutPage) {
    delete result['FooterLinks'];
    delete result['SocialLinks'];
    delete result['AppLinks'];
    delete result['SignupComponent'];
  }
  return result;
};

/*
 * Extract Meganav CMS data
 */
async function getMegaNavData(headers = {}): Promise<MegaNavChildren[]> {
  try {
    const { data: megaNavData }: MegaNavTypeRaw = await fetchDataViaGql(
      HeaderMegaNav,
      GQL_CONST._UNUSED,
      GQL_CONST._UNUSED,
      headers
    );
    return processMegaNavData(megaNavData);
  } catch (err) {
    console.error('Error occurred getMegaNavData-----', err);
    return [];
  }
}

const processMegaNavData = ({ MegaNav }): MegaNavChildren[] => {
  return MegaNav?._root?.children ?? [];
};

async function signUpForEmails(EmailSignupRequest): Promise<any> {
  const variables = {
    request: {
      ...EmailSignupRequest
    }
  };

  try {
    const { data } = await modifyDataViaGql(SignupForEmailsGql, variables);
    return data?.signupForEmails;
  } catch (error) {
    console.error('Error Occurred with signUpForEmails GQL', error);
  }
}

/*
 * Extract MegaNavMobile CMS data
 */
async function getMegaNavMobileData(headers = {}): Promise<MegaNavMobileType> {
  const gqlArguments = {
    variables: { deliveryKey: 'megaNavMobileMenu' }
  };
  try {
    const {
      data: { megaNavMobile }
    }: MegaNavMobileTypeRaw = await fetchDataViaGql(
      MegaNavMobileDrawer,
      GQL_CONST._UNUSED,
      gqlArguments,
      headers
    );
    return megaNavMobile;
  } catch (err) {
    console.error('Error occurred getMegaNavMobileData-----', err);
    return null;
  }
}

export {
  getGlobalHeaderData,
  getGlobalFooterData,
  getMegaNavData,
  getMegaNavMobileData,
  getCartCount,
  signUpForEmails
};
