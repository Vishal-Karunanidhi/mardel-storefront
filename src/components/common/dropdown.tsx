import { ChangeEvent, ChangeEventHandler, forwardRef, useEffect, useRef, useState } from 'react';
import styles from '@Styles/components/common/dropdown.module.scss';
import '@Styles/components/common/dropdown.module.scss';

type Props = {
  label: string;
  options: string[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
  className?: string;
};

const Dropdown = forwardRef<HTMLSelectElement, Props>(
  ({ label, options, onChange, className }: Props, ref = null) => {
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const labelText = useRef<SVGTextElement>(null);
    const select = useRef<HTMLSelectElement>(null);

    useEffect(() => {
      if (labelText?.current) {
        if (
          (typeof ref !== 'function' &&
            ref?.current &&
            ref?.current?.options?.selectedIndex !== 0) ||
          (select?.current && select?.current?.options?.selectedIndex !== 0)
        ) {
          labelText.current.classList.add(styles.selected);
          return;
        }
        labelText.current.classList.remove(styles.selected);
      }
    }, [
      isClicked,
      isFocused,
      ref,
      typeof ref !== 'function' && ref?.current?.options.selectedIndex,
      select?.current?.options.selectedIndex
    ]);

    return (
      <div aria-label={`${label} Dropdown`} className={`${styles.CommonDropdown} ${className}`}>
        <label htmlFor="select">
          <text ref={labelText}>{label}</text>
          <select
            ref={ref || select}
            defaultChecked={false}
            defaultValue={0}
            id="select"
            onMouseDown={() => setIsClicked(true)}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              onChange(event);
              setIsClicked(false);
              setIsFocused(false);
            }}
            onClick={() => setIsClicked(true)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsClicked(false);
              setIsFocused(false);
            }}
            style={{
              outline: (isFocused && !isClicked && `${styles.hlBlue} dashed 2px`) || '',
              outlineOffset: '2px'
            }}
          >
            {options.map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
