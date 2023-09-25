import { useEffect, useState } from 'react';
import ImageWithFallback from '@Components/common/imageWithFallback';
import HLAnchorTag from '@Components/common/hlAnchorTag';
import { getErrorPageData } from '@Lib/cms/errorPage';
import errorPageStyles from '@Styles/errorPage/errorPage.module.scss';
import DataLayer from '@Utils/DataLayer';
import { ErrorGtmDataLayer } from 'src/interfaces/gtmDataLayer';
import { useDispatch } from '@Redux/store';
import { spinnerStart, spinnerEnd } from '@Utils/spinnerUtil';
import { getCookie } from 'cookies-next';
import MyAccountStyles from '@Styles/my-account/myAccount.module.scss';

export default function ErrorPage({ errorCode }: any): JSX.Element {
  const dispatch = useDispatch();
  const [errorPageData, setErrorPageData] = useState(null);
  const [showAnchorTag, setShowAnchorTag] = useState(false);
  const gtmData: ErrorGtmDataLayer = {
    anonymousUserId: getCookie('hl-anon-id') ? getCookie('hl-anon-id').toString() : '',
    errorType: '',
    event: 'page_view',
    pageType: 'error'
  };

  useEffect(() => {
    (async () => {
      const getErrorPage = await getErrorPageData(errorCode);
      dispatch(spinnerEnd);
      setErrorPageData(getErrorPage);
    })();

    if (errorCode === '404') {
      setShowAnchorTag(true);
    }
    dispatch(spinnerStart);
  }, []);

  if (errorCode !== null && errorCode !== undefined) {
    gtmData.errorType = errorCode;
  }

  if (!errorPageData) {
    return <div className={MyAccountStyles.divIsInitialLoading} />;
  }

  return (
    <>
      <div className={errorPageStyles.errorPageContainer}>
        <div className={errorPageStyles.imageContainer}>
          <ImageWithFallback
            src={errorPageData?.errorImage?.image?.url}
            layout="fixed"
            className={errorPageStyles.image}
          />
        </div>
        <div className={errorPageStyles.textContainer}>
          <span className={errorPageStyles.headline}>{errorPageData?.headline}</span>
          <span className={errorPageStyles.strapline}>
            {errorPageData?.strapline}
            {showAnchorTag && (
              <HLAnchorTag
                anchorTheme="LinkType2"
                label={errorPageData?.link?.title}
                value={errorPageData?.link?.url}
              />
            )}
          </span>
        </div>
      </div>
      <DataLayer pageData={gtmData} />
    </>
  );
}
