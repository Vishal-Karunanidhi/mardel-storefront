import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '@Styles/storeFinder/storeDetailsPage.module.scss';
import { Directions, LocationOn, Phone, StoreMallDirectoryOutlined } from '@mui/icons-material';
import { formatPhoneNumber, formatStreet } from '@Lib/common/utility';

export default function NearbyStoresMobile({ nearbyStores, weekday, currentDate }) {
  return (
    <div className={styles.nearbyStoresMobile}>
      <Accordion sx={{ border: 'none', boxShadow: 'none', margin: '0px' }}>
        <AccordionSummary
          style={{ padding: 0, margin: 0 }}
          sx={{ margin: '0px' }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panella-content"
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StoreMallDirectoryOutlined
              className={styles.nearbyStoresHeaderIcon}
              fontSize="large"
            />
            <h3 style={{ margin: 0 }} className={styles.nearbyStoresHeader}>
              Nearby stores
            </h3>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: '0px 0px 35px 0px' }}>
          <div className={styles.nearbyStoresContainer}>
            {nearbyStores.data.slice(1, 5).map((store, index: number) => {
              const {
                streetAddress,
                city,
                state,
                zipCode,
                distance,
                phoneNumber,
                storeNumber,
                commonName
              } = store;
              const { startTime, endTime } = store.thisWeek.hours.find(
                (date) => date.day === weekday[currentDate.getDay()]
              );
              return (
                <div style={{ display: 'flex' }} key={index}>
                  <div className={styles.nearbyStoresInfoDistanceMobile}>
                    <LocationOn
                      style={{ fontSize: 46 }}
                      fontSize="large"
                      className={styles.nearbyStoresInfoDistanceMobileIcon}
                    />
                    <span
                      className={styles.nearbyStoresInfoDistanceMobileMiles}
                    >{`${distance} miles`}</span>
                  </div>
                  <div key={index} className={styles.nearbyStoresInfo}>
                    <a
                      href={`/stores/search/${storeNumber}`}
                      className={styles.nearbyStoresInfoName}
                    >
                      {commonName ? commonName : city}
                    </a>
                    <div className={styles.nearbyStoresInfoHours}>
                      {startTime === 'Closed' || !endTime ? 'Closed' : `Open Today till ${endTime}`}
                    </div>
                    <div className={styles.nearbyStoresInfoAddress}>
                      <div className={styles.nearbyStoresInfoAddressStreet}>{streetAddress}</div>
                      <div
                        className={styles.nearbyStoresInfoAddressCity}
                      >{`${city}, ${state} ${zipCode}`}</div>
                    </div>
                    <a
                      className={styles.nearbyStoresInfoDirectionsLink}
                      rel="noreferrer"
                      target="_blank"
                      href={`https://www.google.com/maps/dir/?api=1&origin=Your+Location&destination=${streetAddress}, ${city}, ${state} ${zipCode}`}
                    >
                      <Directions />
                      <span className={styles.nearbyStoresInfoDirections}>Get directions</span>
                    </a>
                    <a
                      style={{ marginBottom: 0 }}
                      className={styles.nearbyStoresInfoPhone}
                      href={`tel:${phoneNumber}`}
                    >
                      <Phone className={styles.nearbyStoresInfoPhoneIcon} />
                      <span className={styles.nearbyStoresInfoPhoneNumber}>
                        {formatPhoneNumber(phoneNumber)}
                      </span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
