import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import theme from 'src/assets/styles/theme';
import createEmotionCache from 'src/assets/styles/createEmotionCache';
import Script from 'next/script';
import GtmIframe from '@Components/3rdPartyServices/gtmIframe';
import { imageLoader } from '@Lib/common/utility';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="shortcut icon" href={imageLoader('/icons/favicon.ico')} />
          <meta name="emotion-insertion-point" content="" />
          {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          <Script
            data-document-language="true"
            data-domain-script={
              process.env.ONETRUST_KEY ?? '1374a9e9-43b8-40d0-85da-2d159cb4b531-test'
            }
            id="onetrust"
            src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
            strategy="beforeInteractive"
            type="text/javascript"
          ></Script>
          {/* TODO: make this a component. previous attempt was flawed and the snippet did not show up */}
          <Script id="gtm-init" strategy="beforeInteractive" type="text/javascript">
            {
              "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl+'&gtm_auth=OqEAZR0PIjrp306Jr2RdCw&gtm_preview=env-4&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NMPLMG6');"
            }
          </Script>
          <GtmIframe />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
/*
    Resolution order
    On the server:
    1. app.getInitialProps
    2. page.getInitialProps
    3. document.getInitialProps
    4. app.render
    5. page.render
    6. document.render

    On the server with error:
    1. document.getInitialProps
    2. app.render
    3. page.render
    4. document.render

    On the client
    1. app.getInitialProps
    2. page.getInitialProps
    3. app.render
    4. page.render
*/

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        }
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags
  };
};
