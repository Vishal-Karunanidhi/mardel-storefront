import ErrorPage from '@Components/errorPage/errorPage';
import { errorPages } from '@Constants/generalConstants';

export default function InternalError(props: any): JSX.Element {
  return <ErrorPage errorCode={errorPages.internalServerError} />;
}
