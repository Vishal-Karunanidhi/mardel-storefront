import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { sideNavData } from '@Constants/my-account/loginDetailsConstants';
import MobileNavStyles from '@Styles/account/mobileNavAccordion.module.scss';

const mobileNavData = sideNavData.flatMap((e) => e.children);

export default function MobileNavAccordion(props): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const accordionHeaderData = mobileNavData?.find(({ key }) => key === props?.currentMenu);

  const handleSideNavClickAway = () => {
    setExpanded(false);
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleSideNavClickAway}>
        <Accordion className={MobileNavStyles.loginDetailsMobileSection} expanded={expanded}>
          <AccordionSummary
            expandIcon={
              !expanded && (
                <>
                  {' '}
                  <ArrowDropDownIcon />
                </>
              )
            }
            aria-controls="accountNavAccordion"
            id="accountNavAccordion"
            onClick={() => setExpanded((prev) => !prev)}
          >
            <>
              <span className={MobileNavStyles.loginDetailsSummary}>
                <img
                  alt={accordionHeaderData?.navLabel}
                  aria-hidden="true"
                  height={20}
                  src={`icons/account/selected/${accordionHeaderData?.svgIcon}.svg`}
                  width={20}
                />
                <label className={MobileNavStyles.loginDetailsLabel}>{props?.currentMenu}</label>
              </span>
              {!expanded && <label className={MobileNavStyles.accordionIconLabel}>Account</label>}
            </>
          </AccordionSummary>

          {/* We need to use this AccordionDetails component When developing Mobile sideNav */}
          <AccordionDetails>
            {mobileNavData?.map(({ navLabel, key, svgIcon }) => {
              if (key === props?.currentMenu) return null;
              return (
                <div
                  key={key}
                  className={MobileNavStyles.sideNavImageLabel}
                  onClick={() => {
                    props.handleMenuChange(key);
                    setExpanded(false);
                  }}
                >
                  <img
                    alt={navLabel}
                    aria-hidden="true"
                    height={20}
                    src={`icons/account/normal/${svgIcon}.svg`}
                    width={20}
                  />
                  <label
                    className={
                      key === props?.currentMenu
                        ? MobileNavStyles.loginsideNavLabel
                        : MobileNavStyles.sideNavLabel
                    }
                  >
                    {navLabel}
                  </label>
                </div>
              );
            })}
          </AccordionDetails>
        </Accordion>
      </ClickAwayListener>
    </>
  );
}
