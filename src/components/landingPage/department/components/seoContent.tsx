import Typography from '@mui/material/Typography';
import styles from '@Styles/landingPages/departmentLandingPage/departmentPage.module.scss';

function SeoContent({ title, description }) {
  return (
    <div className={styles.seo}>
      <Typography variant="h3" className={styles.seoTitle}>
        {title}
      </Typography>
      <div className={styles.seoDescription}>{description}</div>
    </div>
  );
}

export default SeoContent;
