import Script from 'next/script';
import {
  CartGtmDataLayer,
  CategoryGtmDataLayer,
  DynamicCategoryGtmDataLayer,
  DepartmentGtmDataLayer,
  ErrorGtmDataLayer,
  GtmDataLayer,
  ProductGtmDataLayer,
  SearchGtmDataLayer
} from 'src/interfaces/gtmDataLayer';

function DataLayer(props: {
  pageData:
    | GtmDataLayer
    | CartGtmDataLayer
    | CategoryGtmDataLayer
    | DynamicCategoryGtmDataLayer
    | DepartmentGtmDataLayer
    | ErrorGtmDataLayer
    | ProductGtmDataLayer
    | SearchGtmDataLayer;
}) {
  // TODO: return empty if data is null/undefined/empty
  if (!props || !props.pageData) {
    return <></>;
  }
  return (
    <Script strategy="afterInteractive" id="gtm-push">
      {`window.dataLayer = window.dataLayer || [];
        dataLayer.push(${JSON.stringify(props.pageData)});`}
    </Script>
  );
}

export default DataLayer;
