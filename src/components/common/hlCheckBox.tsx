import CheckBoxStyles from '@Components/common/styles/hlCheckBox.module.scss';

export default function HLCheckbox(props: any): JSX.Element {
  const { checkBoxLabel, dataTestId, handleCheckBoxChange, isChecked, id, ...restProps } = props;

  // TODO:Incorporate event handling on demand
  return (
    <div className={CheckBoxStyles.checkboxWrapper}>
      <input
        id={id}
        type="checkbox"
        className={CheckBoxStyles.checkboxInput}
        onChange={handleCheckBoxChange}
        data-testid={dataTestId}
        value={isChecked ? 1 : 0}
        checked={isChecked}
        {...restProps}
      />
      <label htmlFor={id} className={CheckBoxStyles.checkboxLabel}>
        {checkBoxLabel}
      </label>
    </div>
  );
}
