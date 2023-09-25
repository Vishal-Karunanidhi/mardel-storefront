import { SetStateAction, useEffect, useState } from 'react';
import styles from '@Styles/layout/megaNavCard.module.scss';
import { MegaNavChildren } from 'src/types/cms/raw/megaNav.raw';

import { HlPageLinkButton } from '@Components/common/button';
import { Ga4NavigationClickDataLayer } from 'src/interfaces/ga4DataLayer';
import { useSelector } from '@Redux/store';

export default function MegaNavCard(props: MegaNavChildren): JSX.Element {
  const {
    children: megaChild,
    departmentFromChild,
    handleDepartmentFromChildChange,
    isFromDrawer,
    label,
    theme
  } = props;

  const [selectedDepartment, setSelectedDepartment] = useState(0);
  const [isChecked, setIsChecked] = useState(0);
  const isLeftSectionPresent = theme === 'MegaNav-WithLeftSection';
  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};

  useEffect(() => {
    departmentFromChild && setSelectedDepartment(departmentFromChild[label] ?? 0);
  }, [departmentFromChild, label]);

  const handleDepartmentSelection = (index: SetStateAction<number>) => {
    setSelectedDepartment(index);
    handleDepartmentFromChildChange({ [label]: index });
  };

  const handleInputChange = (i: SetStateAction<number>) => {
    setIsChecked(i);
  };

  const handleLocalStorage = (linkTitle: string = 'Explore all') => {
    handleNavigationClickEvent(linkTitle);
    localStorage.setItem('selectedTab', props.label);
  };

  const cardRenderItems =
    isFromDrawer || props.theme === 'MegaNav-WithoutLeftSection'
      ? megaChild
      : megaChild[selectedDepartment]?.children;

  let exploreUrl = `/${megaChild?.[selectedDepartment]?.href}` ?? '/';

  if (theme === 'MegaNav-WithoutLeftSection') {
    exploreUrl = '/' + props?.href;
  }

  function handleNavigationClickEvent(linkTitle: string) {
    if (window) {
      const gtmData: Ga4NavigationClickDataLayer = {
        anonymous_user_id: '',
        event: 'navigation_click',
        link_text: linkTitle,
        nav_tree_text: `${label} | ${linkTitle}`,
        nav_type: 'top menu', // TODO: create enum of valid types
        user_id: ''
      };

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  return (
    <>
      {isLeftSectionPresent && (
        <article
          aria-roledescription={`A list of categories under ${label}`}
          className={styles.card}
        >
          <section className={styles.megaNavCategories}>
            {megaChild.map((e: MegaNavChildren, i: number) => {
              return (
                <label
                  htmlFor={e.deliveryId}
                  key={e.deliveryId}
                  data-testid={`meganav-${label.replace(/ /g, '-').toLowerCase()}-${e.label
                    .replace(/ /g, '-')
                    .toLowerCase()}`}
                >
                  <span>{e.label}</span>
                  <input
                    aria-controls={e.deliveryId}
                    aria-label={e.label}
                    checked={i === isChecked}
                    id={e.deliveryId}
                    name={'megaNav-' + { label }.label}
                    onChange={() => handleInputChange(i)}
                    onClick={() => handleDepartmentSelection(i)}
                    tabIndex={0}
                    type="radio"
                    value={i}
                  />
                  <div className={styles.megaNavCategoryContent}>
                    <section className={styles.megaNavCategoryToolbar}>
                      <h2>
                        <span className={styles.visuallyHidden}>{e.label} </span>Categories
                      </h2>
                      <HlPageLinkButton
                        href={exploreUrl}
                        anchorProps={{ tabIndex: -1 }}
                        callbackMethod={handleLocalStorage}
                        buttonTitle={'Explore all'}
                        parentDivClass={styles.megaNavExploreDiv}
                        buttonClass={`${styles.megaNavExplore} ${styles.buttonSmall}`}
                      />
                    </section>
                    <ul>
                      {cardRenderItems?.map((e: MegaNavChildren, i: number) => (
                        <li key={i + e.deliveryId}>
                          <a
                            aria-label={e?.label}
                            aria-roledescription="A list of categories in the selected department"
                            href={e?.href ? `/${e?.href}` : '/'}
                            onClick={() => handleLocalStorage(e?.label)}
                            tabIndex={0}
                            data-testid={`meganav-${label
                              .replace(/ /g, '-')
                              .toLowerCase()}-${e.label.replace(/ /g, '-').toLowerCase()}`}
                          >
                            <span className={styles.image}>
                              <img
                                alt={e?.altText}
                                height="60"
                                loading="lazy"
                                src={`https://${e?.thumbnail}?w=75&h=75&fmt.jpeg.interlaced=true`}
                                width="60"
                              />
                            </span>
                            <span className={styles.description}>{e?.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </label>
              );
            })}
          </section>
        </article>
      )}

      {!isLeftSectionPresent && (
        <article
          aria-roledescription={`A list of categories under ${label}`}
          className={`${styles.card} ${styles.leftHidden}`}
        >
          <section className={`${styles.megaNavCategories} ${styles.leftHidden}`}>
            <div className={styles.megaNavCategoryContent}>
              <section className={styles.megaNavCategoryToolbar}>
                <h2>
                  <span className={styles.visuallyHidden}>{label} </span>Categories
                </h2>
                <HlPageLinkButton
                  href={exploreUrl}
                  anchorProps={{ tabIndex: -1 }}
                  callbackMethod={handleLocalStorage}
                  buttonTitle={'Explore all'}
                  parentDivClass={styles.megaNavExploreDiv}
                  buttonClass={`${styles.megaNavExplore} ${styles.buttonSmall}`}
                />
              </section>
              <ul>
                {cardRenderItems?.map((e: MegaNavChildren, i: number) => (
                  <li key={i + e.deliveryId}>
                    <a
                      aria-label={e?.label}
                      aria-roledescription="A list of categories in the selected department"
                      href={e?.href ? `/${e?.href}` : '/'}
                      onClick={() => handleLocalStorage(e?.label)}
                      tabIndex={0}
                      data-testid={`meganav-${label.replace(/ /g, '-').toLowerCase()}-${e.label
                        .replace(/ /g, '-')
                        .toLowerCase()}`}
                    >
                      <span className={styles.image}>
                        <img
                          alt={e?.altText}
                          height="60"
                          src={`https://${e?.thumbnail}?w=75&h=75&fmt.jpeg.interlaced=true`}
                          width="60"
                        />
                      </span>
                      <span className={styles.description}>{e?.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </article>
      )}
    </>
  );
}
