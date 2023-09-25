import ErrorPage from '@Components/errorPage/errorPage';
import { errorPages } from '@Constants/generalConstants';

export default function PageNotFound(props: any): JSX.Element {
  return <ErrorPage errorCode={errorPages.pageNotFound} />;
}
