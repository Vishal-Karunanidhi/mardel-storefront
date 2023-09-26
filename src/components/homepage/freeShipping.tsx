import { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getFreeShippingMessages } from '@Lib/cms/cartpage';
import { styled } from '@mui/material/styles';
import { FreeShippingContentData } from 'src/types/homepage';
import styles from '@Styles/homepage/freeShipping.module.scss';

// Image styling component
const Img = styled('img')({
  margin: 'auto',
  display: 'flex'
});

// Component inline Material styling using 'sx' prop is a shortcut for defining custom style
const componentMaterialStyle = {
  imageStyle: {
    imagesx: {
      transform: 'matrix(1, 0, 0, 1, 0, 28)'
    },
    imageButton: {
      cursor: 'default'
    }
  },
  papersx: {
    height: '100%',
    backgroundColor: '#42966D',
    borderRadius: '10px 10px 0 0'
  },
  accordion: {
    accordionBox: {
      '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        alignSelf: { sm: 'flex-end', xs: 'flex-end' },
        flexDirection: { sm: 'column-reverse', xs: 'column-reverse' }
      },
      '& .MuiAccordionSummary-expandIconWrapper': {
        alignSelf: { sm: 'flex-end', xs: 'flex-end' },
        flexDirection: { sm: 'column-reverse', xs: 'column-reverse' },
        marginInlineEnd: { sm: '24px', xs: '24px', md: '24px', lg: '24px', xl: '24px' },
        marginBlockStart: { sm: '17px', xs: '17px', md: '17px', lg: '17x', xl: '17px' },
        marginBlockEnd: { sm: '25px', xs: '25px', md: '38px', lg: '38px', xl: '38px' }
      }
    }
  }
};

// Component inline html styling using 'style' attribute
const componentHtmlStyle = {
  accordionStyle: {
    expandBoxStyle: {
      borderRadius: '0px 0px 20px 20px',
      backgroundColor: '#063225',
      marginTop: -15
    }
  }
};

export default function FreeShipping(props: FreeShippingContentData | any): JSX.Element {
  const { title, subtitle, policies, image } = props;
  const { expandBoxStyle } = componentHtmlStyle.accordionStyle;
  const { imagesx, imageButton } = componentMaterialStyle.imageStyle;
  const { papersx } = componentMaterialStyle;
  const { accordionBox } = componentMaterialStyle.accordion;
  const [isShippingPromoActive, setIsShippingPromoActive] = useState<boolean>(false);
  const imageUrl = image
    ? `https://${image.defaultHost}/i/${image.endpoint}/${image.name}?fmt=auto`
    : '';

  useEffect(() => {
    async function getShippingPromoActiveState() {
      try {
        const {
          getFreeShippingPromoState: { shippingPromoActive }
        } = await getFreeShippingMessages();
        setIsShippingPromoActive(shippingPromoActive);
      } catch (e) {}
    }

    getShippingPromoActiveState();
  }, []);

  const isContentAvailable = !!(title && subtitle && policies);

  if (!isShippingPromoActive || !isContentAvailable) {
    return <></>;
  }

  return (
    <Grid container spacing={0} className={styles.mainAccordionPadding}>
      <Grid item xs={12} md={12}>
        <Paper elevation={0} sx={papersx}>
          <Typography className={styles.mainTitle}>{title}</Typography>
          <span className={styles.imageButton}>
            {imageUrl ? (
              <Img
                alt="Hobby Lobby delivery truck with 'Live a Creative Life' logo on its side"
                sx={imagesx}
                className={styles.truckImage}
                src={'mardel/icons/freeshipping.svg'}
              />
            ) : (
              ''
            )}
          </span>
        </Paper>
      </Grid>
      <Grid item xs={12} md={12}>
        <Accordion style={expandBoxStyle}>
          <AccordionSummary
            className={styles.accordionBox}
            sx={accordionBox}
            expandIcon={<ArrowDropDownIcon style={{ color: '#FFFFFF' }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={styles.accordionTitle}>{subtitle}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className={styles.policies}>{policies}</Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
}
