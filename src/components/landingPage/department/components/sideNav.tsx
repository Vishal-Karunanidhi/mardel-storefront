import Link from 'next/link';
import styles from '@Styles/landingPages/departmentLandingPage/sideNav.module.scss';

function SideNav({ categories, currentUrl }) {
  return (
    <nav className={styles.nav}>
      <h3 className={styles.navHeader}>Categories</h3>
      <ul className={styles.navList}>
        {categories.map((category, index) => {
          return (
            <li key={index} className={styles.listItem}>
              <Link href={`/${category.content._meta.deliveryKey || ''}`} passHref>
                <a onPointerDown={(e) => e.preventDefault()} className={styles.listLink} 
                data-testid={`sidenav-${category.content.title
                  .replace(/ /g, '-')
                  .toLowerCase()}`}
                >
                  {category.content.title}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SideNav;
