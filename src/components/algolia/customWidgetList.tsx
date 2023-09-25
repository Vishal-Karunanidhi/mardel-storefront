import CustomRefinementList from '@Components/plp/customRefinementList';
import styles from '@Styles/algolia/customWidgetList.module.scss';
import { useDynamicWidgets } from 'react-instantsearch-hooks-web';

export default function CustomWidgetList({ fromParentPageType }): any {
  const { attributesToRender } = useDynamicWidgets();

  return (
    <div className={styles.widgets}>
      <span className={styles.widgetsTitle}>
        <img src={'/icons/filtersIcon.svg'} alt="Filter Icon" height="24" width="24" />
        <label className={styles.widgetsTitleLabel}>Filters</label>
      </span>
      <hr className={styles.widgetsDivider} />
      {attributesToRender.map((name: string, index: number) => (
        <CustomRefinementList
          key={index}
          attribute={name}
          isLastAttribute={index === attributesToRender.length - 1}
          fromParentPageType={fromParentPageType}
        />
      ))}
    </div>
  );
}
