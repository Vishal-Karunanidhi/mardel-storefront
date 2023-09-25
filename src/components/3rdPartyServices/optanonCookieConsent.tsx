import Script from 'next/script';

const OptanonCookieConsent = () => {
  return (
    <>
    {/* This component was used to render the cookie consent banner in _document.jsx 
    but has a bug that needs to be addressed */}
      <Script
        type="text/javascript"
        strategy="beforeInteractive"
        data-document-language="true"
        src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
        data-domain-script={process.env.ONETRUST_KEY ?? '1374a9e9-43b8-40d0-85da-2d159cb4b531-test'}
      />

      <Script type="text/javascript" strategy="beforeInteractive">
        <>//@ts-ignore */{function OptanonWrapper() {}}</>
      </Script>
    </>
  );
};

export default OptanonCookieConsent;
