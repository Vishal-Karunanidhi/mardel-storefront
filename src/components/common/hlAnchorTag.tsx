import Link from 'next/link';
import { mockFn } from '@Lib/common/utility';
import HLAnchorStyles from '@Styles/common/hlComponentStyles.module.scss';

const WrapperComponent = ({ children, value = '', linkProps, useLink = true }) => {
  if (!useLink) {
    return children;
  }

  return (
    <Link href={value} key={value} passHref {...linkProps}>
      {children}
    </Link>
  );
};

export default function HLAnchorTag(props: any): JSX.Element {
  const {
    label,
    OpenInNewTab,
    anchorTheme = 'LinkType1',
    callbackMethod = mockFn,
    anchorProps,
    parentDivProps
  } = props;

  const linkOpenType = OpenInNewTab ? '_blank' : '_self';
  let additionalClassName = '';
  switch (anchorTheme) {
    case 'LinkType1':
      additionalClassName = HLAnchorStyles.linkType1;
      break;
    case 'LinkType2':
      additionalClassName = HLAnchorStyles.linkType2;
      break;
    case 'LinkType3':
      additionalClassName = HLAnchorStyles.linkType3;
      break;
    case 'LinkType4':
      additionalClassName = HLAnchorStyles.linkType4;
      break;
    default:
      break;
  }

  return (
    <div className={HLAnchorStyles.hlAnchorTagWrapper} {...parentDivProps}>
      <WrapperComponent {...props}>
        <a
          target={linkOpenType}
          onClick={callbackMethod}
          className={additionalClassName}
          {...anchorProps}
        >
          {label}
        </a>
      </WrapperComponent>
    </div>
  );
}
