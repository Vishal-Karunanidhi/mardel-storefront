import { useSelector } from '@Redux/store';
import { Divider } from '@mui/material';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import GiftCardLookup from '@Components/myAccount/giftCardLookup';
import { contentToBreadcrumb } from '@Lib/common/utility';
import { defaultHomeBCrumbs } from '@Constants/generalConstants';
import GcStyles from '@Styles/giftCard.module.scss';
import DataLayer from '@Utils/DataLayer';
import { GtmDataLayer } from 'src/interfaces/gtmDataLayer';
import { getCookie } from 'cookies-next';

const gcBreadCrumbs = {
  links: [
    defaultHomeBCrumbs,
    {
      key: 'Gift Card Balance',
      label: 'Gift Card Balance',
      value: 'null',
      openInNewTab: false
    }
  ]
};

const gtmData: GtmDataLayer = {
  anonymousUserId: getCookie('hl-anon-id') ? getCookie('hl-anon-id').toString() : '',
  event: 'page_view',
  pageType: 'giftCardCheck'
};

export default function GiftCardBalance(): JSX.Element {
  const { description, email } = useSelector((state) => state.myAccount.giftCardBalanceContent);

  const GiftCardDescriptionDetail = () => {
    return (
      <span className={GcStyles.giftCardDesc}>
        <label className={GcStyles.gcHeader}>Already have a Gift Card? </label>
        <label className={GcStyles.gcBalanceTitle}>
          Check your balance to see how much you have left to spend.
        </label>
        <Divider className={GcStyles.divider} />
      </span>
    );
  };

  return (
    <>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(gcBreadCrumbs)} />
      <div className={GcStyles.parentGcWrapper}>
        <div className={GcStyles.imageContainer}>
          <GiftCardLookup isGcPage>
            <GiftCardDescriptionDetail />
          </GiftCardLookup>
        </div>
      </div>
      <DataLayer pageData={gtmData} />
    </>
  );
}
