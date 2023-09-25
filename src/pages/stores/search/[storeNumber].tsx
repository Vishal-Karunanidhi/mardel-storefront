import { useState, useEffect, useRef } from 'react';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { GetServerSidePropsResult } from 'next';
import { LocalBusinessJsonLd } from 'next-seo';
import styles from '@Styles/storeFinder/storeDetailsPage.module.scss';
import Slider from '@Components/slider/slider';
import DepartmentCard from '@Components/slider/cards/departmentCard';
import NearbyStoresMobile from '@Components/storeDetails/nearbyStoresMobile';
import {
  formatPhoneNumber,
  formatHolidayHoursDate,
  imageURL,
  imageLoader
} from '@Lib/common/utility';
import { states } from '@Constants/storeFinderConstants';
import { getStoreDetails, getStoresLatLong } from '@Lib/cms/storeFinder';
import { getStoreDetailsContent } from '@Lib/cms/storeDetails';
import {
  Directions,
  LocationOn,
  Phone,
  StoreMallDirectoryOutlined,
  ArrowDropUp,
  ArrowDropDown,
  InfoOutlined
} from '@mui/icons-material';
import ShareButton from '@Components/common/shareButton';
import { weekday } from '@Constants/storeFinderConstants';
import { useRouter } from 'next/router';
import { Ga4DataLayer } from 'src/interfaces/ga4DataLayer';
import { useSelector } from '@Redux/store';

type Dimensions = {
  width: number;
  height: number;
};

type Holiday = {
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  legend: string;
};

