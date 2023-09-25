import { useSelector } from '@Redux/store';
import { Pagination } from 'react-instantsearch-hooks-web';
import { Ga4ViewSearchResultsDataLayer } from 'src/interfaces/ga4DataLayer';

type Props = { searchTerm: string };

export default function CustomPagination({ searchTerm }: Props): any {
  const { heartBeatInfo } = useSelector((state) => state.auth) ?? {};

  function handleMoreSearchResultsEvent(): void {
    if (window && heartBeatInfo) {
      const { isLoggedInUser, sessionId } = heartBeatInfo;
      const gtmData: Ga4ViewSearchResultsDataLayer = {
        anonymous_user_id: '',
        event: 'view_more_search_results',
        search_term: searchTerm,
        email: '',
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
    <Pagination
      padding={2}
      showFirst
      showNext
      showLast
      showPrevious
      onClick={handleMoreSearchResultsEvent}
      translations={{
        firstPageItemText: '<',
        previousPageItemText: 'PREVIOUS',
        nextPageItemText: 'NEXT',
        lastPageItemText: '>'
      }}
    />
  );
}
