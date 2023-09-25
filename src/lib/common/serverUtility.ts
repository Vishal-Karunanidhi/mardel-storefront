import {
  deleteCookie,
  getCookie as getCookieNext,
  getCookies,
  hasCookie,
  setCookie
} from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';
import { IncomingMessage, ServerResponse } from 'http';

// TODO: change this to a default or remove altogether and let defaults handle it
const cookieMaxAge = 60 * 6 * 24;
const recentlyViewedMaximum = 12;
// we may want to move all cookie names to a central location, but this will work for now
const recentlyViewedCookieName = '_hl_rv';

// SUMMARY: Retrieves a string array of product keys from the recently viewed cookie
//  Keys are assumed to be stored newest to oldest.
// RETURNS: string array. returns empty string array if cookie doesn't exist.
function getProductKeysFromCookie(reqObj: OptionsType): string[] {
  if (hasCookie(recentlyViewedCookieName, reqObj)) {
    const recentlyViewedKeys = getCookieNext(recentlyViewedCookieName, reqObj) as string;
    return recentlyViewedKeys ? recentlyViewedKeys.split(',') : [];
  }

  return [];
}

// Retrieves a semicolon separated list of cookies
// TODO: rename this so the getCookie from cookies-next doesn't have to be aliased
function getCookie(ctx: { req: any; res: any }): { cookie: string } {
  const { req, res } = ctx;
  const cookieList = getCookies({ req, res });
  const cookie = Object.keys(cookieList)
    .map((e) => `${e}=${cookieList[e]}`)
    .join(';');

  return {
    cookie
  };
}

// Adds a product key to the recently viewed cookie and returns the resulting array.
// ordered newest to oldest
function addProductKeyToRecentlyViewed(
  req: IncomingMessage & { cookies: Partial<{ [key: string]: string }> },
  res: ServerResponse<IncomingMessage>,
  productKey: string
): string[] {
  let recentlyViewedArray = getProductKeysFromCookie({ req });
  const existingProductKeyIndex = recentlyViewedArray.findIndex((k) => k === productKey);

  // Remove current product key from array if it currently exists
  if (existingProductKeyIndex !== -1) {
    recentlyViewedArray.splice(existingProductKeyIndex, 1);
  }

  if (recentlyViewedArray.length - 1 >= recentlyViewedMaximum) {
    //  Removes the number of items over the max since there could theoretically be over the max
    recentlyViewedArray.splice(
      recentlyViewedMaximum - 1, // always want to remove from the max - 1 since we already know we need one space below max
      recentlyViewedArray.length - recentlyViewedMaximum
    );
  }

  // Always ensure current product to first index
  recentlyViewedArray.unshift(productKey);

  // Merge recently viewed product keys as a comma separated string and update cookie
  setCookie(recentlyViewedCookieName, recentlyViewedArray.join(','), {
    req,
    res,
    maxAge: cookieMaxAge
  });
  return recentlyViewedArray;
}

//  SUMMARY: Retrieves the data held in the cookie.
//  RETURNS: a string representing the data held in the cookie.
//    Will return empty string if the cookie doesn't exist or if the cookie contained an invalid state.
function getCookieData(cookieName: string, ctx: { req: any; res: any }): string {
  const cookieList = getCookies(ctx);

  // we want to return empty string if the cookie is null
  return cookieList[cookieName] ?? '';
}
//  SUMMARY: Ensures the `cje` cookie exists and holds the `cjEvent` value.
//  RETURNS: Boolean indicator of whether upsert was successful
function upsertCjEventCookie(cjEvent: string, ctx: { req: any; res: any }): boolean {
  if (!cjEvent || cjEvent === 'undefined') {
    console.warn('CJ Event value was invalid.');
    return false;
  }

  if (cjEvent.length > 64) {
    console.warn(
      `CJ Event value is ${cjEvent.length} which is larger than the expected 64 characters.`
    );
    return false;
  }

  let existingCookie = getCookieData('cje', ctx);

  if (existingCookie) {
    deleteCookie('cje');
  }

  setCookie('cje', cjEvent, {
    domain: '.hobbylobby.com', // TODO: add parameter to pass in the top level domain
    maxAge: (60 * 60 * 24 * 3), // 3 days
    req: ctx.req,
    res: ctx.res,
    sameSite: 'none',
    secure: true
  });
  return true;
}

/*Redirect to 404 page at next-server side*/
const redirectTo404Page = () => ({
  redirect: {
    permanent: false,
    destination: '/404'
  }
});

export {
  addProductKeyToRecentlyViewed,
  getCookieData,
  getCookie,
  getProductKeysFromCookie,
  upsertCjEventCookie,
  redirectTo404Page
};
