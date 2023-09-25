import { getYear } from '@Lib/common/utility';
import { GlobalState } from '@Types/globalState';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from '@Redux/store';
import { useState, KeyboardEvent, MouseEvent, Fragment } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import DehazeIcon from '@mui/icons-material/Dehaze';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import MegaNavCard from './megaNavCard';
import MegaNavCarousel from './megaNavCarousel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import styles from '@Styles/layout/header.module.scss';

type Anchor = 'top' | 'left' | 'bottom' | 'right';
const anchor: Anchor = 'left';

// Component inline Material styling using 'sx' prop is a shortcut for defining custom style
const componentMaterialStyle = {
  accordion: {
    accordionBox: {
      '&.MuiAccordion-root.Mui-expanded': {
        borderRadius: '0px'
      },
      '&.MuiAccordionSummary-root.Mui-expanded': {
        minHeight: '40px'
      }
    }
  }
};

const PageEnd = styled(Paper)(({ theme }) => ({
  color: '#003087',
  backgroundColor: '#003087',
  ...theme.typography.body2,
  textAlign: 'center',
  borderRadius: '0px'
}));

export default function MegaNavDrawer(props): JSX.Element {
  const dispatch = useDispatch();
  const { megaNavData, megaNavMobileData, globalFooterCmsData } = props;
  const { accordionBox } = componentMaterialStyle.accordion;
  const [state, setState] = useState({ left: false });

  const TermsAndPrivacy = globalFooterCmsData?.TermsAndPrivacy;

  const { isLoggedInUser } = useSelector((state: GlobalState) => state?.auth?.heartBeatInfo);

  // Sets the URL for the "My Lists" entry in the top navigation section of the MegaNav drawer
  const myListsURL = () => {
    if (isLoggedInUser) {
      return megaNavMobileData.topNavigationList.tNLMyLists.myListsLIURL;
    } else {
      return megaNavMobileData.topNavigationList.tNLMyLists.myListsGURL;
    }
  };

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: KeyboardEvent | MouseEvent) => {
    const { type } = event;
    const keyName = (event as KeyboardEvent).key;
    dispatch({
      type: 'BOOT_MEGA_NAV',
      payload: open
    });
    if (type === 'keydown' && (keyName === 'Tab' || keyName === 'Shift' || keyName === 'Enter')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <Box role="presentation" onKeyDown={toggleDrawer(anchor, false)} className={styles.drawerBox}>
      <Stack style={{ background: '#fff' }}>
        <PageEnd style={{ height: 32 }}>
          <CloseIcon
            aria-label="Close Menu"
            style={{
              float: 'right',
              color: '#FFFFFF',
              margin: '6px 20px 6px 0px',
              width: 20,
              height: 20,
              cursor: 'pointer'
            }}
            onClick={toggleDrawer(anchor, false)}
          />
        </PageEnd>
        <Divider />

        {megaNavMobileData != null && Object.keys(megaNavMobileData).length != 0 && (
          <>
            <Grid item style={{ padding: '12px 24px 12px 25px' }}>
              <Link href={megaNavMobileData.signInButton.signInButtonURL} passHref>
                <Button variant="contained" disableRipple className={styles.signInButton}>
                  {megaNavMobileData.signInButton.signInButtonText}
                </Button>
              </Link>

              <Link href={megaNavMobileData.createAccountButton.createAccountButtonURL} passHref>
                <a className={styles.createAccount}>
                  {megaNavMobileData.createAccountButton.createAccountButtonText}
                </a>
              </Link>
            </Grid>
            <Divider />
            <ul className={styles.topNavigationList}>
              <li className={styles.tNLCart}>
                <Link href={megaNavMobileData.topNavigationList.tNLCart.myCartURL} passHref>
                  <a onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
                    {megaNavMobileData.topNavigationList.tNLCart.myCartText}
                  </a>
                </Link>
              </li>
              <li className={styles.tNLMyLists}>
                <Link href={myListsURL()} passHref>
                  <a onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
                    {megaNavMobileData.topNavigationList.tNLMyLists.myListsText}
                  </a>
                </Link>
              </li>
              <li className={styles.tNLMyAccount}>
                <Link href={megaNavMobileData.topNavigationList.tNLMyAccount.myAccountURL} passHref>
                  <a onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
                    {megaNavMobileData.topNavigationList.tNLMyAccount.myAccountText}
                  </a>
                </Link>
              </li>
              <li className={styles.tNLStoreFinder}>
                <Link
                  href={megaNavMobileData.topNavigationList.tNLStoreFinder.myStoreFinderURL}
                  passHref
                >
                  <a onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
                    {megaNavMobileData.topNavigationList.tNLStoreFinder.myStoreFinderText}
                  </a>
                </Link>
              </li>
            </ul>
          </>
        )}
        <Divider />

        {megaNavData.map((root, i: number) => {
          const { theme, label } = root;
          if (theme === 'MegaNav-CTA') return null;
          return (
            <Fragment key={i}>
              <Grid item style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                <Accordion sx={accordionBox} elevation={0}>
                  <AccordionSummary
                    sx={accordionBox}
                    expandIcon={<ArrowDropDownIcon style={{ color: '#000000' }} />}
                    aria-controls="MegaNav-Items"
                    id={label}
                    style={{ height: 1, background: '#fff', paddingLeft: 25 }}
                  >
                    <label className={styles.accordLabel}>{label}</label>
                  </AccordionSummary>

                  <AccordionDetails style={{ padding: 0 }}>
                    <span className={styles.megaNavFlexCard}>
                      <MegaNavCard isFromDrawer {...root}></MegaNavCard>
                    </span>
                    <span className={styles.megaNavCarousel}>
                      <MegaNavCarousel {...root}></MegaNavCarousel>
                    </span>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Divider />
            </Fragment>
          );
        })}

        {megaNavMobileData != null && Object.keys(megaNavMobileData).length != 0 && (
          <ul className={styles.footerItemGrid}>
            {megaNavMobileData.bottomNavigationList.map((e, i: number) => (
              <Fragment key={i}>
                {e.bNLURL && (
                  <li className={styles.cardLinkLabel}>
                    <Link href={e.bNLURL} passHref>
                      <a
                        onClick={toggleDrawer(anchor, false)}
                        onKeyDown={toggleDrawer(anchor, false)}
                      >
                        {e.bNLText}
                      </a>
                    </Link>
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
        )}

        <Grid item className={styles.footerLogoGrid}>
          <PageEnd className={`${styles.drawerBox} ${styles.blueBorderBox}`}>
            <span style={{ margin: 'auto' }}>
              {globalFooterCmsData?.SocialLinks?.links?.map((e, i: number) => (
                <Fragment key={i}>
                  {e.socialType && (
                    <Link href={e.link ?? '/'} passHref>
                      <a
                        className={styles.imageAnchor}
                        data-testid={`megaNavDrawer-${e.socialType.toLowerCase()}`}
                        rel="noreferrer"
                        target={'_blank'}
                      >
                        <img
                          src={`/icons/social/${e.socialType.toLowerCase()}.svg`}
                          alt={e.socialType}
                          width={15}
                          height={15}
                        />
                      </a>
                    </Link>
                  )}
                </Fragment>
              ))}
            </span>
            <span style={{ margin: 'auto' }}>
              <img
                src={'/icons/hl_logo_white.svg'}
                alt={'Hobby Lobby test'}
                width={100}
                height={10}
              />
            </span>
            <span style={{ margin: 'auto', color: '#fff' }}>
              <a
                href={TermsAndPrivacy.link.value}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.privacyTerms}
              >
                © {getYear()} Hobby Lobby | {TermsAndPrivacy.link.label}
              </a>
            </span>
          </PageEnd>
        </Grid>
      </Stack>
    </Box>
  );

  return (
    <>
      <IconButton
        aria-label="Open Menu"
        size="large"
        className={styles.breadCrumbsButton}
        disableRipple
        onClick={toggleDrawer(anchor, true)}
      >
        <DehazeIcon fontSize="inherit" />
      </IconButton>
      <Drawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
        className={styles.menuDrawer}
      >
        {list(anchor)}
      </Drawer>
    </>
  );
}
