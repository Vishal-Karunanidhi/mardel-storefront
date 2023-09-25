import { useSelector } from '@Redux/store';
import { Divider } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import colors from '@Lib/common/colors';
import { countryLabelsMap } from '@Constants/my-account/addressBookConstants';
import addressListStyles from '@Styles/checkout/loggedIn/addressList.module.scss';

const renderAddressLabel = (address) => {
  const {
    addressNickName,
    firstName,
    lastName,
    addressLineOne,
    addressLineTwo,
    city,
    state,
    country,
    zipCode,
    company,
    taxExemptedAddress
  } = address;

  const isCanada = country === 'CA';
  let canadaProvinceCodeMap = {};
  if (isCanada) {
    const { canadaProvinceCodeList } = useSelector((state) => state.myAccount);
    canadaProvinceCodeMap = canadaProvinceCodeList.find((data) => data[state]);
  }
  return (
    <div className={addressListStyles.addressLabels}>
      {addressNickName && (
        <label>
          <b>{addressNickName.toUpperCase()}</b>
        </label>
      )}
      <label>
        {firstName} {lastName}
      </label>
      <label>{addressLineOne}</label>
      {addressLineTwo && <label>{addressLineTwo}</label>}
      <label>{company}</label>
      <label>
        {city}, {isCanada ? canadaProvinceCodeMap[state] : `${state} ${zipCode}`}
      </label>
      <label>
        {isCanada ? zipCode : ''} {countryLabelsMap[country]}
      </label>
    </div>
  );
};
export default function AddressList(props: any): JSX.Element {
  const {
    addresses,
    addressId,
    showAddAddressForm,
    setAddressId,
    setShowAddAddressForm,
    setBillingSameAsShipping
  } = props;

  const { myProfileInfo } = useSelector((state) => state.auth);

  const handleRadioChange = (event) => {
    const { value } = event?.target;
    const isAddAddress = value === 'ADD_ADDRESS';
    if (isAddAddress) {
      setBillingSameAsShipping(false);
    }
    setShowAddAddressForm(isAddAddress);
    setAddressId(value);
  };

  return (
    <div className={addressListStyles.BillingAddressWrapper}>
      <label
        className={
          showAddAddressForm ? addressListStyles.billingTitle : addressListStyles.selectAddressTitle
        }
      >
        <b>
          {showAddAddressForm
            ? 'BILLING ADDRESS'
            : 'SELECT A BILLING ADDRESS FROM YOUR ADDRESS BOOK'}
        </b>
      </label>
      {!showAddAddressForm && (
        <FormControl>
          <RadioGroup value={addressId} onChange={handleRadioChange}>
            <div className={addressListStyles.addressRadioGroup}>
              {addresses?.map((address) => (
                <>
                  <FormControlLabel
                    value={address?.addressId}
                    control={
                      <Radio
                        sx={{
                          alignSelf: 'start',
                          color: '#333',
                          '&.Mui-checked': {
                            color: colors.hlBlue
                          }
                        }}
                      />
                    }
                    label={renderAddressLabel(address)}
                  />
                  <Divider />
                </>
              ))}
              {!(myProfileInfo?.taxExempt) && (
                <FormControlLabel
                  value={'ADD_ADDRESS'}
                  control={
                    <Radio
                      sx={{
                        color: '#333',
                        '&.Mui-checked': {
                          color: colors.hlBlue
                        }
                      }}
                    />
                  }
                  label={<u>Add Address</u>}
                />
              )}
            </div>
          </RadioGroup>
        </FormControl>
      )}
    </div>
  );
}
