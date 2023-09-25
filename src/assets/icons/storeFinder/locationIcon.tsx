import styles from '@Styles/storeFinder/storeSearchPage.module.scss';

export default function LocationIcon({ number }) {
  return (
    <div className={styles.locationIconContainer}>
      <svg
        width="32"
        height="47"
        viewBox="0 0 32 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 0.408203C7.15429 0.408203 0 7.6072 0 16.5082C0 28.5832 16 46.4082 16 46.4082C16 46.4082 32 28.5832 32 16.5082C32 7.6072 24.8457 0.408203 16 0.408203Z"
          fill="#B40000"
        />
      </svg>
      <span className={styles.locationIcon}>{number}</span>
    </div>
  );
}
