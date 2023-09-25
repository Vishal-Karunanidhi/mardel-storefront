import * as Shared from '../../shared';
import {
  FooterLinks,
  SocialLinks,
  AppLinks,
  TermsAndPrivacy,
  SignupComponent
} from '../schema/footer.schema';

/*Type definitions to export for Declarations*/
type FooterItemsBffUnion =
  | FooterLinks
  | SocialLinks
  | AppLinks
  | Shared.Logo
  | TermsAndPrivacy
  | SignupComponent
  | Shared.UNKNOWN;

type FooterTypeFromBff = {
  __typename: String;
  _meta: Shared.Meta;
  contents: [FooterItemsBffUnion];
};

type FooterTypeRaw = {
  data: {
    globalFooterContent: FooterTypeFromBff;
  };
};

export type { FooterItemsBffUnion, FooterTypeFromBff, FooterTypeRaw };