export default function StoreDetails({
  storeDetails,
  nearbyStores,
  content,
  currentStore,
  hostUrl
}) {
  const router = useRouter();
  const {
    careersHeader,
    careersImage,
    careersLink,
    careersText,
    dealsPromotions,
    dealsAndPromotionsText,
    dealsAndPromotionsLink,
    departmentsHeader,
    departmentList,
    holidayHours,
    nearbyStores: nearbyStoresHeader,
    storeDescription,
    storeTemplate1,
    storeTemplate2,
    storeTemplate3,
    storeTemplate4,
    storeTemplate5
  } = content;

  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};

  const [mapSectionDimensions, setMapSectionDimensions] = useState<Dimensions>({
    width: 1,
    height: 1
  });
  const [richTextContainerDimensions, setRichTextContainerDimensions] = useState<Dimensions>({
    width: 1,
    height: 1
  });
  const [showMore, setShowMore] = useState<boolean>(false);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  const mapRef = useRef<any>();
  const richTextRef = useRef<any>();
  const richTextContainerRef = useRef<any>();
  const aboutColumnRef = useRef<any>();

  const currentDate: Date = new Date();

  const setDimensions = () => {
    if (mapRef.current) {
      setMapSectionDimensions({
        width: mapRef?.current?.offsetWidth,
        height: mapRef?.current?.offsetHeight
      });
    }
    if (richTextContainerRef.current) {
      setRichTextContainerDimensions({
        width: richTextContainerRef?.current?.offsetWidth,
        height: richTextContainerRef?.current?.offsetHeight
      });
    }
  };

  const templatePicker = (): string => {
    const storeNumber = storeDetails.data.storeNumber;
    const remainder = storeNumber % 5;
    if (remainder === 4) {
      return storeTemplate5;
    } else if (remainder === 3) {
      return storeTemplate4;
    } else if (remainder === 2) {
      return storeTemplate3;
    } else if (remainder === 1) {
      return storeTemplate2;
    } else {
      return storeTemplate1;
    }
  };

  const storeJsonLdData = {
    type: 'Store',
    id: 'https://www.hobbylobby.com',
    name: storeDetails.data.displayName ? storeDetails.data.displayName : 'Hobby Lobby Store',
    description: null,
    url: hostUrl ? `https://${hostUrl}${router?.asPath?.split('?')?.[0]}` : 'null',
    telephone: storeDetails.data.phoneNumber,
    address: {
      streetAddress: storeDetails.data.streetAddress,
      addressLocality: storeDetails.data.city,
      addressRegion: storeDetails.data.state,
      postalCode: storeDetails.data.zipCode,
      addressCountry: 'US'
    },
    geo: {
      latitude: storeDetails.data.latitude,
      longitude: storeDetails.data.longitude
    },
    images: [
      'https://imgprd19.hobbylobby.com/sys-master/migrated/hbc/h78/h00/9714481922078/HLLogo_RGB_286x33.png'
    ],
    openingHours: storeDetails.data.thisWeek.hours.map((storeHours) => ({
      dayOfWeek: storeHours.day,
      opens: storeHours.startTime,
      closes: storeHours.endTime
    }))
  };

  useEffect(() => {
    window.addEventListener('resize', setDimensions);
    setDimensions();
    return () => {
      window.removeEventListener('resize', setDimensions);
    };
  }, []);

  useEffect(() => {
    setDimensions();
  }, [showMore]);

  useEffect(() => {
    if (storeDetails) {
      storeDetails.data.thisWeek.hours.forEach((date) => {
        if (date.legend && holidays.length < 2) {
          setHolidays([...holidays, date]);
        }
      });
      storeDetails.data.nextWeek.hours.forEach((date) => {
        if (date.legend && holidays.length < 2) {
          setHolidays([...holidays, date]);
        }
      });
    }
  }, [storeDetails]);

  function handleGetDirections(): void {
    if (window) {
      let gtmData: Ga4DataLayer = {
        anonymous_user_id: '',
        event: 'get_store_directions',
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
    <>
      <Breadcrumb
        breadCrumbs={[
          {
            __typename: 'Breadcrumb',
            name: 'Home',
            key: '/',
            slug: '/',
            openInNewTab: false
          },
          {
            __typename: 'Breadcrumb',
            name: 'Store Finder',
            key: '/stores/search',
            slug: '/stores/search',
            openInNewTab: false
          },
          {
            __typename: 'Breadcrumb',
            name: states[storeDetails.data.state],
            key: `/stores?state=${storeDetails.data.state}`,
            slug: `/stores?state=${storeDetails.data.state}`,
            openInNewTab: false
          },
          {
            __typename: 'Breadcrumb',
            name: storeDetails.data.city,
            key: `/stores?state=${storeDetails.data.state}&city=${storeDetails.data.city}`,
            slug: `/stores?state=${storeDetails.data.state}&city=${storeDetails.data.city}`,
            openInNewTab: false
          },
          {
            __typename: 'Breadcrumb',
            name: storeDetails.data.streetAddress,
            key: '/stores',
            slug: '/stores',
            openInNewTab: false
          }
        ]}
        optionalHeader={
          storeDetails.data.commonName ? storeDetails.data.commonName : storeDetails.data.city
        }
        optionalSubheader={`Store ${storeDetails.data.storeNumber}`}
      />
      <LocalBusinessJsonLd {...storeJsonLdData} />
      {storeDetails.data.statusLabel === 'Temporarily Closed' && (
        <div className={styles.detailPageAlert}>
          <div className={styles.detailPageAlertIcon}>
            <InfoOutlined />
          </div>
          <span className={styles.detailPageAlertText}>THIS STORE IS TEMPORARILY CLOSED</span>
        </div>
      )}

      <div className={styles.detailPage}>
        <div className={styles.infoAndMap}>
          <div className={styles.storeInfo}>
            {storeDetails.data.status === 'N' && (
              <small className={styles.storeStatus}>{storeDetails.data.statusLabel}!</small>
            )}
            <h3 className={styles.storeInfoAddressHeader}>Address</h3>
            <div className={styles.storeInfoAddress}>
              <p className={styles.storeInfoAddressStreet}>{storeDetails.data.streetAddress}</p>
              <p className={styles.storeInfoAddressCity}>
                {storeDetails.data.city}, {storeDetails.data.state} {storeDetails.data.zipCode}
              </p>
            </div>
            {currentStore && (
              <p className={styles.storeInfoDistance}>
                {currentStore.distance} miles from Current Location
              </p>
            )}

            <a
              className={styles.storeInfoButtonDirectionsAnchor}
              data-testid="store-directions"
              href={`https://www.google.com/maps/dir/?api=1&origin=Your+Location&destination=${storeDetails.data.streetAddress}, ${storeDetails.data.city}, ${storeDetails.data.state} ${storeDetails.data.zipCode}`}
              onClick={handleGetDirections}
              rel="noreferrer"
              target="_blank"
            >
              <button type="button" className={styles.storeInfoButtonDirections}>
                Get directions
              </button>
            </a>
            <div className={styles.storeInfoPhoneNumberContainer}>
              <a
                href={`tel:${storeDetails.data.phoneNumber}`}
                className={styles.storeInfoPhoneNumber}
                data-testid="store-phone"
              >
                <Phone fontSize="small" style={{ marginRight: 11 }} />
                {formatPhoneNumber(storeDetails.data.phoneNumber)}
              </a>
            </div>

            {storeDetails.data.status === 'A' && (
              <>
                <h3 className={styles.storeInfoHoursHeader}>Store hours</h3>
                <div className={styles.storeInfoHours}>
                  <ul className={styles.storeInfoHoursList}>
                    {storeDetails.data.thisWeek.hours.map((date: any, index: number) => {
                      return (
                        <li key={index}>
                          <span
                            className={
                              date.day === weekday[currentDate.getDay()]
                                ? styles.storeInfoHoursTextHighlight
                                : styles.storeInfoHoursText
                            }
                          >
                            {date.day}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <ul className={styles.storeInfoHoursList}>
                    {storeDetails.data.thisWeek.hours.map((date: any, index: number) => {
                      return (
                        <li key={index}>
                          <span
                            className={
                              date.day === weekday[currentDate.getDay()]
                                ? styles.storeInfoHoursTextHighlight
                                : styles.storeInfoHoursText
                            }
                          >
                            {date.startTime} {date.endTime && '-'} {date.endTime}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
            <div className={styles.storeInfoShareFollowContainer}>
              <ShareButton
                shareType="Store"
                header={storeDetails?.data?.streetAddress}
                subHeader={`Store ${storeDetails?.data?.storeNumber}`}
                className={styles.shareButton}
                dataTestId="store-share-button"
              />
              <div>
                <h3 className={styles.storeInfoFollowUs}>Follow us</h3>
                <div className={styles.storeInfoSocialMedia}>
                  <a
                    className={styles.storeInfoSocialMediaIcon}
                    data-testid="store-facebook-page-link"
                    href="https://www.facebook.com/HobbyLobby"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <img alt="Share on Facebook" src={imageLoader('/images/social/Facebook.png')} />
                  </a>
                  <a
                    className={styles.storeInfoSocialMediaIcon}
                    data-testid="store-instagram-page-link"
                    href="https://www.instagram.com/hobbylobby/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <img
                      alt="Share on Instagram"
                      src={imageLoader('/images/social/Instagram.png')}
                    />
                  </a>
                  <a
                    className={styles.storeInfoSocialMediaIcon}
                    data-testid="store-twitter-page-link"
                    href="https://twitter.com/HobbyLobby"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <img alt="Share on Twitter" src={imageLoader('/images/social/Twitter.png')} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div ref={mapRef} className={styles.storeMap}>
            <img
              alt="Map to store"
              src={`https://maps.googleapis.com/maps/api/staticmap?markers=color:red|${storeDetails.data.latitude},${storeDetails.data.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&size=${mapSectionDimensions.width}x600`}
            />
          </div>
        </div>

        <NearbyStoresMobile
          nearbyStores={nearbyStores}
          weekday={weekday}
          currentDate={currentDate}
        />

        <div className={styles.nearbyStores}>
          <h3 className={styles.nearbyStoresHeader}>
            <StoreMallDirectoryOutlined
              className={styles.nearbyStoresHeaderIcon}
              fontSize="large"
            />
            {nearbyStoresHeader}
          </h3>

          <div className={styles.nearbyStoresContainer}>
            {nearbyStores.data.slice(1, 5).map((store: any, index: number) => {
              const {
                streetAddress,
                status,
                statusLabel,
                city,
                state,
                commonName,
                zipCode,
                distance,
                phoneNumber,
                storeNumber
              } = store;
              const { startTime, endTime } = store.thisWeek.hours.find(
                (date) => date.day === weekday[currentDate.getDay()]
              );
              return (
                <div key={index} className={styles.nearbyStoresInfo}>
                  <div className={styles.nearbyStoresInfoName}>
                    {commonName ? commonName : city}
                  </div>
                  <div className={styles.nearbyStoresInfoHours}>
                    {status === 'N' ? (
                      <span className={styles.storeStatus}>{statusLabel}!</span>
                    ) : startTime === 'Closed' || !endTime ? (
                      'Closed'
                    ) : (
                      `Open Today till ${endTime}`
                    )}
                  </div>
                  <div className={styles.nearbyStoresInfoAddress}>
                    <div className={styles.nearbyStoresInfoAddressStreet}>{streetAddress}</div>
                    <div
                      className={styles.nearbyStoresInfoAddressCity}
                    >{`${city}, ${state} ${zipCode}`}</div>
                  </div>
                  <div className={styles.nearbyStoresInfoDistance}>
                    <LocationOn className={styles.nearbyStoresInfoDistanceIcon} />
                    <span
                      className={styles.nearbyStoresInfoDistanceMiles}
                    >{`${distance} miles`}</span>
                  </div>
                  <a
                    className={styles.nearbyStoresInfoDirectionsLink}
                    data-testid={`store-${store.storeNumber}-directions`}
                    href={`https://www.google.com/maps/dir/?api=1&origin=Your+Location&destination=${streetAddress}, ${city}, ${state} ${zipCode}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Directions />
                    <span className={styles.nearbyStoresInfoDirections}>Get directions</span>
                  </a>
                  <a
                    className={styles.nearbyStoresInfoPhone}
                    href={`tel:${phoneNumber}`}
                    data-testid={`store-${store.storeNumber}-phone`}
                  >
                    <Phone className={styles.nearbyStoresInfoPhoneIcon} />
                    <span className={styles.nearbyStoresInfoPhoneNumber}>
                      {formatPhoneNumber(phoneNumber)}
                    </span>
                  </a>
                  <a
                    className={styles.nearbyStoresInfoDetailsLink}
                    href={`/stores/search/${storeNumber}`}
                  >
                    <button
                      className={styles.nearbyStoresInfoDetails}
                      data-testid={`store-${store.storeNumber}-details`}
                    >
                      View details
                    </button>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.extraInfoSection}>
          <div className={styles.extraInfoSectionColumnOne}>
            {holidays.length > 0 && (
              <div className={styles.extraInfoSectionHoliday}>
                <h2 className={styles.extraInfoSectionHolidayHeader}>{holidayHours}</h2>

                <div className={styles.extraInfoSectionHolidayStatusContainer}>
                  {holidays.map((holiday, index: number) => {
                    return (
                      <div className={styles.extraInfoSectionHolidayStatus} key={index}>
                        <h3 className={styles.extraInfoSectionHolidayStatusHeader}>
                          {holiday.legend}
                        </h3>
                        <span>{`${holiday.day} ${formatHolidayHoursDate(holiday.date)}`}</span>
                        <span>
                          {holiday.startTime === 'Closed' || !holiday.endTime
                            ? 'Closed'
                            : `${holiday.startTime} - ${holiday.endTime}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.extraInfoSectionDeals}>
              <h3
                style={{ marginTop: holidays.length > 0 ? 24 : 35 }}
                className={styles.extraInfoSectionDealsHeader}
              >
                {dealsPromotions}
              </h3>
              <p className={styles.extraInfoSectionDealsText}>{dealsAndPromotionsText}</p>
              <a
                target={dealsAndPromotionsLink.openTab && '_blank'}
                className={styles.extraInfoSectionDealsLink}
                href={dealsAndPromotionsLink.url}
                data-testid="deals-promotions-link"
              >
                <button className={styles.extraInfoSectionDealsButton}>
                  {dealsAndPromotionsLink.title}
                </button>
              </a>
            </div>
          </div>

          <div ref={aboutColumnRef} className={styles.extraInfoSectionColumnTwo}>
            <h3 className={styles.extraInfoSectionAboutHeader}>
              {storeDescription.replace(
                /{store name}/g,
                storeDetails.data.commonName ? storeDetails.data.commonName : storeDetails.data.city
              )}
            </h3>
            <div
              style={{
                maxHeight: showMore ? '100%' : '364px'
              }}
              ref={richTextRef}
              className={
                richTextContainerDimensions.height >= 362
                  ? styles.extraInfoSectionAboutText
                  : styles.extraInfoSectionAboutTextNoBorder
              }
            >
              {richTextContainerDimensions.height >= 362 && (
                <>
                  {!showMore && <div className={styles.extraInfoSectionAboutFade}></div>}
                  <span
                    onClick={() => setShowMore(!showMore)}
                    className={styles.extraInfoSectionAboutSeeMore}
                  >
                    {showMore ? 'SEE LESS' : 'SEE MORE'}
                    {showMore ? (
                      <ArrowDropUp fontSize="large" />
                    ) : (
                      <ArrowDropDown fontSize="large" />
                    )}
                  </span>
                </>
              )}

              <div
                style={{ paddingBottom: showMore ? 15 : 0 }}
                ref={richTextContainerRef}
                className={styles.extraInfoSectionAboutTextContainer}
              >
                {templatePicker().replace(
                  /{store name}/g,
                  storeDetails.data.commonName
                    ? storeDetails.data.commonName
                    : storeDetails.data.city
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.careerSection}>
          <div className={styles.careerSectionImageContainer}>
            <img
              alt="Careers at Hobby Lobby"
              src={imageURL(careersImage.defaultHost, careersImage.endpoint, careersImage.name)}
              className={styles.careerSectionImage}
            />
          </div>
          <div className={styles.careerSectionInfoContainer}>
            <div className={styles.careerSectionInfo}>
              <h3 className={styles.careerSectionInfoHeader}>{careersHeader}</h3>
              <p className={styles.careerSectionInfoText}>{careersText}</p>
              <a
                target={careersLink.openTab && '_blank'}
                className={styles.careerSectionInfoLink}
                href={careersLink.url}
                data-testid="careers-link"
              >
                <button className={styles.careerSectionInfoButton}>{careersLink.title}</button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.departmentSection}>
        <h3 className={styles.departmentSectionHeader}>{departmentsHeader}</h3>
        <Slider arrowPosition={'40%'} sliderTitle={departmentsHeader}>
          {departmentList.Cards.map((card: any, index: number) => {
            return (
              <DepartmentCard
                image={card?.media?.image?.url}
                imageAltText={card?.imageAltText}
                key={index}
                link={card?.link}
                title={card?.title}
              />
            );
          })}
        </Slider>
      </div>
    </>
  );
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<any>> {
  const { req, res, query, resolvedUrl } = context;

  let storeDetails;
  let nearbyStores;
  let searchedLocation;
  let content;

  if (query) {
    if (query.storeNumber) {
      storeDetails = await getStoreDetails(Number(query.storeNumber));
    }
    if (storeDetails?.getStoreDetails) {
      nearbyStores = await getStoresLatLong(
        storeDetails?.getStoreDetails?.data?.latitude,
        storeDetails?.getStoreDetails?.data?.longitude
      );
    }
    if (query.lat && query.long) {
      searchedLocation = await getStoresLatLong(Number(query.lat), Number(query.long));
    }
  }

  content = await getStoreDetailsContent('store-details');

  let currentStore = null;

  if (searchedLocation) {
    currentStore = searchedLocation.getStoresLatLong.data.find((store: any) => {
      return Number(store.storeNumber) === Number(query.storeNumber);
    });
  }

  let hostUrl = null;
  if (context.req) {
    hostUrl = context.req.headers.host;
  }

  return {
    props: {
      storeDetails: storeDetails?.getStoreDetails,
      nearbyStores: nearbyStores?.getStoresLatLong,
      content: content?.getStoreDetailsContent,
      currentStore: currentStore,
      hostUrl: hostUrl
    }
  };
}
