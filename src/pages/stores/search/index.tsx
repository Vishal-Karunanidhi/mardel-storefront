import { useState, useEffect, useRef } from 'react';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { GetServerSideProps } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  contentToBreadcrumb,
  formatDataTestId,
  formatPhoneNumber,
  storeHours
} from '@Lib/common/utility';
import {
  // getStoreDirectory,
  getStoreFinderPage,
  getStoresLatLong,
  getStoresSearch
} from '@Lib/cms/storeFinder';
import { Directions } from '@mui/icons-material';
import LocationIcon from '@Icons/storeFinder/locationIcon';
import styles from '@Styles/storeFinder/storeSearchPage.module.scss';
import detailStyles from '@Styles/storeFinder/storeDetailsPage.module.scss';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import StoreFinderMap from '@Components/storeFinder/googleMap';
import CircularProgress from '@mui/material/CircularProgress';
import FindStores from '@Components/storeFinder/findStore';
import StoreFinderContent from '@Components/storeFinder/contentSection';
import { Ga4DataLayer } from 'src/interfaces/ga4DataLayer';
import { useSelector } from '@Redux/store';

export default function StoreSearch({
  breadcrumbs,
  header,
  image,
  richText,
  // directory,
  searchResults,
  query
}) {
  const [submittedSearchText, setSubmittedSearchText] = useState<string>(query || '');
  const [searchText, setSearchText] = useState<string>(query || '');
  const [storeResults, setStoreResults] = useState<any>(searchResults);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [spinnerActive, setSpinnerActive] = useState<boolean>(false);
  const [showStaticMap, setShowStaticMap] = useState<boolean>(true);
  const [mapDimensions, setMapDimensions] = useState<any>({ width: 1, height: 1 });
  const [breadcrumbsAndLocation, setBreadcrumbsAndLocation] = useState<any>();
  const [centerPoint, setCenterPoint] = useState<any>(searchResults?.centerpoint || {});

  const mapRef = useRef<any>();

  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};

  // const totalStores = directory.reduce((a, b) => a + b.count, 0);

  const variants = {
    animate: {
      yield: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      y: -30,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const searchStores = async (e) => {
    e.preventDefault();
    if (searchText.length > 0) {
      setShowStaticMap(false);
      setSpinnerActive(true);
      const stores = await getStoresSearch(searchText);
      setCenterPoint(stores.getStoresSearch.centerpoint);
      if (!stores.getStoresSearch) {
        setSnackbarOpen(true);
        setSpinnerActive(false);
      } else {
        setStoreResults(stores.getStoresSearch);
        setSubmittedSearchText(searchText);
        setSpinnerActive(false);
      }
      if (window) {
        let gtmData: Ga4DataLayer = {
          anonymous_user_id: '',
          event: 'find_stores_near_me',
          user_id: ''
        };

        if (sessionId) {
          isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(gtmData);
      }
    } else {
      setSnackbarOpen(true);
    }
  };

  const getCurrentLocation = async (e?) => {
    setSpinnerActive(true);
    navigator?.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(position);
        setSpinnerActive(false);
        setShowStaticMap(false);
      },
      (error) => {
        if (error) {
          setSnackbarOpen(true);
          setSpinnerActive(false);
          setShowStaticMap(true);
        }
      }
    );
  };

  const currentLocationStores = async (lat, long) => {
    const stores = await getStoresLatLong(lat, long);
    setCenterPoint(stores.getStoresLatLong.centerpoint);
    setStoreResults(stores.getStoresLatLong);
    setSubmittedSearchText('your location');
  };

  const configureMapDimensions = () => {
    if (mapRef.current) {
      setMapDimensions({
        width: mapRef.current.offsetWidth,
        height: mapRef.current.offsetHeight
      });
    }
  };

  useEffect(() => {
    const convertBreadcrumbs = contentToBreadcrumb(breadcrumbs);
    if (submittedSearchText) {
      convertBreadcrumbs[convertBreadcrumbs.length - 1].name += ' : ' + submittedSearchText;
    }
    setBreadcrumbsAndLocation(convertBreadcrumbs);
  }, [submittedSearchText]);

  useEffect(() => {
    if (storeResults) {
      setShowStaticMap(false);
    }
  }, [storeResults]);

  useEffect(() => {
    if (currentLocation) {
      currentLocationStores(currentLocation.coords.latitude, currentLocation.coords.longitude);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (query === 'my location') {
      getCurrentLocation();
    }
  }, [query]);

  useEffect(() => {
    window.addEventListener('resize', configureMapDimensions);
    configureMapDimensions();
    return () => {
      window.removeEventListener('resize', configureMapDimensions);
    };
  }, []);

  return (
    <div className={styles.page}>
      <Breadcrumb breadCrumbs={breadcrumbsAndLocation} optionalHeader={header} />
      <div className={styles.content}>
        <div className={styles.searchAndMapSection}>
          {spinnerActive && (
            <CircularProgress
              style={{
                zIndex: '99999',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}

          <FindStores
            searchText={searchText}
            storeResults={storeResults}
            submittedSearchText={submittedSearchText}
            onSubmit={searchStores}
            locationOnClick={getCurrentLocation}
            handleInputChange={setSearchText}
            // totalStores={totalStores}
            className={styles.findStore}
            headerClassName={styles.findStoreHeader}
            searchButtonClassName={styles.searchButtonClassName}
            buttonClassName={styles.storeFinderButton}
            formClassName={styles.findStoreForm}
            mapDimensions={mapDimensions}
          />

          {showStaticMap ? (
            <div ref={mapRef} className={styles.staticMap}>
              <img
                alt="map"
                className={styles.staticMapImage}
                src={`https://maps.googleapis.com/maps/api/staticmap?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&center=Oklahoma City,OK&zoom=7&size=${mapDimensions.width}x461`}
              />
            </div>
          ) : (
            <StoreFinderMap storesData={storeResults} />
          )}
        </div>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <MuiAlert severity="error" sx={{ width: '100%' }}>
            We are unable to determine your search request. Please check your spelling and try
            again.
          </MuiAlert>
        </Snackbar>

        <AnimatePresence>
          {storeResults && (
            <motion.div
              variants={variants}
              initial={{ opacity: 0, y: -30 }}
              animate="animate"
              exit="exit"
              className={styles.storeResultsListContainer}
            >
              <h3 className={styles.storeResultsHeader}>
                {storeResults.data.length} Hobby Lobby Stores Near {submittedSearchText}
              </h3>
              <ul className={styles.storeResultsList}>
                {storeResults.data.map((store, index) => {
                  return (
                    <li className={styles.storeResultsListItem} key={index}>
                      <div className={styles.storeResultsListItemDistance}>
                        <div className={styles.storeResultsListItemDistanceAndIcon}>
                          <LocationIcon number={index + 1} />
                          <span className={styles.storeResultsListItemDistanceText}>
                            {store.distance} miles
                          </span>
                        </div>
                      </div>

                      <div className={styles.storeResultsListItemGroupedInfo}>
                        <div className={styles.storeResultsListItemNumber}>
                          <a
                            href={`/stores/search/${store.storeNumber}?lat=${centerPoint.lat}&long=${centerPoint.lng}`}
                            className={styles.storeResultsListItemNumberStreet}
                            data-testid={`${formatDataTestId(store.city)}-store-${
                              store.storeNumber
                            }`}
                          >
                            {store.commonName ? store.commonName : store.city}
                          </a>
                          <div>{`(Store ${store.storeNumber})`}</div>
                        </div>
                        <div className={styles.storeResultsListItemAddress}>
                          <div>{store.streetAddress}</div>
                          <div>{`${store.city}, ${store.state} ${store.zipCode}`}</div>
                          <a
                            className={styles.storeResultsListItemAddressPhone}
                            href={`tel:${store.phoneNumber}`}
                            data-testid={`${formatDataTestId(store.city)}-store-${
                              store.storeNumber
                            }-phone`}
                          >
                            {formatPhoneNumber(store.phoneNumber)}
                          </a>
                        </div>
                        <div className={styles.storeResultsListItemHours}>
                          <div className={styles.cityStoreOpenHours}>
                            {store.status === 'N' ? (
                              <span className={detailStyles.storeStatus}>{store.statusLabel}!</span>
                            ) : (
                              storeHours(store)
                            )}
                          </div>
                          <div className={styles.storeResultsListItemHoursDirectionsIcon}>
                            <Directions fontSize="small" />
                            <a
                              target="_blank"
                              className={styles.storeResultsListItemHoursDirections}
                              href={`https://www.google.com/maps/dir/?api=1&origin=Your+Location&destination=${store.streetAddress}, ${store.city}, ${store.state} ${store.zipCode}`}
                              rel="noreferrer"
                              data-testid={`${formatDataTestId(store.city)}-store-${
                                store.storeNumber
                              }-directions`}
                            >
                              Get Directions
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className={styles.storeResultsListItemButtonContainer}>
                        <a
                          href={`/stores/search/${store.storeNumber}?lat=${centerPoint.lat}&long=${centerPoint.lng}`}
                          data-testid={`${formatDataTestId(store.city)}-store-${
                            store.storeNumber
                          }-details`}
                        >
                          <button className={styles.storeResultsListItemButton}>
                            View details
                          </button>
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <StoreFinderContent image={image} richText={richText} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const response = await getStoreFinderPage('store-finder');

  // const directory = await getStoreDirectory();
  let stores = null;

  if (query.q && typeof query.q === 'string') {
    stores = await getStoresSearch(query.q);
  }

  return {
    props: {
      breadcrumbs: response.getStoreFinderPage.breadcrumbs,
      header: response.getStoreFinderPage.header,
      image: response.getStoreFinderPage.image,
      richText: response.getStoreFinderPage.richText,
      // directory: directory.getStoreDirectory.directory this will be added back at a later date,
      searchResults: stores?.getStoresSearch || null,
      query: query.q || null
    }
  };
};
