import styles from '@Styles/storeFinder/storeDirectoryPage.module.scss';

export default function DirectoryAllLocations({ directory }) {
  directory.sort((a, b) => {
    if (a.state < b.state) return -1;
    if (a.state > b.state) return 1;
    return 0;
  });

  const filterDirectory = (regex) => {
    return directory
      .filter((stateInfo) => regex.test(stateInfo.state))
      .map((stateInfo, index) => {
        return (
          <div className={styles.allLocationsColumnStateContainer} key={index}>
            <a className={styles.allLocationsLink} href={`/stores?state=${stateInfo.stateAbbr}`}>
              <span className={styles.allLocationsColumnState}>{stateInfo.state}</span>
              <span className={styles.allLocationsColumnCount}>{`(${stateInfo.count})`}</span>
            </a>
          </div>
        );
      });
  };

  return (
    <>
      <div className={styles.allLocationsHeaders}>
        <h2 className={styles.allLocationsHeader}>A-I</h2>
        <h2 className={styles.allLocationsHeader}>K-M</h2>
        <h2 className={styles.allLocationsHeader}>N-O</h2>
        <h2 className={styles.allLocationsHeader}>P-W</h2>
      </div>
      <div className={styles.allLocations}>
        <div className={styles.allLocationsColumnHeaderMobile}>A-I</div>
        <div className={styles.allLocationsColumn}>{filterDirectory(/^[a-j]/i)}</div>
        <div className={styles.allLocationsColumnHeaderMobile}>K-M</div>
        <div className={styles.allLocationsColumn}>{filterDirectory(/^[k-m]/i)}</div>
        <div className={styles.allLocationsColumnHeaderMobile}>N-O</div>
        <div className={styles.allLocationsColumn}>{filterDirectory(/^[n-o]/i)}</div>
        <div className={styles.allLocationsColumnHeaderMobile}>P-W</div>
        <div className={styles.allLocationsColumn}>{filterDirectory(/^[p-w]/i)}</div>
      </div>
    </>
  );
}
