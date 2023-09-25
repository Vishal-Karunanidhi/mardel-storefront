const GtmIframe = () => {
  return (
    <>
      <noscript
        id="gtm-iframe"
        dangerouslySetInnerHTML={{
          __html:
            '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NMPLMG6&gtm_auth=OqEAZR0PIjrp306Jr2RdCw&gtm_preview=env-4&gtm_cookies_win=x" height="0" width="0" style="display:none;visibility:hidden"></iframe>'
        }}
      ></noscript>
    </>
  );
};

export default GtmIframe;
