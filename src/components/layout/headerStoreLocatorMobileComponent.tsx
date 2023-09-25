import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import HLTextField from '@Components/common/hlTextField';
import Divider from '@mui/material/Divider';
import HeaderSignUpMobileCompStyles from '@Styles/layout/headerSignUpMobileComp.module.scss';
import HeaderStoreLocatorStyles from '@Styles/layout/headerStoreLocator.module.scss';
import { MyLocationOutlined } from '@mui/icons-material';

import styles from '@Styles/layout/headerStoreLocator.module.scss';
import { formatPhoneNumber, storeHours } from '@Lib/common/utility';
import { useState } from 'react';

export default function HeaderStoreLocatorMobileComponent(props) {
  const { handleStoreLocatorCloseModal, storeData } = props;

  const StoreData = () => {
    const [searchText, setSearchText] = useState('');

    return (
      <div>
        <div className={styles.popoverContent}>
          <h1 className={styles.popoverContentHeader}>
            {storeData.commonName || storeData.city}
            {` (Store ${storeData.storeNumber})`}
          </h1>
          <div className={styles.popoverContentHours}>{storeHours(storeData)}</div>
          <div>
            <div className={styles.popoverContentInfo}>
              <div className={styles.popoverContentInfoAddress}>
                <div>{storeData.streetAddress}</div>
                <div>{`${storeData.city}, ${storeData.state} ${storeData.zipCode}`}</div>
                <a
                  className={styles.popoverContentInfoAddressPhone}
                  href={`tel:${storeData.phoneNumber}`}
                >
                  {formatPhoneNumber(storeData.phoneNumber)}
                </a>
              </div>
            </div>
            <div className={styles.popoverContentStoreDetails}>
              <a
                className={styles.popoverContentStoreDetailsLink}
                href={`/stores/search/${storeData.storeNumber}`}
              >
                View store details
              </a>
            </div>
            <a
              className={styles.mobileGetDirectionsLink}
              target="_blank"
              href={`https://www.google.com/maps/dir/?api=1&origin=Your+Location&destination=${storeData.streetAddress}, ${storeData.city}, ${storeData.state} ${storeData.zipCode}`}
            >
              <button className={styles.mobileGetDirections}>Get Directions</button>
            </a>
          </div>
        </div>
        <Divider />
        <div className={styles.popoverContent}>
          <p className={styles.popoverContentDescription}>
            We have hundreds of Hobby Lobby stores across the US. Find the one closest to you!
          </p>
          <HLTextField
            onBlur={(e) => {
              if (e.target.value) {
                location.href = `/stores/search?q=${searchText}`;
              }
            }}
            textFieldValue={searchText}
            handleInputChange={(e) => setSearchText(e.target.value)}
            labelName="ZIP or City/State"
            textFieldType="location"
            locationOnClick={() => (location.href = '/stores/search?q=my location')}
          />
        </div>
      </div>
    );
  };

  const NoStoreData = () => {
    const [searchText, setSearchText] = useState('');

    return (
      <div className={styles.mobileContainer}>
        <h2 className={HeaderStoreLocatorStyles.mobileHeader}>Find your store</h2>
        <p className={HeaderStoreLocatorStyles.mobileDescription}>
          We have hundreds of Hobby Lobby stores across the US. Find the one closest to you!
        </p>
        <HLTextField
          onBlur={(e) => {
            if (e.target.value) {
              location.href = `/stores/search?q=${searchText}`;
            }
          }}
          textFieldValue={searchText}
          handleInputChange={(e) => setSearchText(e.target.value)}
          labelName={'Zip code or city/state'}
        />
        <a
          href="/stores/search?q=my location"
          className={styles.popoverContentLocation + ' ' + styles.mobilePopoverContentLocation}
        >
          <MyLocationOutlined fontSize="small" />{' '}
          <span className={styles.popoverContentLocationText}>Use my current location</span>
        </a>
        <button className={styles.mobileButton}>Search</button>
      </div>
    );
  };

  return (
    <div className={HeaderSignUpMobileCompStyles.headerSignUpMobile}>
      <div className={HeaderSignUpMobileCompStyles.modalHeaderSection}>
        <IconButton
          className={HeaderSignUpMobileCompStyles.iconButton}
          onClick={handleStoreLocatorCloseModal}
        >
          <CloseIcon className={HeaderSignUpMobileCompStyles.icon} />
        </IconButton>
      </div>
      {storeData ? <StoreData /> : <NoStoreData />}
    </div>
  );
}
