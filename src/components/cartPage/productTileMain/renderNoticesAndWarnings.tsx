import NoticeWarningStyles from '@Styles/cartpage/renderNoticesAndWarnings.module.scss';

export default function RenderNoticesAndWarnings(props: any): JSX.Element {
  const { attributes, cmsData, inventoryMessages, productName } = props;
  let isMaximumStockAdded = false;
  (() => {
    if (inventoryMessages?.length) {
      const inventoryLimitReachedProduct = inventoryMessages[0]?.split('only')[0]?.trim();
      isMaximumStockAdded = productName === inventoryLimitReachedProduct;
    }
  })();
  let productNotice = [];
  (() => {
    const {
      productWarnings,
      productHazards,
      excludeFreeShipping,
      additionalShipping,
      excludedStates,
      assorted
    } = attributes;
    const { warningNotices } = cmsData ?? {};

    const parseNotices = (inputData) => {
      const msgArray = inputData?.split(':') ?? ['', ''];
      return `<b>${msgArray?.[0] ?? ''}</b>: ${msgArray?.[1] ?? ''}`;
    };

    if (productWarnings) {
      productNotice.push({
        icon: 'warning',
        value: productWarnings.label
      });
    }
    if (productHazards) {
      productNotice.push({
        icon: 'hazard',
        value: productHazards.label
      });
    }
    if (excludedStates?.length) {
      const states = excludedStates.map((e) => e.label).join(', ');
      productNotice.push({
        icon: 'notice',
        value: `${parseNotices(warningNotices?.noAirShipping)}: ${states}`
      });
    }
    if (additionalShipping) {
      productNotice.push({
        icon: 'notice',
        value: `${parseNotices(warningNotices?.additionalShipping)}${parseFloat(
          additionalShipping
        ).toFixed(2)}`
      });
    }
    if (excludeFreeShipping) {
      productNotice.push({
        icon: 'notice',
        value: parseNotices(warningNotices?.excludeFreeShipping)
      });
    }
    if (isMaximumStockAdded) {
      productNotice.push({
        value: `<b style="color:${NoticeWarningStyles.hlError};">${warningNotices?.maximumStockLimit}</b>`
      });
    }
    if (assorted) {
      productNotice.push({
        icon: 'warning',
        value: '<span><b>Style/Color:</b> Assorted - You May Not Receive What Is Pictured</span>'
      });
    }
  })();

  return (
    <div className={(productNotice?.length > 0 && NoticeWarningStyles.noticeWarningWrapper) || ''}>
      {productNotice.map((e, i: number) => (
        <div className={NoticeWarningStyles.noticeWarningSubWrapper} key={i}>
          <div className={NoticeWarningStyles.imageWrapper}>
            {!isMaximumStockAdded && e.icon === 'hazard' && (
              <img
                alt={'Prop 65 Warning'}
                aria-label="Prop 65 Warning"
                height={12}
                src="/icons/prop-65-small.png"
                width={15}
              />
            )}
            {!isMaximumStockAdded && e.icon != 'hazard' && (
              <img
                alt={'Notice'}
                aria-label="Notice"
                height={12}
                src={`/icons/${e.icon}.svg`}
                width={14}
              />
            )}
          </div>
          <div>
            <p dangerouslySetInnerHTML={{ __html: e.value }}></p>
          </div>
        </div>
      ))}
    </div>
  );
}
