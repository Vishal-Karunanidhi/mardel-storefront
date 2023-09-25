import { getLookBookPage } from '@Lib/cms/lookBook';
import { GetServerSideProps } from 'next/types';
import styles from '@Styles/lookBookPage/lookbook.module.scss';
import { LookBookPage, LookBookPageContent } from '@Types/cms/lookBook';
import HeroBanner from '@Components/homepage/heroBanner';
import SecondaryPromotion from '@Components/homepage/secondaryPromotion';
import { useEffect, useState } from 'react';

type Props = { content: LookBookPageContent };

export default function LookBook({ content }: Props) {
  const [isDesktop, setIsDesktop] = useState<boolean>();
  const tileStyles = {
    desktop: {
      img: { height: '813px' },
      grid: { alignItems: 'center', gap: '40px' }
    },
    mobile: {
      img: { maxWidth: '272px', height: '353px', borderRadius: '20px' },
      grid: { gap: '40px' }
    }
  };

  useEffect(() => {
    if (window.innerWidth >= Number.parseInt(styles.hlLgBreakpoint)) {
      setIsDesktop(true);
    } else {
      setIsDesktop(false);
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth >= Number.parseInt(styles.hlLgBreakpoint)) {
        setIsDesktop(true);
      } else {
        setIsDesktop(false);
      }
    });
  }, []);

  return (
    <div className={styles.lookBook}>
      {content.map((component, index: number) => {
        switch (component.__typename) {
          case 'HeroSlotContent':
            return (
              <HeroBanner
                key={index}
                {...component}
                style={{ flexGrow: 0, width: '220px', gap: '10px' }}
              />
            );
          case 'TwoTileComponent':
            return (
              <SecondaryPromotion
                key={index}
                Promos={component.tileSlots}
                imgStyle={isDesktop ? tileStyles.desktop.img : tileStyles.mobile.img}
                gridStyle={isDesktop ? tileStyles.desktop.grid : tileStyles.mobile.grid}
                style={{ width: isDesktop ? '100%' : '' }}
              />
            );
          case 'PromoCard':
            return <SecondaryPromotion key={index} Promos={[component]} />;
          default:
            return;
        }
      })}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const lbQuery = query.lookBookName.at(0).toLocaleLowerCase();
  const lookBookPage: LookBookPage = await getLookBookPage(lbQuery);
  return {
    props: {
      content: lookBookPage.content
    }
  };
};
