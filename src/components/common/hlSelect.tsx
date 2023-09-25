import { useState, useEffect, useRef } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CheckoutStyles from '@Styles/checkout/checkoutPage.module.scss';

export default function HLSelect(props: any): JSX.Element {
  const selectRefState = useRef(null);
  const [selectMenuStylingSate, setSelectMenuStylingSate] = useState({});
  const {
    selectBoxData,
    selectBoxValue,
    isTextFieldDisabled,
    handleSelectOnChange,
    additionalClassName = '',
    ...otherProps
  } = props;

  useEffect(() => {
    window.addEventListener('scroll', identifySelectParentPosition);
    identifySelectParentPosition();
  }, []);

  const identifySelectParentPosition = () => {
    const menuPropStylingSate = selectRefState?.current?.getBoundingClientRect() ?? null;
    if (menuPropStylingSate) {
      setSelectMenuStylingSate({
        top: `${menuPropStylingSate?.top + 47}px !important`,
        left: `${menuPropStylingSate?.left}px !important`,
        width: `${menuPropStylingSate?.width}px !important`
      });
    }
  };

  const optionalProps = selectBoxValue ? { value: selectBoxValue } : {};

  if (selectBoxData === undefined)
    return <p className={CheckoutStyles.readError}>Error reading data source.</p>;

  return (
    <Select
      defaultValue=""
      ref={selectRefState}
      labelId={'select' + selectBoxData[0]?.toString()}
      id={'select' + selectBoxData[0]?.toString()}
      onChange={handleSelectOnChange}
      disabled={isTextFieldDisabled}
      MenuProps={{
        disableScrollLock: true,
        className: CheckoutStyles.hlSelectBox,
        sx: {
          '.MuiPaper-root.MuiPaper-elevation': selectMenuStylingSate
        }
      }}
      className={`${CheckoutStyles.selectField} ${additionalClassName}`}
      {...optionalProps}
      {...otherProps}
    >
      {selectBoxData?.map((data, i: number) => (
        <MenuItem disableRipple key={i} value={data.code}>
          {data.name}
        </MenuItem>
      ))}
    </Select>
  );
}
