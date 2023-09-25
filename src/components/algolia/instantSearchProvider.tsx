import { getAlgoliaEnvProps } from '@Lib/common/utility';
import { UiState } from 'instantsearch.js';
import {
  InstantSearch,
  InstantSearchServerState,
  InstantSearchSSRProvider
} from 'react-instantsearch-hooks-web';
import { createInstantSearchRouterNext } from 'react-instantsearch-hooks-router-nextjs';
import singletonRouter from 'next/router';

type Props = {
  children: JSX.Element[];
  serverState?: InstantSearchServerState;
  url: string;
};

export default function InstantSearchProvider({ children, serverState, url }: Props) {
  const { indexName, searchClient } = getAlgoliaEnvProps();
  const routing = {
    router: createInstantSearchRouterNext({
      singletonRouter,
      serverUrl: url
    }),
    stateMapping: {
      stateToRoute(uiState: UiState): any {
        const indexUiState = uiState[indexName] || {};
        return {
          page: indexUiState.page,
          sortBy: indexUiState.sortBy,
          ...indexUiState.refinementList
        };
      },
      routeToState(routeState: UiState): any {
        const page = routeState.page;
        const sortBy = routeState.sortBy;
        const refinementListKey = Object.keys(routeState).filter(
          (key) => key !== 'page' && key !== 'sortBy'
        );
        const refinementList = {};
        refinementListKey.forEach((key) => (refinementList[key] = routeState[key]));
        return {
          [indexName]: {
            page,
            sortBy,
            refinementList
          }
        };
      }
    }
  };

  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch indexName={indexName} searchClient={searchClient} routing={routing}>
        {children}
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
}
