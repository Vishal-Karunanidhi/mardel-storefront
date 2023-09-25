import Link from 'next/link';
import SeoHead from '@Components/common/seoHead';
import { BreadCrumb } from '@Types/cms/schema/pdp/pdpData.schema';
import styles from '@Styles/components/breadcrumb/breadcrumb.module.scss';
import { BreadcrumbJsonLd } from 'next-seo';
import { useRouter } from 'next/router';

type Props = {
  breadCrumbs: BreadCrumb[];
  optionalHeader?: any;
  children?: string;
  optionalSubheader?: string;
  hideOptionalHeader?: boolean;
};

export default function Breadcrumb(props: Props): JSX.Element {
  const router = useRouter();
  const breadCrumbs = props.breadCrumbs;
  const optionalHeader = props.optionalHeader;
  const optionalSubheader = props.optionalSubheader;
  const hideOptionalHeader = props.hideOptionalHeader;

  const breadCrumbLinks: (string | JSX.Element)[] = breadCrumbs?.flatMap(
    (crumb: BreadCrumb, index: number, array: BreadCrumb[]) => {
      if (array.length - 1 !== index) {
        return [
          <Link key={'Breadcrumb' + index} href={crumb.slug ?? ''} passHref>
            <a
              onClick={() => {
                if (crumb.slug === router.pathname) {
                  router.reload();
                }
              }}
              key={index}
              target={crumb.openInNewTab ? '_blank' : '_self'}
            >
              {crumb.name}
            </a>
          </Link>,
          ' | '
        ];
      } else {
        return <span key={index}>{crumb.name}</span>;
      }
    }
  );

  const breadCrumbJsonLd = {
    itemListElements: breadCrumbs?.flatMap((breadcrumb, index) => [
      {
        position: index + 1,
        name: breadcrumb.name,
        ...(index !== breadCrumbs.length - 1 && {
          item: `https://www.hobbylobby.com${breadcrumb.slug}`
        })
      }
    ])
  };

  const lastBreadCrumb = breadCrumbs?.[breadCrumbs?.length - 1];

  let pageSeoTitle = 'Hobby Lobby';
  if (breadCrumbs) {
    pageSeoTitle =
      breadCrumbs
        .map(({ name }) => name)
        .filter((e, i) => i !== 0)
        .reverse()
        .join(' - ') +
      ' | ' +
      pageSeoTitle;
  }

  return (
    <>
      <SeoHead title={pageSeoTitle} />
      <BreadcrumbJsonLd {...breadCrumbJsonLd} />
      <div className={styles.wrapper}>
        <div className={styles.breadcrumbs}>
          {breadCrumbLinks}
          {!hideOptionalHeader && (
            <h1 className={styles.breadcrumbsTitle}>
              {optionalHeader ? optionalHeader : lastBreadCrumb?.name}
            </h1>
          )}
          {props?.children}
          {optionalSubheader && (
            <h2 className={styles.breadcrumbsSubheader}>{optionalSubheader}</h2>
          )}
        </div>
      </div>
    </>
  );
}
