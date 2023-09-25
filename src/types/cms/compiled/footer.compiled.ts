import * as Shared from '../../shared';
import {
    FooterLinks,
    SocialLinks,
    AppLinks,
    TermsAndPrivacy,
    SignupComponent,
} from '../schema/footer.schema';

type FormattedFooterItems = {
    [ItemName: string]: (FooterLinks | SocialLinks | AppLinks | TermsAndPrivacy | SignupComponent | Shared.Logo) | {
        key?: string
        __typename?: string
    };
}

type FooterTypeCompiled = FormattedFooterItems & {
    key?: string
    __typename?: string
}

export type {
    FooterTypeCompiled
}