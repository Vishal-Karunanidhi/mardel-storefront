import * as Shared from '../../shared';

/*Part1: Footer Link comprises 3 sections - Others, CustomerService, Aboutus*/
type FooterLinks = {
    groups: [FooterLinkGroup]
}
type FooterLinkGroup = {
    groupName: String
    title: String
    links: [FooterLink]
}
type FooterLink = {
    content: FooterLinkContent
}
type FooterLinkContent = {
    _meta: Shared.Meta
    priority: Number
    theme: String
    type: String
    boldText: Boolean
    title: String
    link: String
    openInDifferentTab: Boolean
}

/*Part2: Social Networking Link currently 6 different channels like fb, insta...*/
type SocialLinks = {
    _meta: Shared.Meta
    theme: String
    links: [SocialLink]
}
type SocialLink = {
    _meta: Shared.Meta
    socialType: String
    priority: Number
    link: String
    openInSeparateTab: Boolean
}

/*Part3: AppPlay stores Links*/
type AppLinks = {
    _meta: Shared.Meta
    links: [AppLink]
}
type AppLink = {
    image: MediaImage
    title: String
    app_url: String
}

/*Part5: Social Networking Link currently 6 different channels like fb, insta...*/
type TermsAndPrivacy = {
    _meta: Shared.Meta
    link: Shared.LinkWithLabel
}

/*Part6: Subscription box for Signup*/
type SignupComponent = {
    _meta: Shared.Meta
    description: String
    button: String
    successMessageHeading: String
    successMessage: String
    errorMessageHeading: String
    errorMessage: String
}


export type {
    FooterLinks,
    SocialLinks,
    AppLinks,
    TermsAndPrivacy,
    SignupComponent,
}