import { useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import HLAnchorTag from '@Components/common/hlAnchorTag';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import ToolTipStyles from '@Styles/cartpage/orderSummaryTooltip.module.scss';

export default function OrderSummaryTooltip(props: any): JSX.Element {
  const infoIconRef = useRef();
  const popRef = useRef<HTMLDivElement>();
  const [openTooltip, setOpenTooltip] = useState(false);
  const { tooltip: tooltipLabel, tooltipLink } = props?.tooltipData;

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({}) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#D9D9D9'
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#D9D9D9',
      color: '#000000',
      fontSize: '10px',
      fontWeight: 300,
      fontStyle: 'normal',
      borderRadius: 10
    }
  }));

  (() => {
    document &&
      document?.addEventListener('mousedown', ({ target }: MouseEvent) => {
        if (openTooltip) {
          if (!popRef?.current?.['contains'](target as Node)) {
            setOpenTooltip(false);
          }
        }
      });
  })();

  return (
    <button className={ToolTipStyles.tooltipFocus}>
      <HtmlTooltip
        arrow
        open={openTooltip}
        onOpen={() => setOpenTooltip(true)}
        onClose={() => setOpenTooltip(false)}
        PopperProps={{
          sx: {
            marginTop: '-7px !important'
          }
        }}
        title={
          <span ref={popRef}>
            <Typography color="inherit" className={ToolTipStyles.tooltipLabel}>
              {tooltipLabel}
            </Typography>
            {tooltipLink?.value ? <HLAnchorTag {...tooltipLink} anchorTheme="LinkType1" /> : ''}
          </span>
        }
      >
        <InfoIcon
          ref={infoIconRef}
          className={ToolTipStyles.tooltipIcon}
          onClick={() => setOpenTooltip(!openTooltip)}
        />
      </HtmlTooltip>
    </button>
  );
}
