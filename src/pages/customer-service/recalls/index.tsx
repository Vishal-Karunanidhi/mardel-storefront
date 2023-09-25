import { getContentPage } from '@Lib/cms/contentPage';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import {
  ContentComponent,
  ContentPage,
  ContentPageBreadcrumb,
  RecallProductsAndYears
} from '@Types/cms/schema/contentPage.schema';
import { imageURL } from '@Lib/common/utility';
import { contentToBreadcrumb, imageUrlQuery } from '@Lib/common/utility';
import MarkdownView from 'react-showdown';
import { GetServerSideProps } from 'next';
import styles from '@Styles/contentPage/recalls.module.scss';

function Recalls({ breadcrumbs, recalledProducts, richText }) {
  recalledProducts.recallList.sort((a, b) => b.year - a.year);
  return (
    <div className={styles.recallPage}>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(breadcrumbs)} />
      <div className={styles.recallContent}>
        <MarkdownView options={{tables: true, emoji: true}} className={styles.richText} markdown={richText.richText} />
        {recalledProducts.recallList.map((item, index: number) => {
          let products = item.recalledProducts.map((product, i: number) => {
            return (
              <div className={styles.product} key={i}>
                <div className={styles.imageContainer}>
                  <img
                    alt={product.productImage.name}
                    className={styles.image}
                    src={imageUrlQuery(
                      imageURL(
                        product.productImage.defaultHost,
                        product.productImage.endpoint,
                        product.productImage.name
                      ),
                      150,
                      150
                    )}
                  />
                </div>
                <MarkdownView
                  options={{
                    openLinksInNewWindow: product.openNewTab
                  }}
                  className={styles.productDetails}
                  markdown={product.productText}
                />
              </div>
            );
          });
          return (
            <div className={styles.productAndYear} key={index}>
              <h2 className={styles.year}>{item.year}</h2>
              <hr className={styles.horizontalRule} />
              {products}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Recalls;

export const getServerSideProps: GetServerSideProps = async () => {
  const { contentPage }: { contentPage: ContentPage } = await getContentPage(
    'customer-service/recalls'
  );
  let breadcrumbs: ContentPageBreadcrumb = null;
  let recalledProducts: RecallProductsAndYears = null;
  let richText = null;

  contentPage.content.forEach((contentComponent: ContentComponent) => {
    switch (contentComponent.__typename) {
      case 'ContentPageBreadcrumb':
        breadcrumbs = contentComponent;
        break;
      case 'RecallProductsAndYears':
        recalledProducts = contentComponent;
        break;
      case 'ContentRichText':
        richText = contentComponent;
        break;
      default:
        break;
    }
  });

  return {
    props: {
      breadcrumbs,
      recalledProducts,
      richText
    }
  };
};
