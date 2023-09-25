import HLTextField from '@Components/common/hlTextField';
import { useSelector } from '@Redux/store';
import styles from '@Styles/storeFinder/storeSearchPage.module.scss';
import { MyLocationOutlined } from '@mui/icons-material';
import { Ga4FindStoreByLocatorDataLayer } from 'src/interfaces/ga4DataLayer';


export default function FindStores({
  searchText,
  storeResults = undefined,
  submittedSearchText,
  onSubmit,
  locationOnClick,
  handleInputChange,
  // totalStores,
  className,
  headerClassName,
  searchButtonClassName,
  buttonClassName,
  formClassName,
  mapDimensions
}) {
  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};

  function processLocationOnClick() {
    location.href = '/stores/search?q=my location';
    if (window) {
      let gtmData: Ga4FindStoreByLocatorDataLayer = {
        anonymous_user_id: '',
        event: 'find_stores_by_locator',
        search_results: 0,
        search_term: '',
        user_id: ''
      };

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  return (
    <div className={className}>
      <h2 className={headerClassName}>
        {storeResults ? (
          <>
            Showing search results for Hobby Lobby stores near{' '}
            <strong>{submittedSearchText}</strong>
          </>
        ) : (
          <>Find a Hobby Lobby Store by ZIP Code, City or State</>
        )}
      </h2>
      <form method="post" action={`/stores/search?q=${searchText}`} className={formClassName}>
        <div className={styles.useMyLocation}>
          <MyLocationOutlined />{' '}
          <span
            className={styles.useMyLocationText}
            onClick={processLocationOnClick}
            data-testid="use-my-location-button"
          >
            Use my current location
          </span>
        </div>
        <div className={styles.searchSection}>
          <HLTextField
            textFieldType="location"
            textFieldValue={searchText}
            handleInputChange={(e) => handleInputChange(e.target.value)}
            onBlur={() =>
              searchText &&
              mapDimensions?.width === 0 &&
              (location.href = `/stores/search?q=${searchText}`)
            }
            labelName="Zip or City and State"
            inputProps={{
              'data-testid': 'store-search-input'
            }}
          />
          <button
            type={'submit'}
            className={searchButtonClassName}
            data-testid={'findstore-search'}
          >
            Search
          </button>
        </div>
      </form>
      {/* total stores will be added back at a later date */}
      <a href="/stores" className={buttonClassName} data-testid="view-all-stores-link">
        View all stores
      </a>
    </div>
  );
}
