import { useState, useEffect, useRef } from 'react';
import HLTextField from '@Components/common/hlTextField';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { LocationOnOutlined, MyLocationOutlined } from '@mui/icons-material';
import { formatPhoneNumber, storeHours } from '@Lib/common/utility';

import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

import HeaderSignUpStyles from '@Styles/layout/headerAccountSignup.module.scss';
import styles from '@Styles/layout/headerStoreLocator.module.scss';

export default function HeaderStoreLocator(props) {
  const { storeData, cookie } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // This reads the common name of the store,
  // strips the city prefix (e.g., Oklahoma City - ) if possible,
  // and returns a string of the mall or street referenced in the common name
  // (e.g., Westgate Marketplace) to match the Figma design
  const storeDataCommonName = storeData?.commonName?.split(/[-]+/).pop();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  //if there is store data in the store location cookie then this will display
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
              <a
                className={styles.popoverContentInfoButtonLink}
                target="_blank"
                href={`https://www.google.com/maps/dir/?api=1&origin=Your+Location&destination=${storeData.streetAddress}, ${storeData.city}, ${storeData.state} ${storeData.zipCode}`}
                rel="noreferrer"
              >
                <button className={styles.popoverContentInfoButton}>Get Directions</button>
              </a>
            </div>
            <div className={styles.popoverContentStoreDetails}>
              <a
                className={styles.popoverContentStoreDetailsLink}
                href={`/stores/search/${storeData.storeNumber}`}
              >
                View store details
              </a>
            </div>
          </div>
        </div>
        <Divider />
        <div className={styles.popoverContent}>
          <p className={styles.popoverContentDescription}>
            We have hundreds of Hobby Lobby stores across the US. Find the one closest to you!
          </p>
          <form method="post" action={`/stores/search?q=${searchText}`}>
            <HLTextField
              textFieldValue={searchText}
              handleInputChange={(e) => setSearchText(e.target.value)}
              labelName="ZIP or City/State"
              textFieldType="location"
              locationOnClick={() => (location.href = '/stores/search?q=my location')}
            />
          </form>
        </div>
      </div>
    );
  };

  //If there is no data in the store location cookie this will display
  const NoStoreData = () => {
    const [searchText, setSearchText] = useState('');

    return (
      <div className={styles.popoverContent}>
        <h2 className={styles.popoverContentHeader}>Find your store</h2>
        <p className={styles.popoverContentDescription}>
          We have hundreds of Hobby Lobby stores across the US. Find the one closest to you!
        </p>
        <form
          className={styles.popoverContentSearch}
          method="post"
          action={`/stores/search?q=${searchText}`}
        >
          <HLTextField
            textFieldValue={searchText}
            handleInputChange={(e) => setSearchText(e.target.value)}
            labelName={'Zip code or city/state'}
            inputProps={{
              'data-testid': 'findstore-search-textfield'
            }}
          />
          <button
            type={'submit'}
            className={styles.popoverContentSearchButton}
            data-testid={'findstore-search'}
          >
            Search
          </button>
        </form>
        <a
          href="/stores/search?q=my location"
          className={styles.popoverContentLocation}
          data-testid={'findstore-my-location'}
        >
          <MyLocationOutlined />{' '}
          <span className={styles.popoverContentLocationText}>Use my current location</span>
        </a>
      </div>
    );
  };

  const StoreLocatorPopover = () => {
    return (
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{
          className: styles.popoverPaper
        }}
      >
        <div className={styles.popover}>
          <div className={styles.popoverTop}>
            <IconButton onClick={handleClose} data-testid="find-store-close">
              <CloseIcon className={styles.popoverTopIcon} fontSize="small" />
            </IconButton>
          </div>
          {storeData ? <StoreData /> : <NoStoreData />}
        </div>
      </Popover>
    );
  };

  return (
    <div className={styles.headerStoreLocator}>
      <div className={HeaderSignUpStyles.headerAccountMain}>
        <span className={HeaderSignUpStyles.accountIcon}>
          <LocationOnOutlined />
        </span>
        <span className={HeaderSignUpStyles.accountSelectBox}>
          <span className={HeaderSignUpStyles.signUpSaveLabel}>
            {(storeData && <>{storeDataCommonName || storeData?.city}</>) || (
              <>Find a store near you</>
            )}
          </span>
          <div className={HeaderSignUpStyles.emailAccountWrapper}>
            <span
              aria-describedby={id}
              aria-label="store locator modal toggle"
              className={HeaderSignUpStyles.modalToggle}
              data-testid="store-locator-modal"
              onClick={handleClick}
            >
              <span className={HeaderSignUpStyles.emailAccountLabel}>Find a store</span>
              <IconButton className={HeaderSignUpStyles.arrowButton} disableRipple>
                <ArrowDropDownOutlinedIcon className={HeaderSignUpStyles.arrowIcon} />
              </IconButton>
            </span>
            {StoreLocatorPopover()}
          </div>
        </span>
      </div>
    </div>
  );
}
