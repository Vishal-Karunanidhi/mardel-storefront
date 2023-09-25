import { getCookie } from 'cookies-next';
import { cookieList } from '@Constants/cookieConstants';

export function getClientSideCookies() {
  let clientSideCookie: any = { cookie: '' };
  const composedCookie = [];
  cookieList.forEach((cookieName) => {
    const cookieValue = getCookie(cookieName);
    if (cookieValue) {
      composedCookie.push(`${cookieName}=${cookieValue}`);
    }
  });
  clientSideCookie['cookie'] = composedCookie?.join(';') ?? '';
  return clientSideCookie;
}
