import { getStoreDetails } from '@Lib/cms/storeFinder';
import { useState, useEffect } from 'react';
import { weekday } from '@Constants/storeFinderConstants';
import { contentToBreadcrumb, formatPhoneNumber, formatTime } from '@Lib/common/utility';
import { storeHours } from '@Lib/common/utility';
import styles from '@Styles/storeFinder/storeDirectoryPage.module.scss';
import detailStyles from '@Styles/storeFinder/storeDetailsPage.module.scss';
import { Directions } from '@mui/icons-material';

export default function DirectoryCity({ directoryCity }) {
  const { city, count, data, state, stateAbbr } = directoryCity;
  const numOfStores = data.length > 1 ? 'stores in' : 'store in';
  return (
    <div className={styles.city}>
      <h2 className={styles.cityHeader}>
        {data.length} {numOfStores} {city}, {state}
      </h2>
      <div className={styles.cityStores}>
        {data.map((store, index: number) => {
          return (
            <div className={styles.cityStore} key={index}>
              <div className={styles.cityStoreLabel}>
                <a
                  href={`/stores/search/${store.storeNumber}`}
                  className={styles.cityStoreLabelName}
                >
                  {store.commonName ? store.commonName : store.city}
                </a>
                <div className={styles.cityStoreLabelNumber}>(Store {store.storeNumber})</div>
              </div>

              <div className={styles.cityStoreLocation}>
                <div className={styles.cityStoreLocationAddress}>{store.streetAddress}</div>
                <div className={styles.cityStoreLocationCity}>
                  {store.city}, {store.state} {store.zipCode}
                </div>
                <div className={styles.cityStoreLocationPhone}>
                  <a href={`tel:${store.phoneNumber}`}>{formatPhoneNumber(store.phoneNumber)}</a>
                </div>
              </div>

              <div className={styles.cityStoreOpen}>
                <div className={styles.cityStoreOpenHours}>
                  {store.status === 'N' ? (
                    <span className={detailStyles.storeStatus}>{store.statusLabel}!</span>
                  ) : (
                    storeHours(store)
                  )}
                </div>
                <div className={styles.cityStoreOpenDirections}>
                  <Directions className={styles.cityStoreOpenDirectionsIcon} fontSize="small" />
                  <a
                    target="_blank"
                    className={styles.cityStoreOpenDirectionsLink}
                    href={`https://www.google.com/maps/dir/?api=1&origin=Your+Location&destination=${store.streetAddress}, ${store.city}, ${store.state} ${store.zipCode}`}
                    rel="noreferrer"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
              <div className={styles.cityStoreButtonContainer}>
                <a
                  className={styles.cityStoreButtonLink}
                  href={`/stores/search/${store.storeNumber}`}
                >
                  <button className={styles.cityStoreButton}>View details</button>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
