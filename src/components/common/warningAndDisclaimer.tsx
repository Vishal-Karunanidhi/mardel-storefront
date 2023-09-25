import MarkdownView from 'react-showdown';
import { MediaImage } from 'src/types/shared';
import styles from '@Styles/components/common/warningAndDisclaimer.module.scss';

export default function WarningAndDisclaimer({
  warningIcon,
  warningMessage,
  disclaimer
}: {
  warningIcon: MediaImage;
  warningMessage: string;
  disclaimer?: string;
}): JSX.Element {
  return (
    <>
      <div className={styles.warning}>
        <p className={styles.warningIcon}>
          {warningIcon.name === 'notice' && (
            <img
              alt={'Notice'}
              aria-label="Notice"
              height={25}
              src="/icons/prop-65-large.png"
              width={32}
            />
          )}
          {warningIcon.name != 'notice' && (
            <img alt={warningIcon.name} height={40} src={warningIcon.url} width={38} />
          )}
        </p>
        <MarkdownView
          className={styles.warningText}
          options={{ tables: true, emoji: true }}
          markdown={warningMessage}
        />
        {disclaimer && <div className={styles.warningDisclaimer}>{disclaimer}</div>}
      </div>
    </>
  );
}
