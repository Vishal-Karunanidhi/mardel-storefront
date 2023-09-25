import HlButton, { HlPageLinkButton } from '@Components/common/button';
import Dropdown from '@Components/common/dropdown';
import {
  topics,
  subTopics,
  formVariants,
  Topic,
  SubTopic,
  FormFields
} from '@Constants/contactUsConstants';
import { contactUsMutation, getContactUsPage } from '@Lib/cms/contactUs';
import { ContactUsPage, ContactUsRequest } from '@Types/cms/contactUs';
import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import MarkdownView from 'react-showdown';
import styles from '@Styles/customerService/contactUs.module.scss';
import { GetServerSideProps } from 'next';
import WarningAndDisclaimer from '@Components/common/warningAndDisclaimer';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { contentToBreadcrumb } from '@Lib/common/utility';
import { BreadCrumb } from '@Types/cms/schema/pdp/pdpData.schema';
import { getCountriesAndStateList } from '@Lib/cms/checkoutPage';
import { GtmDataLayer } from 'src/interfaces/gtmDataLayer';
import HLTextField from '@Components/common/hlTextField';

export default function ContactUs({ breadcrumbs, pageDescription, topicSelection }: ContactUsPage) {
  const [topic, setTopic] = useState<Topic>('');
  const [subTopic, setSubTopic] = useState<SubTopic>('');
  const [states, setStates] = useState<string[]>([]);
  const [form, setForm] = useState<Record<FormFields, string>>({} as Record<FormFields, string>);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const selectTopic = useRef<HTMLSelectElement>(null);
  const selectSubTopic = useRef<HTMLSelectElement>(null);

  const crumbs: BreadCrumb[] = contentToBreadcrumb(breadcrumbs);

  const { warningSection } = topicSelection;

  useEffect(() => {
    async function getStates() {
      const response = await getCountriesAndStateList();

      let statesList: any[] = response['billingCountries']
        .filter((list: any) => list.name === 'US')
        .at(0).stateList;

      statesList = statesList.map((state) => state.name);
      statesList.unshift('');

      setStates(statesList);
    }

    getStates();
  }, []);
  useEffect(() => {
    setSubTopic('');

    if (topic === 'Hobby Lobby Stores') {
      setSubTopic('Contact Us');
    }
  }, [topic]);
  useEffect(() => {
    setForm(() => {
      const newState: Record<FormFields, string> = {} as Record<FormFields, string>;
      if (subTopic && formVariants[subTopic]) {
        formVariants[subTopic].forEach((field) => {
          newState[field] = '';
        });
      }
      return newState;
    });
  }, [subTopic]);

  function handleTopicChange(e: ChangeEvent<HTMLSelectElement>): void {
    setTopic((prevState): Topic => {
      let option: HTMLOptionElement | null;
      if (
        e?.currentTarget?.selectedOptions?.item(0) === null ||
        e?.currentTarget?.selectedOptions?.item(0) === undefined
      ) {
        return '';
      }

      option = e.currentTarget.selectedOptions.item(0);
      if (prevState !== option?.value && selectSubTopic.current) {
        selectSubTopic.current.selectedIndex = 0;
      }
      return option?.value as Topic;
    });
  }
  function handleSubTopicChange(e: ChangeEvent<HTMLSelectElement>): void {
    setSubTopic(() => {
      let option: HTMLOptionElement | null;
      if (
        e?.currentTarget?.selectedOptions?.item(0) === null ||
        e?.currentTarget?.selectedOptions?.item(0) === undefined
      ) {
        return '';
      }

      option = e.currentTarget.selectedOptions.item(0);
      return option?.value as SubTopic;
    });
  }
  function handleFormFieldChange(
    e: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    formField: FormFields
  ) {
    setForm((prevState) => {
      const newState: Record<FormFields, string> = Object.assign({}, prevState) as Record<
        FormFields,
        string
      >;
      if (subTopic && formVariants[subTopic]) {
        newState[formField] = (e.target as HTMLInputElement).value;
      }
      return newState;
    });
  }
  async function handleFormSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const { contactUs } = await contactUsMutation(createContactForm());

    if (contactUs.Status === 200) {
      if (window) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'contact_form_submit' } as GtmDataLayer);
      }
      if (selectTopic.current) {
        selectTopic.current.selectedIndex = 0;
      }
      if (selectSubTopic.current) {
        selectSubTopic.current.selectedIndex = 0;
      }
      setShowSuccessModal(true);
      setTopic('');
      setSubTopic('');
      setForm({} as Record<FormFields, string>);
      window && window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function createContactForm(): ContactUsRequest {
    const formKeys: FormFields[] = Object.keys(form) as FormFields[];
    const submittionForm: ContactUsRequest = {} as ContactUsRequest;

    submittionForm.reason = subTopic;
    formKeys.forEach((key) => {
      switch (key) {
        case 'First name':
          submittionForm.firstName = form[key];
          break;
        case 'Last name':
          submittionForm.lastName = form[key];
          break;
        case 'Email address':
          submittionForm.emailAddress = form[key];
          submittionForm.customerEmail = form[key];
          break;
        case 'Phone number (optional)':
          submittionForm.phoneNumber = form[key];
          break;
        case 'Order number':
          submittionForm.orderNumber = form[key];
          break;
        case 'City & State':
          submittionForm.storeLocation = form[key];
          break;
        case 'Store name and #':
          submittionForm.storeNumber = form[key].replace(/^\D+/g, '');
          break;
        case 'Address line 1':
          submittionForm.line1 = form[key];
          break;
        case 'Apt, Ste, Bldg (optional)':
          submittionForm.line2 = form[key];
          break;
        case 'City':
          submittionForm.townCity = form[key];
          break;
        case 'State':
          submittionForm.state = form[key];
          break;
        case 'Zip code':
          submittionForm.zipCode = form[key];
          break;
        case 'Wrong SKU# received (optional)':
          submittionForm.wrongSku = form[key];
          break;
        case 'Damaged SKU# (optional)':
          submittionForm.damagedSku = form[key];
          break;
        case 'Missing SKU# (optional)':
          submittionForm.missingSku = form[key];
          break;
        case 'SKU# (optional)':
          submittionForm.sku = form[key];
          break;
        case 'Comment':
          submittionForm.comments = form[key];
          break;
        default:
          break;
      }
    });

    return submittionForm;
  }
  function formComponent(formField: FormFields, index: number): JSX.Element {
    const props = {
      key: index,
      labelName: formField,
      textFieldValue: form[formField],
      handleInputChange: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      ) => handleFormFieldChange(e, formField)
    };
    switch (formField) {
      case 'First name':
      case 'Last name':
        return <HLTextField {...props} required={true} containerClassName={styles.Input} />;
      case 'Address line 1':
      case 'Order number (optional)':
        if (topic === 'Miscellaneous') return <></>;
        return <HLTextField {...props} required={true} containerClassName={styles.Input} />;
      case 'Email address':
        return (
          <HLTextField {...props} required={true} type="email" containerClassName={styles.Input} />
        );
      case 'Phone number (optional)':
        return (
          <HLTextField {...props} textFieldType="phone" maxLength={11} containerClassName={styles.Input} />
        );
      case 'State':
        return (
          <Dropdown
            key={index}
            label={formField}
            options={states}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFormFieldChange(e, formField)}
            className={styles.Input}
          />
        );
      case 'Zip code':
        return (
          <HLTextField
            {...props}
            type={'tel'}
            pattern="^\s*?\d{5}(?:[-\s]\d{4})?\s*?$"
            containerClassName={styles.Input}
            maxLength={10}
          />
        );
      case 'SKU# (optional)':
      case 'Order number':
      case 'Damaged SKU# (optional)':
        return <HLTextField {...props} />;
      case 'Wrong SKU# received (optional)':
      case 'Missing SKU# (optional)':
      case 'City & State':
      case 'Store name and #':
      case 'Apt, Ste, Bldg (optional)':
      case 'City':
        // Todo
        // order number format
        // sku format
        return <HLTextField {...props} containerClassName={styles.Input} />;
      case 'Comment':
        return (
          <textarea
            key={index}
            value={form[formField]}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleFormFieldChange(e, formField)}
            placeholder={formField}
            minLength={5}
            maxLength={1000}
          />
        );
      default:
        return <p>{formField}</p>;
    }
  }

  return (
    <>
      <Breadcrumb breadCrumbs={crumbs} />
      {showSuccessModal && (
        <div className={styles.contactUsSuccessModal}>
          <text className={styles.contactUsSuccessModalHeader}>Thank you for contacting us!</text>
          <text className={styles.contactUsSuccessModalBody}>
            We will get back to you within 1-2 business days.
          </text>
        </div>
      )}
      <div className={styles.contactUs}>
        <div className={styles.contactUsLeft}>
          <MarkdownView
            options={{ tables: true, emoji: true }}
            markdown={topicSelection.description}
          />
          <p className={styles.contactUsLeftTextFormHeader}>{topicSelection.dropdownLabel}</p>
          <div className={styles.contactUsLeftForm}>
            <Dropdown
              ref={selectTopic}
              label={'Topic'}
              options={topics}
              onChange={handleTopicChange}
            />
            {topic !== 'Hobby Lobby Stores' && topic !== '' && (
              <Dropdown
                ref={selectSubTopic}
                label={'SubTopic'}
                options={subTopics[topic]}
                onChange={handleSubTopicChange}
              />
            )}
            {subTopic && (
              <form onSubmit={handleFormSubmit}>
                {formVariants[subTopic].map((formField, index) => formComponent(formField, index))}
                <p className={styles.CommentText}>Enter a message (5-1000 characters)</p>
                {(subTopic === 'Cancel Order' || subTopic === 'Update Address') && (
                  <WarningAndDisclaimer
                    warningIcon={warningSection.warningIcon}
                    warningMessage={warningSection.warningDisclaimer}
                  />
                )}
                <HlButton buttonTitle={'Send email'} />
              </form>
            )}
          </div>
        </div>
        <div className={styles.contactUsRight}>
          <MarkdownView
            options={{ tables: true, emoji: true }}
            markdown={pageDescription.pageDescriptionText}
          />
          <HlPageLinkButton
            href={pageDescription.pageDescriptionLink.value}
            openInNewTab={true}
            buttonTitle={pageDescription.pageDescriptionLink.label}
          />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { breadcrumbs, pageDescription, topicSelection }: ContactUsPage = await getContactUsPage(
    'customer-service/contact-us'
  );

  return {
    props: {
      breadcrumbs,
      pageDescription,
      topicSelection
    }
  };
};
