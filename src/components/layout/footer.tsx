import { getYear, imageLoader, imageUrlQuery } from '@Lib/common/utility';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from '@Redux/store';
import { useState, useEffect, useRef } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import SignUpSubscription from './signUpSubscription';
import styles from '@Styles/layout/footer.module.scss';
import { Ga4PhoneClickDataLayer, Ga4SocialClickDataLayer } from 'src/interfaces/ga4DataLayer';

const PageEnd = styled(Paper)(({ theme }) => ({
  color: '#003087',
  backgroundColor: '#003087',
  ...theme.typography.body2,
  textAlign: 'center',
  borderRadius: '0px'
}));

const deskPhone = {
  outline: 'none',
  textDecoration: 'none',
  color: '#000000',
  fontFeatureSettings: 'normal'
};

export default function Footer(props): JSX.Element {
  const dispatch = useDispatch();
  const { pageType } = useSelector((state) => state.layout);
  const { isCheckoutPage, isWeeklyAdPage } = pageType;
  const { SocialLinks, AppLinks, Logo, TermsAndPrivacy, globalFooterCmsData } = props;
  const {
    'About Us': AboutUs,
    'Other Links': OtherLinks,
    'Customer Service': CustomerService
  } = props;

  const { defaultHost: logoHost, endpoint: logoEp, name: logoName } = Logo.image;
  const logoImageSrc = `https://${logoHost}/i/${logoEp}/${logoName}`;

  /*Rezing positioning for app-social links*/
  const customerRef = useRef();
  const socialLinkRef = useRef();
  const [appLinkTargetLeft, setAppLinkTargetLeft] = useState(40);

  useEffect(() => {
    async function getTermsAndPrivacyCmsData() {
      dispatch({
        type: 'GET_PRIVACYANDTERMS_CMS_DATA',
        payload: TermsAndPrivacy
      });
    }
    getTermsAndPrivacyCmsData();
  }, [TermsAndPrivacy, dispatch]);

  useEffect(() => {
    window.addEventListener('resize', positionAppLinks);
    positionAppLinks();
  }, []);
  function positionAppLinks() {
    let positionFromLeft = 50;
    if (customerRef?.current && socialLinkRef?.current) {
      positionFromLeft =
        customerRef.current['offsetLeft'] - socialLinkRef.current['offsetLeft'] - 212;
    }
    setAppLinkTargetLeft(positionFromLeft);
  }

  function handleFooterEvent(gtmData: Ga4PhoneClickDataLayer | Ga4SocialClickDataLayer): void {
    if (window) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  const renderFooterLinks = (footerLinks, showTitle, styleClass) => {
    if (!footerLinks) {
      return <></>;
    }
    const { key, title } = footerLinks;
    const links = footerLinks.links.map((e) => e.content).sort((a, b) => a.priority - b.priority);
    const navigationItems = links.map((e, i: number) => {
      if (e?.link === '/newsroom') {
        return (
          <li key={i}>
            <a
              className={styles.footerLinkItems}
              href='https://newsroom.hobbylobby.com/'
              target='_blank'
            >
              {'Newsroom'}
            </a>
          </li>
        );
      }
      if (e?.link === '/health-plan-transparency-files') {
        return (
          <li key={i}>
            <a
              className={styles.footerLinkItems}
              href='https://www.webtpa.com/blog'
              target='_blank'
            >
              {'Health Plan Transparency Files'}
            </a>
          </li>
        );
      }
      if (e?.link === '/careers') {
        return (
          <li key={i}>
            <a
              className={styles.footerLinkItems}
              href='https://careers.hobbylobby.com/'
              target='_blank'
            >
              <strong>{'Careers'}</strong>
            </a>
          </li>
        );
      }
      if (e?.link === '/custom-framing') {
        return (
          <li key={i}>
            <a className={styles.footerLinkItems} href='/custom-framing' target='_blank'>
              {'Custom Framing'}
            </a>
          </li>
        );
      }

      const target = e.openInDifferentTab ? '_blank' : '';
      return (
        <ListItem className={styles.footerListItem} disablePadding key={i}>
          {e.theme === 'Phone_No' ? (
            <>
              <a
                className={[styles[styleClass], styles.mobilePhoneNum].join(' ')}
                href={`tel:${e.title.replace(/-/g, '')}`}
                onClick={() =>
                  handleFooterEvent({
                    event: 'phone_click',
                    link_text: e.title,
                    link_url: `tel:${e.title.replace(/-/g, '')}`
                  } as Ga4PhoneClickDataLayer)
                }
              >
                {e.title}
              </a>
              <a
                className={[styles[styleClass], styles.desktopPhoneNum].join(' ')}
                style={deskPhone}
              >
                {e.title}
              </a>
            </>
          ) : (
            <Link href={e.link ?? '/'}>
              <a
                className={styles[styleClass]}
                target={target}
                data-testid={`footer-${e.title
                  .replace(/ /g, '-')
                  .replace(/[\?,.;:’‘”“\!]/g, '')
                  .toLowerCase()}`}
              >
                {e.title}
              </a>
            </Link>
          )}
        </ListItem>
      );
    });

    return (
      <nav aria-label={key} className={styles.responsiveSelect}>
        <div>
          {
            <List className={styles.removeFooterTitle}>
              {showTitle && (
                <ListItem sx={{ padding: 0 }}>
                  <ListItemText
                    primary={title}
                    className={[styles.footerLinkHead, styles.removeFooterTitle].join(' ')}
                  />
                </ListItem>
              )}
              {navigationItems}
            </List>
          }
          {
            <Accordion className={[styles.footerSelectBox].join(' ')} disableGutters>
              {showTitle && (
                <AccordionSummary
                  aria-controls={`panel-${title
                    .replace(/ /g, '-')
                    .replace(/[\?,.;:’‘”“\!]/g, '')
                    .toLowerCase()}-content`}
                  id={`panel-${title
                    .replace(/ /g, '-')
                    .replace(/[\?,.;:’‘”“\!]/g, '')
                    .toLowerCase()}-header`}
                  style={{ height: 55 }}
                >
                  <label>{title}</label>
                </AccordionSummary>
              )}

              <AccordionDetails className={styles.childPaddingRemove}>
                <List>{navigationItems}</List>
              </AccordionDetails>
            </Accordion>
          }
        </div>
      </nav>
    );
  };

  const renderSocialLinks = () => {
    if (!SocialLinks) {
      return <></>;
    }
    const { key } = SocialLinks;
    let links = [...SocialLinks.links];
    links.sort((a, b) => a.priority - b.priority);

    return (
      <nav aria-label={key} className={styles.socialLinkTitle}>
        <ListItemText
          primary={'Social'}
          className={styles.footerLinkHead}
          style={{ marginBottom: 10 }}
        />
        {links.map((e, i: number) => (
          <a
            href={e.link ?? '/'}
            className={styles.imageAnchor}
            key={i}
            target={e.openInSeparateTab ? '_blank' : ''}
            rel="noreferrer"
            data-testid={`footer-${e.socialType.toLowerCase()}`}
            onClick={() => {
              let domain: string;
              if (window) domain = window.origin;
              handleFooterEvent({
                event: 'social_click',
                link_domain: domain,
                link_text: e.socialType,
                link_url: e.link
              } as Ga4SocialClickDataLayer);
            }}
          >
            <img
              src={imageLoader(`/images/social/${e.socialType}.png`)}
              alt={e.socialType}
              width={47}
              height={47}
            />
          </a>
        ))}
      </nav>
    );
  };

  const renderAppLinks = () => {
    let links = AppLinks && [...AppLinks.links];
    links && links?.sort((a, b) => a.display_order - b.display_order);

    if (!links) {
      return <></>;
    }

    const applLinkStyle: React.CSSProperties = {
      display: 'flex',
      flexWrap: 'wrap',
      height: 200
    };

    return (
      <nav
        aria-label={AppLinks && AppLinks.key}
        className={styles.socialLinkTitle_}
        style={applLinkStyle}
      >
        <ListItemText
          primary={'Download our app'}
          className={styles.footerLinkHead}
          style={{ marginTop: 17, marginBottom: 0 }}
        />

        {links &&
          links.map((e) => {
            const isApple = e.title === 'IOS';
            const { defaultHost: appHost, endpoint: appEp, name: appName } = e.image ?? {};
            const height = isApple ? 56 : 59;
            const width = isApple ? 153 : 182;
            return (
              <Link href={e.app_url ?? ''} key={e.title}>
                <a
                  target="_blank"
                  className={styles.appLinkAnchor}
                  style={{ height }}
                  data-testid={`footer-${e.title.replace(/ /g, '-').toLowerCase()}`}
                >
                  <img
                    src={imageUrlQuery(`https://${appHost}/i/${appEp}/${appName}`, width, height)}
                    alt={e.title}
                    width={isApple ? 153 : 182}
                    height={height}
                  />
                </a>
              </Link>
            );
          })}
      </nav>
    );
  };

  return (
    <>
      {!isWeeklyAdPage && (
        <footer
          style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#EDEDED' }}
          className={!(isCheckoutPage || !isWeeklyAdPage) ? 'marginFramingShort' : ''}
        >
          {!(isCheckoutPage || isWeeklyAdPage) && (
            <>
              <SignUpSubscription {...globalFooterCmsData?.SignupComponent} />
              <div className={styles.footer}>
                <div className={styles.footerCard}>
                  {renderFooterLinks(OtherLinks, false, 'footerLinkHead')}
                </div>

                <div className={styles.footerCard} ref={customerRef}>
                  {renderFooterLinks(CustomerService, true, 'footerLinkItems')}
                </div>

                <div className={styles.footerCard}>
                  {renderFooterLinks(AboutUs, true, 'footerLinkItems')}
                </div>

                <div
                  className={[styles.footerCard, styles.removeApplinkTablet].join(' ')}
                  style={{ width: 210, height: 400 }}
                >
                  {renderSocialLinks()}
                  {renderAppLinks()}
                </div>
              </div>

              <div
                className={[styles.footer, styles.showApplinkTablet].join(' ')}
                style={{ paddingTop: 15 }}
              >
                <div className={styles.footerCard} style={{ width: 210 }} ref={socialLinkRef}>
                  {renderSocialLinks()}
                </div>
                <div
                  className={styles.footerCard}
                  style={{ width: 250, marginTop: -19, marginLeft: `${appLinkTargetLeft}px` }}
                >
                  {renderAppLinks()}
                </div>
                <div className={styles.footerCard} style={{ width: 250 }} />
              </div>
            </>
          )}

          {(isCheckoutPage || isWeeklyAdPage) && (
            <PageEnd style={{ height: 1, marginBottom: 22 }}>.</PageEnd>
          )}

          <div
            className={
              isCheckoutPage || isWeeklyAdPage
                ? styles.checkoutLogoPrivacyCard
                : styles.logoPrivacyCard
            }
          >
            <span className={styles.logoImg}>
              <Link href={Logo?.imageLink?.value ?? ''} passHref>
                <a
                  target={Logo.imageLink.openInNewTab ? '_blank' : '_self'}
                  data-testid={'footer-hobbylobby-image'}
                >
                  <img
                    src={logoImageSrc}
                    alt={Logo.altText}
                    width={isCheckoutPage || isWeeklyAdPage ? 271 : 300}
                    height={isCheckoutPage || isWeeklyAdPage ? 27 : 30}
                    style={{ cursor: 'pointer' }}
                  />
                </a>
              </Link>
            </span>
            <span
              className={
                isCheckoutPage || isWeeklyAdPage ? styles.checkoutPrivacyTerms : styles.privacyTerms
              }
            >
              <span className={styles.privacyShow}>© {getYear()} Hobby Lobby</span>
              <span className={styles.privacyHide}>{' | '}</span>
              <span className={styles.privacyShow}>
                <a className="cookie-preferences optanon-toggle-display cookie-settings-button">
                  Do Not Sell or Share My Personal Information
                </a>
              </span>
              <span className={styles.privacyHide}>{' | '}</span>
              <span className={styles.privacyShow}>
                <Link href={TermsAndPrivacy.link.value} passHref replace>
                  <a
                    target={TermsAndPrivacy.link.openInNewTab ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    data-testid={'footer-terms-privacy'}
                  >
                    {TermsAndPrivacy.link.label}
                  </a>
                </Link>
              </span>
            </span>
          </div>
          <PageEnd>.</PageEnd>
        </footer>
      )}
    </>
  );
}
