import client, { fetchDataViaGql, modifyDataViaGql } from '@Graphql/client';
import GQL_CONST from '@Constants/gqlConstants';
import getStoreDetailsQuery from '@Graphql/queries/storeFinder/getStoreDetails.graphql';
import getStoreDirectoryQuery from '@Graphql/queries/storeFinder/getStoreDirectory.graphql';
import getStoreDirectoryStateQuery from '@Graphql/queries/storeFinder/getStoreDirectoryState.graphql';
import getStoreDirectoryCityQuery from '@Graphql/queries/storeFinder/getStoreDirectoryCity.graphql';
import getStoresLatLongQuery from '@Graphql/queries/storeFinder/getStoresLatLong.graphql';
import getStoresSearchQuery from '@Graphql/queries/storeFinder/getStoresSearch.graphql';
import getStoreFinderPageQuery from '@Graphql/queries/storeFinder/getStoreFinderPage.graphql';

export const getStoreDetails = async (storeNumber: number) => {
  const gqlArguments = {
    variables: {
      storeNumber
    }
  };
  try {
    const { data } = await fetchDataViaGql(getStoreDetailsQuery, GQL_CONST._UNUSED, gqlArguments);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getStoreDirectory = async () => {
  try {
    const { data } = await fetchDataViaGql(getStoreDirectoryQuery, GQL_CONST._UNUSED);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getStoreDirectoryState = async (state: string) => {
  const gqlArguments = {
    variables: {
      state
    }
  };
  try {
    const { data } = await fetchDataViaGql(
      getStoreDirectoryStateQuery,
      GQL_CONST._UNUSED,
      gqlArguments
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getStoreDirectoryCity = async (state: string, city: string) => {
  const gqlArguments = {
    variables: {
      state,
      city
    }
  };
  try {
    const { data } = await fetchDataViaGql(
      getStoreDirectoryCityQuery,
      GQL_CONST._UNUSED,
      gqlArguments
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getStoresLatLong = async (lat: number, long: number) => {
  const gqlArguments = {
    variables: {
      lat,
      long
    }
  };
  try {
    const { data } = await fetchDataViaGql(getStoresLatLongQuery, GQL_CONST._UNUSED, gqlArguments);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getStoresSearch = async (location: string) => {
  const gqlArguments = {
    variables: {
      location
    }
  };
  try {
    const { data } = await fetchDataViaGql(getStoresSearchQuery, GQL_CONST._UNUSED, gqlArguments);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getStoreFinderPage = async (deliveryKey: string) => {
  const gqlArguments = {
    variables: {
      deliveryKey
    }
  };
  try {
    const response = await fetchDataViaGql(
      getStoreFinderPageQuery,
      GQL_CONST._UNUSED,
      gqlArguments
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
