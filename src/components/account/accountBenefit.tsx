import { accountBenefits } from '@Constants/accountConstants';
import AccountStyles from '@Styles/account/account.module.scss';

export default function AccountBenefit(props: any): JSX.Element {
  const { wrapperProps = {}, contentProps = {} } = props;
  return (
    <div className={AccountStyles.benefitSectionWrapper} {...wrapperProps}>
      {Object.keys(accountBenefits).map((benefit, i: number) => (
        <div className={AccountStyles.benefitContent} {...contentProps} key={i}>
          {accountBenefits[benefit].map((e, i: number) => (
            <div className={AccountStyles.contentStyle} key={i}>
              <img
                alt={e?.label}
                aria-hidden="true"
                width={20}
                height={20}
                src={`icons/megaNav/${e?.image}.svg`}
              />
              <label className={AccountStyles.benefitcontentText}>{e?.label}</label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
