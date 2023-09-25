import { ChangeEventHandler, HTMLInputTypeAttribute, useEffect, useRef, useState } from 'react';
import styles from '@Styles/components/common/input.module.scss';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

/**
 *
 * @param {string} label - The label displayed to the user for the input
 * @param {string} value - String that is typed into the input by the user
 * @param {ChangeEventHandler} onChange - Callback function used for the input
 * @param {boolean} [error] - Flag used to display error for incorrect input
 * @param {CSSProperties} [style] - Style input
 * @returns
 */

type Props = {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  error?: boolean;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  maxLength?: number;
  pattern?: string;
};

export default function Input({
  label,
  value,
  onChange,
  className = '',
  error,
  required,
  type,
  maxLength,
  pattern
}: Props): JSX.Element {
  const labelText = useRef<SVGTextElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (input.current) {
      if (error) {
        input.current.style.borderColor = styles.hlError;
      } else {
        input.current.style.borderColor = '';
      }
    }
    if (labelText.current) {
      if (value) {
        labelText.current.style.fontSize = '9px';
        labelText.current.style.marginBottom = '31px';
      }
    }
  }, [value, error, isFocused]);

  return (
    <div aria-label={`${label} Input`} className={`${styles.CommonInput} ${className}`}>
      <label htmlFor="input">
        {label}
        {error ? <InfoOutlined sx={{ color: styles.hlError }} /> : ''}
      </label>
      <input
        pattern={pattern}
        ref={input}
        type={type}
        id="input"
        value={value}
        required={required}
        maxLength={maxLength}
        style={{
          outlineColor: (isFocused && !isClicked && styles.hlBlue) || '',
          outlineStyle: (isFocused && !isClicked && 'dashed') || '',
          outlineWidth: (isFocused && !isClicked && '2px') || '',
          outlineOffset: (isFocused && !isClicked && '2px') || ''
        }}
        onMouseDown={() => setIsClicked(true)}
        onChange={onChange}
        onFocus={() => {
          if (labelText.current) {
            labelText.current.style.fontSize = '9px';
            labelText.current.style.marginBottom = '31px';
          }
          setIsFocused(true);
        }}
        onBlur={() => {
          if (labelText.current) {
            labelText.current.style.fontSize = '';
            labelText.current.style.marginBottom = '';
          }
          setIsClicked(false);
          setIsFocused(false);
        }}
      />
    </div>
  );
}
