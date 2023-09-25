import Head from 'next/head';
import { pageTitle } from '@Constants/generalConstants';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { imageLoader } from '@Lib/common/utility';

export default function SeoHead(props) {
  const { title, description, additionalMetaTags, hostUrl, canonical } = props;
  const router = useRouter();
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href={imageLoader('/icons/favicon.ico')} />
      </Head>
      <NextSeo
        title={title || pageTitle[router?.asPath] || 'Hobby Lobby'}
        description={
          description ||
          'Hobby Lobby arts and crafts stores offer the best in project, party and home supplies. Visit us in person or online for a wide selection of products!'
        }
        canonical={canonical || (hostUrl ? `${hostUrl}${router?.asPath?.split('?')?.[0]}` : null)}
        additionalMetaTags={additionalMetaTags || null}
      />
    </>
  );
}
