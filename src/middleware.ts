/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const urlRegex = /^[a-zA-Z0-9\-_.%\/]+$/;

function getPagePath(pathname: string) {
  const breadCrumbPathList: string[] = pathname.split('/');
  let seasonalBreadCrumb: boolean;
  switch (breadCrumbPathList[1]) {
    case 'Calendar-Planners':
    case 'Christmas':
    case 'Easter':
    case 'Independence-Day':
    case 'July-4th':
    case 'New-Years-Day':
    case 'Spring-Shop':
    case 'St-Valentines-Day':
    case 'Thanksgiving':
    case 'Thanksgiving-Day':
    case 'Valentines-Day':
      seasonalBreadCrumb = true;
      break;
    default:
      seasonalBreadCrumb = false;
      break;
  }

  const isFAQCategory = pathname?.indexOf('faq') !== -1;
  const isGiftCardsCategory = pathname?.toLowerCase().indexOf('gift-cards') !== -1;
  const isDiyCategory = pathname?.toLowerCase().indexOf('diy-') !== -1;
  const isDynamicCategory: boolean =
    breadCrumbPathList[breadCrumbPathList.length - 1].includes('dc-') &&
    breadCrumbPathList[breadCrumbPathList.length - 2] === 'c';

  // Need to investigate this post go live if seasonal landing pages needed to be routed to seasonal pages
  // if (breadCrumbPathList.length > 2 && seasonalBreadCrumb == true) {
  //   return `/Seasonal${pathname}`;
  // }
  if (
    breadCrumbPathList[1] === 'Seasonal' &&
    breadCrumbPathList[2] === 'c' &&
    breadCrumbPathList[3] === '12'
  ) {
    return '/seasonal';
  } else if (breadCrumbPathList.length > 2 && breadCrumbPathList[2] === 'c') {
    if (isGiftCardsCategory) {
      return `/plp${pathname}`;
    } else if (isDiyCategory) {
      return '/diyInspiration';
    } else if (isDynamicCategory) {
      return `/dynamic-category${pathname}`;
    } else {
      return `/landingPage${pathname}`;
    }
  } else if (breadCrumbPathList.length > 2 && breadCrumbPathList[2] === 'faq') {
    return isFAQCategory ? `/faq${pathname}` : `/landingPage${pathname}`;
  } else if (isDiyCategory) {
    return `/diyInspiration/category${pathname}`;
  } else if (isDynamicCategory) {
    return `/dynamic-category${pathname}`;
  } else {
    return `/plp${pathname}`;
  }
}

// This all looks unused
// TODO - Investigate to see if it can be deleted
const essentialCookies = ['JSESSIONID', 'hl-id-token', 'hl-anon-id', 'hobbylobby-cart'];
let headerCookie = '';
function extractCookies(nextCookiesObj) {
  headerCookie = essentialCookies
    .filter((e) => nextCookiesObj.has(e))
    .map((e) => `${e}=${nextCookiesObj.get(e)}`)
    .join(';');
}

export async function middleware(request: NextRequest) {
  const {
    nextUrl: { pathname }
  } = request;

  /*Allows Only Valid URLs - Helps in Restricting the OS-SQL-Python Commands injected in url.
  If needed update the regex configured at line.no05 */
  if (!urlRegex.test(pathname)) {
    const url404Url = request.nextUrl.clone();
    url404Url.pathname = `/404`;
    console.error('------Invalid URL Path------', pathname);
    return NextResponse.redirect(url404Url);
  }

  extractCookies(request.cookies);
  let response: NextResponse = null;
  const isLookBookPage: boolean =
    pathname.includes('Spring-Essentials') ||
    pathname.includes('Fall-Essentials') ||
    pathname.includes('Christmas-Essentials');

  if (isLookBookPage) {
    response = NextResponse.rewrite(new URL(`/look-book${pathname}`, request.url));
  }

  if (pathname.indexOf('/c/') !== -1) {
    response = NextResponse.rewrite(new URL(getPagePath(pathname), request.url));
  }
  if (pathname.indexOf('/p/') !== -1) {
    const isDiyCategory = pathname?.toLowerCase().indexOf('diy-') !== -1;
    if (isDiyCategory) {
      response = NextResponse.rewrite(
        new URL(`/diyInspiration/projectPage${pathname}`, request.url)
      );
    } else {
      response = NextResponse.rewrite(new URL(`/product${pathname}`, request.url));
    }
  }
  response = response ?? NextResponse.next();

  const requestId: string = request.headers.get('x-request-id');
  if (requestId) {
    response.cookies.set('x-request-id', request.headers.get('x-request-id'));
  }

  return response;
}

// // See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/:faq/:topic/:path*',
    '/:dept/c/:path*',
    '/:dept/:cat/c/:path*',
    '/:dept/:cat/:subcat/c/:path*',
    '/:dept/:cat/:subcat/:subcat2/c/:path*',
    '/:dept/p/:path*',
    '/:dept/:cat/p/:path*',
    '/:dept/:cat/:subcat/p/:path*',
    '/:dept/:cat/:subcat/:subcat2/p/:path*',
    '/:dept/:cat/:subcat/:subcat2/:subcat3/p/:path*',
    '/((?!api|_next/static|favicon.ico).*)'
  ]
};
