import { Divider } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import colors from '@Lib/common/colors';
import { formatMonth } from '@Lib/common/utility';
import PaymentListStyles from '@Styles/checkout/loggedIn/paymentList.module.scss';

const renderCardInfo = (payment) => {
    const {
        last4Digits,
        cardType,
        expiryMonth,
        expiryYear,
        defaultPayment,
        cardExpired } = payment;
    return (
        <div className={PaymentListStyles.cardLabelWrapper}>
            {defaultPayment && <b>DEFAULT PAYMENT</b>}
            <div>
                <label>{`${cardType} *${last4Digits}`}</label>
            </div>
            <div>
                <label>{`Exp ${formatMonth(expiryMonth)}/${expiryYear}`}</label>
                {cardExpired &&
                    <label className={PaymentListStyles.cardExpired}>
                        {` (card expired)`}
                    </label>
                }
            </div>
        </div>
    )
}

export default function PaymentList(props: any): JSX.Element {

    const { payments, paymentId, setPaymentId, setShowAddPaymentForm } = props;

    const handleRadioChange = (event) => {
        const { value } = event?.target;
        setShowAddPaymentForm(value === 'ADD_PAYMENT');
        setPaymentId(value);
    }

    return (
        <>
            <FormControl>
                <RadioGroup
                    value={paymentId}
                    onChange={handleRadioChange}>
                    <div className={PaymentListStyles.paymentRadioGroup}>
                        {payments?.map((payment) => (
                            <>
                                <FormControlLabel
                                    value={payment?.paymentId}
                                    control={<Radio
                                        sx={{
                                            alignSelf: 'start',
                                            color: '#333',
                                            '&.Mui-checked': {
                                                color: colors.hlBlue
                                            }
                                        }} />}
                                    label={renderCardInfo(payment)}
                                />
                                <Divider />
                            </>
                        ))}

                        <FormControlLabel
                            value={'ADD_PAYMENT'}
                            control={<Radio
                                sx={{
                                    color: '#333',
                                    '&.Mui-checked': {
                                        color: colors.hlBlue
                                    }
                                }} />}
                            label={<u>Add Payment Option</u>}
                        />
                    </div>
                </RadioGroup>
            </FormControl>
        </>
    )
}