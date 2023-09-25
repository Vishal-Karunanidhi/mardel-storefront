import Link from 'next/link';
import { useState } from 'react';
import styles from '@Styles/components/common/common.module.scss';

const divStyle = { outlineOffset: '5px', outline: `2px dashed ${styles.hlBlueDark}` };
const buttonDisabledStyle = { color: '#5F5F5F', background: '#EDEDED', cursor: 'auto' };

const preventDefault = (e) => e.preventDefault();

const HlButton = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    callbackMethod,
    isDisabled,
    parentDivClass,
    buttonClass,
    buttonTitle,
    dataTestId,
    ...buttonProps
  } = props;

  delete buttonProps.anchorProps;

  return (
    <div
      className={parentDivClass ?? styles.submitWrapper}
      onPointerDown={preventDefault}
      onPointerUp={preventDefault}
      style={isFocused ? divStyle : {}}
    >
      <button
        aria-label={buttonTitle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={buttonClass ?? styles.submitButton}
        onClick={callbackMethod}
        disabled={isDisabled}
        style={isDisabled ? buttonDisabledStyle : {}}
        data-testid={dataTestId}
        {...buttonProps}
      >
        {buttonTitle}
      </button>
    </div>
  );
};

const HlAnchorButton = (props) => {
  return <HlButton {...props} />;
};

const HlPageLinkButton = (props) => {
  const { href, openInNewTab = false, anchorProps } = props;

  return (
    <Link href={href} passHref>
      <a target={openInNewTab ? '_blank' : '_self'} {...anchorProps}>
        <HlButton {...props} />
      </a>
    </Link>
  );
};

const HlAnchorWrapper = (props) => {
  const { href, openInNewTab = false, anchorProps } = props;

  return (
    <Link href={href} passHref>
      <a target={openInNewTab ? '_blank' : '_self'} {...anchorProps}>
        {props.children}
      </a>
    </Link>
  );
};

export default HlButton;
export { HlAnchorButton, HlPageLinkButton, HlAnchorWrapper };
