import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import TextFieldStyles from '@Components/common/styles/hlTextField.module.scss';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { ErrorInfoIcon } from '@Components/common/iconComponent';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { phoneFormatter } from '@Components/common/accountValidator';

export default function HLTextField(props: any): JSX.Element {
  const {
    labelName,
    textFieldValue,
    handleInputChange,
    textFieldType = 'text',
    error: fieldError = false,
    additionalClassName = '',
    containerClassName = '',
    ...otherProps
  } = props;
  const [showPassword, setIsShowPassword] = useState<any>(true);
  const handleClickShowPassword = () => {
    setIsShowPassword(!showPassword);
  };

  useEffect(() => {
    if (textFieldType === 'password') {
      setIsShowPassword(false);
    }
  }, []);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <div className={`${TextFieldStyles.inputFieldWrapper} ${containerClassName}`}>
      <TextField
        label={labelName}
        onChange={handleInputChange}
        className={`${TextFieldStyles.textInput} ${additionalClassName}`}
        error={false}
        value={textFieldType === 'phone' ? phoneFormatter(textFieldValue) : textFieldValue}
        variant="filled"
        type={showPassword || textFieldType === 'location' ? 'text' : textFieldType}
        placeholder={textFieldType === 'phone' ? '(___) ___-____' : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {textFieldType === 'password' && (
                <>
                  {fieldError && <ErrorInfoIcon width={16} height={16} />}
                  <IconButton
                    disableRipple
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                  </IconButton>
                </>
              )}
            </InputAdornment>
          )
        }}
        {...otherProps}
      />
    </div>
  );
}
