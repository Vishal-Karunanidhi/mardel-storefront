//Declare your regular expression as part of your object.
const regexValidators = {
  email:
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
  accountEmail: /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s])[A-Za-z\d@$!%*?&^()-_+=,.<>|{};:`~#"']{8,}$/,
  signInPassword: /(.+)/i,
  phone: /^[\+]?[(]?[0-9]{4}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/,
  accountPhone: /^(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/,
  onTypePhone: /^[\+]?[(]?[0-9]{0,4}[)]?[-\s\.]?[0-9]{0,3}[-\s\.]?[0-9]{0,4}$/,
  zipCode: /(^\d{5}$)|(^\d{5}-\d{4}$)/,
  phoneCleanup: /[^a-zA-Z0-9+ ]/g,
  formattedPhone: /(\d{3})(\d{3})(\d{4})/
};

//Decalre your Validation here.
const isValidEmail = (e) => regexValidators?.email.test(e);
const isValidAccountEmail = (e) => regexValidators?.accountEmail.test(e);
const isValidPassword = (e) => regexValidators?.password.test(e);
const isValidPhone = (e) => regexValidators?.phone.test(e);
const isValidAccountPhone = (e) => regexValidators?.accountPhone.test(e);
const isOnTypePhoneValid = (e) => regexValidators?.onTypePhone.test(e);
const isValidZipCode = (e) => regexValidators?.zipCode.test(e);
const isSignInPasswordValid = (e) => regexValidators?.signInPassword.test(e);
const cleanupPhoneNumber = (e) => e.replace(regexValidators?.phoneCleanup, '')?.replace(/\s/g, '');

const phoneFormatter = (phoneNumber) => {
  const cleanedNumber = phoneNumber?.replace(/^\+1/, '').replace(/[^\d]/g, '');
  const truncatedNumber = cleanedNumber?.slice(0, 10);
  const formattedNumber = truncatedNumber?.replace(regexValidators?.formattedPhone, '($1) $2-$3');
  return formattedNumber;
};

//Function Validator comes here.
function SignUpValidator(formValues) {
  const { email, password, phone, firstName, lastName } = formValues;

  return (
    isValidAccountEmail(email) &&
    isValidPassword(password) &&
    isValidAccountPhone(phone) &&
    firstName.trim() &&
    lastName.trim()
  );
}

function SignInValidator(formValues) {
  const { username, password } = formValues;

  return isValidAccountEmail(username) && isSignInPasswordValid(password);
}

function DateMonthYearConverter(creationTime) {
  const date = new Date(creationTime);
  const year = date.getFullYear();

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const month = months[date.getMonth()];

  const day = date.getDate();

  const result = {
    year,
    month,
    day
  };

  return result;
}

export {
  SignUpValidator,
  SignInValidator,
  isOnTypePhoneValid,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  DateMonthYearConverter,
  isValidZipCode,
  isValidAccountEmail,
  isValidAccountPhone,
  isSignInPasswordValid,
  cleanupPhoneNumber,
  phoneFormatter
};
