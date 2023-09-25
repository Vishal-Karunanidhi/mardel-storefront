import styles from '@Styles/productDetailPage/accordianSlot.module.scss';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { ReactNode, useState } from 'react';
import MarkdownView from 'react-showdown';
import { ShowdownExtension } from 'showdown';
import { Ga4ContentDataLayer } from 'src/interfaces/ga4DataLayer';
import { useSelector } from '@Redux/store';

export default function AccordionSlot({
  title,
  content,
  reviewAndQA = false,
  headerStyle = {},
  summaryStyle = {},
  contentStyle = {},
  markdownExtension = undefined
}: {
  title: string | ReactNode;
  content: string | ReactNode;
  reviewAndQA?: boolean;
  headerStyle?: React.CSSProperties;
  summaryStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  //probably needs a type
  markdownExtension?: ShowdownExtension[];
}): JSX.Element {
  const [expand, setExpand] = useState<boolean>(true);
  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};

  function expansionHandler(): void {
    setExpand(!expand);

    if (window) {
      const gtmData: Ga4ContentDataLayer = {
        anonymous_user_id: '',
        content_name: typeof title === 'string' ? title : 'Reviews',
        event: !expand ? 'content_expand' : 'content_collapse',
        user_id: ''
      };

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  function ClickableSummary() {
    const style = {
      ...summaryStyle,
      padding: '0',
      borderBottom: `1px solid ${styles.hlGrayLine}`
    };
    switch (reviewAndQA) {
      case true:
        return (
          <AccordionSummary
            style={style}
            expandIcon={
              <ArrowDropDown className={styles.accordianSlotTitleIcon} onClick={expansionHandler} />
            }
            className={styles.accordianSlotTitle}
            sx={{ '& .MuiAccordionSummary-content': { margin: 0 } }}
          >
            {title}
          </AccordionSummary>
        );
      case false:
        return (
          <AccordionSummary
            style={style}
            expandIcon={<ArrowDropDown className={styles.accordianSlotTitleIcon} />}
            className={styles.accordianSlotTitle}
            onClick={expansionHandler}
            sx={{ '& .MuiAccordionSummary-content': { margin: 0 } }}
          >
            {title}
          </AccordionSummary>
        );
    }
  }

  return (
    <div className={styles.accordianSlot}>
      <Accordion
        expanded={expand}
        disableGutters={true}
        style={{ ...headerStyle, boxShadow: 'none' }}
        className={styles.accordianSlotHeader}
        defaultExpanded={true}
      >
        <ClickableSummary />
        <AccordionDetails style={contentStyle} className={styles.accordianSlotContent}>
          {typeof content == 'string' ? (
            <div className={styles.markdownTable}>
              <MarkdownView
                options={{ tables: true, emoji: true }}
                markdown={content}
                extensions={markdownExtension}
              />
            </div>
          ) : (
            content
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
