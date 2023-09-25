import { useEffect, useState } from 'react';
import styles from '@Styles/storeFinder/storeDirectoryPage.module.scss';

type Store = {
  city: string;
  count: number;
};

type DirectoryState = {
  count: number;
  executionTime: string;
  state: string;
  stateAbbr: string;
  status: string;
  directory: Store[];
};

export default function DirectoryState({ directoryState }: { directoryState: DirectoryState }) {
  const { count, state, stateAbbr, directory } = directoryState;

  return (
    <div className={styles.state}>
      {directory.map((city, index) => {
        let previousCity = directory[index - 1]?.city || '';
        if (previousCity[0] !== city.city[0]) {
          return (
            <>
              <div className={styles.stateCityLetter}>{city.city[0]}</div>
              <div className={styles.stateCity}>
                <a
                  className={styles.stateCityLink}
                  href={`/stores?state=${stateAbbr}&city=${city.city}`}
                >
                  <span className={styles.stateCityName}>{city.city}</span>
                  <span className={styles.stateCityCount}>({city.count})</span>
                </a>
              </div>
            </>
          );
        }
        return (
          <div className={styles.stateCity} key={index}>
            <a
              className={styles.stateCityLink}
              href={`/stores?state=${stateAbbr}&city=${city.city}`}
            >
              <span className={styles.stateCityName}>{city.city}</span>
              <span className={styles.stateCityCount}>({city.count})</span>
            </a>
          </div>
        );
      })}
    </div>
  );
}
