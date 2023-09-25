import { Divider } from '@mui/material';
import { sideNavData } from '@Constants/my-account/loginDetailsConstants';

import MyAccountStyles from '@Styles/my-account/myAccount.module.scss';

export default function DesktopAccountSideNav(props): JSX.Element {
  return (
    <div className={MyAccountStyles.sideNavMain}>
      {sideNavData?.map((navData, index) => (
        <div className={MyAccountStyles.sideNavSub} key={index}>
          <label className={MyAccountStyles.navHeader}>{navData?.navHeader}</label>
          {navData?.children?.map(({ navLabel, key, svgIcon }) => {
            const path = props?.currentMenu === key ? 'selected' : 'normal';
            return (
              <div
                className={MyAccountStyles.sideNavImageLabel}
                onClick={() => props.handleMenuChange(key)}
                key={key}
              >
                <img
                  alt={navLabel}
                  aria-hidden="true"
                  height={20}
                  src={`icons/account/${path}/${svgIcon}.svg`}
                  width={20}
                />
                <label
                  className={
                    key === props?.currentMenu
                      ? MyAccountStyles.loginsideNavLabel
                      : MyAccountStyles.sideNavLabel
                  }
                >
                  {navLabel}
                </label>
              </div>
            );
          })}
          {index !== sideNavData?.length - 1 && (
            <Divider className={MyAccountStyles.sideNavDivider} />
          )}
        </div>
      ))}
    </div>
  );
}
