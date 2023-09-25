import {
  getStoreDirectory,
  getStoreFinderPage,
  getStoreDirectoryState,
  getStoreDirectoryCity
} from '@Lib/cms/storeFinder';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import StoreFinderContent from '@Components/storeFinder/contentSection';
import FindStores from '@Components/storeFinder/findStore';
import { GetServerSidePropsResult } from 'next';
import DirectoryAllLocations from '@Components/storeDirectory/allLocations';
import DirectoryState from '@Components/storeDirectory/state';
import DirectoryCity from '@Components/storeDirectory/city';
import styles from '@Styles/storeFinder/storeDirectoryPage.module.scss';

export default function StoreDirectory({
  breadcrumbs,
  header,
  image,
  richText,
  directory,
  directoryState,
  directoryCity,
  query
}) {
  const directoryBreadcrumbs = [
    {
      __typename: 'Breadcrumb',
      name: 'Home',
      key: '/',
      slug: '/',
      openInNewTab: false
    },
    {
      __typename: 'Breadcrumb',
      name: 'Store Directory',
      key: '/stores/',
      slug: '/stores/',
      openInNewTab: false
    }
  ];

  if (query.state && !query.city) {
    directoryBreadcrumbs.push({
      __typename: 'Breadcrumb',
      name: query.state ? directoryState?.state : 'All Locations',
      key: query.state ? `/stores?state=${directoryState?.stateAbbr}` : '/',
      slug: query.state ? `/stores?state=${directoryState?.stateAbbr}` : '/',
      openInNewTab: false
    });
  }

  if (query.city) {
    directoryBreadcrumbs.push({
      __typename: 'Breadcrumb',
      name: query.state ? directoryCity?.state : 'All Locations',
      key: query.state ? `/stores?state=${directoryCity?.stateAbbr}` : '/',
      slug: query.state ? `/stores?state=${directoryCity?.stateAbbr}` : '/',
      openInNewTab: false
    });
    directoryBreadcrumbs.push({
      __typename: 'Breadcrumb',
      name: query.city,
      key: '/stores',
      slug: '/stores',
      openInNewTab: false
    });
  }

  const optionalHeader = () => {
    if (query.state && query.city) {
      return `Hobby Lobby Stores in ${query.city}, ${directoryCity?.state}`;
    } else if (query.state) {
      return `Hobby Lobby Stores in ${directoryState?.state}`;
    } else {
      return 'All Hobby Lobby Locations';
    }
  };

  return (
    <>
      <Breadcrumb breadCrumbs={directoryBreadcrumbs} optionalHeader={optionalHeader()} />
      <div className={styles.storeDirectoryPage}>
        {query.state && query.city ? (
          <DirectoryCity directoryCity={directoryCity} />
        ) : query.state ? (
          <DirectoryState directoryState={directoryState} />
        ) : (
          <DirectoryAllLocations directory={directory} />
        )}
        <StoreFinderContent image={image} richText={richText} />
      </div>
    </>
  );
}

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<any>> {
  const { req, res, query, resolvedUrl } = context;
  const response = await getStoreFinderPage('store-finder');
  let storeDirectoryCity;
  let storeDirectoryState;
  let directory;

  if (!query.state && !query.city) {
    directory = await getStoreDirectory();
  }

  if (query.state && !query.city) {
    const directoryState = await getStoreDirectoryState(query.state);
    storeDirectoryState = directoryState?.getStoreDirectoryState;
  }

  if (query.state && query.city) {
    const directoryCity = await getStoreDirectoryCity(query.state, query.city);
    if (directoryCity?.getStoreDirectoryCity?.count > 0) {
      storeDirectoryCity = directoryCity?.getStoreDirectoryCity;
    }
  }

  return {
    props: {
      breadcrumbs: response.getStoreFinderPage.breadcrumbs,
      header: response.getStoreFinderPage.header,
      image: response.getStoreFinderPage.image,
      richText: response.getStoreFinderPage.richText,
      directory: directory?.getStoreDirectory?.directory || null,
      directoryState: storeDirectoryState || null,
      directoryCity: storeDirectoryCity || null,
      query
    }
  };
}
