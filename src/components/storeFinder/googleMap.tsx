import { useMemo, useState, useEffect, useCallback } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { formatPhoneNumber } from '@Lib/common/utility';

import styles from '@Styles/storeFinder/storeSearchPage.module.scss';
import Link from 'next/link';

export default function StoreFinderMap({ storesData }) {
  const { isLoaded, loadError, url } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map storesData={storesData} />;
}

function Map({ storesData }) {
  const [selectedStore, setSelectedStore] = useState(null);
  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => setMap(map), []);

  const center = useMemo(
    () => ({
      lat: storesData?.centerpoint?.lat || 35.4676,
      lng: storesData?.centerpoint?.lng || -97.5164
    }),
    [storesData?.centerpoint]
  );

  useEffect(() => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      storesData?.data.map((marker) => {
        bounds.extend({
          lat: marker.latitude,
          lng: marker.longitude
        });
      });
      map.fitBounds(bounds);
    }
  }, [map, storesData?.data]);

  return (
    <GoogleMap onLoad={onLoad} zoom={8} center={center} mapContainerClassName={styles.map}>
      {storesData?.data.map((store, index) => {
        return (
          <MarkerF
            label={{ text: `${index + 1}`, color: 'white' }}
            key={index}
            position={{ lat: store.latitude, lng: store.longitude }}
            onClick={() => {
              setSelectedStore(store);
            }}
          >
            {selectedStore && selectedStore.streetAddress === store.streetAddress && (
              <InfoWindowF
                onCloseClick={() => setSelectedStore(null)}
                position={{ lat: selectedStore.latitude, lng: selectedStore.longitude }}
              >
                <div className={styles.infoWindow} style={{ lineHeight: '25px' }}>
                  <div className={styles.infoWindowStreet}>
                    <b>{store.streetAddress}</b>
                  </div>
                  <div className={styles.infoWindowAddress}>
                    {`${store.city}, ${store.state} ${store.zipCode}`}
                  </div>
                  <div className={styles.infoWindowPhone}>
                    <a href={`tel:${store.phoneNumber}`}>{formatPhoneNumber(store.phoneNumber)}</a>
                  </div>
                  <Link href={`/stores/search/${store.storeNumber}`}>
                    <a className={styles.infoWindowDetails}>Store details</a>
                  </Link>
                </div>
              </InfoWindowF>
            )}
          </MarkerF>
        );
      })}
    </GoogleMap>
  );
}
