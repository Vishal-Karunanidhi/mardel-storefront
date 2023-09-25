import Script from 'next/script';
import { useSelector } from '@Redux/store';

const GoogleRecaptcha = () => {
  const { pageType } = useSelector((state) => state.layout);
  if (!pageType?.isLoginPage && !pageType?.isCheckoutPage) {
    return <></>;
  }

  return (
    <>
      <Script
        src={`${process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_V3_END_POINT}${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
      />
    </>
  );
};

function generateRecaptchaToken(action = 'submit') {
  return new Promise(function (resolve) {
    try {
      if (typeof window === 'undefined' || !window?.['grecaptcha']) {
        resolve('');
      }
      const { ready, execute } = window?.['grecaptcha'];
      ready(() => {
        execute(`${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`, { action }).then((token) =>
          resolve(token)
        );
      });
    } catch (err) {
      console.log('Failed to load the recaptcha SDK', err);
      resolve('');
    }
  });
}

export { generateRecaptchaToken };

export default GoogleRecaptcha;
