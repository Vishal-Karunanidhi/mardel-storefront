import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Popover } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { AccountCircleOutlined, Add, Close } from '@mui/icons-material';
import HlButton, { HlPageLinkButton, HlAnchorWrapper } from '@Components/common/button';
import ImageWithFallback from '@Components/common/imageWithFallback';
import { useDispatch, useSelector } from '@Redux/store';
import { createShoppingList } from '@Lib/cms/shoppingList';
import { imageUrlQuery } from '@Lib/common/utility';
import { getShoppingListsWithItems } from '@Lib/cms/shoppingList';
import { ListResponse } from '@Types/cms/shoppingList';
import { GlobalState } from '@Types/globalState';
import styles from '@Styles/layout/shoppingListModal.module.scss';
import modalStyles from '@Styles/components/common/modal.module.scss';

type Props = {
  showShoppingListModal: boolean;
  setShowShoppingListModal: Dispatch<SetStateAction<boolean>>;
  anchorElement: HTMLButtonElement;
};
type ProductImageSet = { [key: string]: JSX.Element[] };

export default function HeaderShoppingListModal(props: Props): JSX.Element {
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const { shoppingLists } = useSelector((state: GlobalState) => state.list);
  const { isLoggedInUser } = useSelector((state: GlobalState) => state?.auth?.heartBeatInfo);

  const { showShoppingListModal, setShowShoppingListModal, anchorElement } = props;
  const viewListLink = isLoggedInUser ? '/my-account#lists' : '/myList';

  const [listNames, setListNames] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<ProductImageSet>({} as ProductImageSet);
  const [windowWidth, setWindowWidth] = useState<number>(() => {
    if (window) {
      window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
      return window.innerWidth;
    }
    return 0;
  });
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const mobile: number = 700;
    if (windowWidth < mobile) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [windowWidth]);

  useEffect(() => {
    async function listImageArray() {
      const DEFAULT_LIST = 'My list';
      const listAndImageMap: ProductImageSet = {};
      const lists = shoppingLists?.filter(({ itemCount }) => !!itemCount)?.slice(0, 5);
      setListNames(lists?.map((list: ListResponse) => list.listName));

      lists?.map(({ listName, items }) => {
        const imageElements = items?.map(({ sku, product }, index) => {
          const numberOfImagesToDisplay = isMobile ? 4 : 5;
          if (index >= numberOfImagesToDisplay) return;
          return (
            <HlAnchorWrapper key={index} openInNewTab={true} href={product?.url}>
              <ImageWithFallback
                key={sku}
                src={imageUrlQuery(product?.imageSet, 64)}
                alt="Product Image"
              />
            </HlAnchorWrapper>
          );
        });
        listAndImageMap[listName || DEFAULT_LIST] = imageElements;
      });
      setProductImages(listAndImageMap);
    }

    listImageArray();
  }, [shoppingLists, isMobile]);

  useEffect(() => {
    async function extractShoppingListDetails() {
      setIsInitialLoading(true);
      const response = await getShoppingListsWithItems();
      dispatch({
        type: 'UPDATE_SHOPPING_LISTS',
        payload: response?.shoppingList ?? []
      });
      setIsInitialLoading(false);
    }
    if (showShoppingListModal) {
      extractShoppingListDetails();
    }
  }, [showShoppingListModal]);

  const handleClose = () => setShowShoppingListModal(false);

  const listImageDisplayComp = () => {
    const isListEmpty =
      !shoppingLists?.length || shoppingLists?.every((list) => list.itemCount === 0);

    if (isInitialLoading && isListEmpty) {
      return (
        <div className={styles.modalProgress}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <>
        {isListEmpty ? (
          <div className={styles.modalBodyListEmpty}>
            <b>Oops! It seems that your list is empty.</b>
            <br />
            Explore our products and start your next project!
          </div>
        ) : (
          <>
            {listNames?.map((listName, index) => (
              <div key={index} className={styles.modalBodyList}>
                <div className={styles.modalBodyListTitle}>{listName}</div>
                <div className={styles.modalBodyListImages}>
                  {productImages[listName || 'My list']}
                </div>
              </div>
            ))}
            <HlPageLinkButton
              buttonTitle={'View lists'}
              href={viewListLink}
              style={{ height: 30 }}
            />
          </>
        )}
      </>
    );
  };

  const modalContents = (
    <>
      <div className={`${modalStyles.modalTop} ${styles.modalTop}`}>
        <Close className={modalStyles.closeIcon} onClick={handleClose} />
      </div>
      <div className={styles.modalBody}>
        {listImageDisplayComp()}
        <div className={styles.modalBodyUser}>
          {isLoggedInUser ? (
            <CreateNewListButton handleClose={handleClose} />
          ) : (
            <AccountCreationSignIn />
          )}
        </div>
      </div>
    </>
  );

  const popoverModal = (
    <Popover
      anchorEl={anchorElement}
      onClose={handleClose}
      anchorOrigin={{ vertical: 30, horizontal: 0 }}
      transformOrigin={{ vertical: 0, horizontal: 382 }}
      open={showShoppingListModal}
      PaperProps={{ className: styles.popover }}
    >
      {modalContents}
    </Popover>
  );

  return isMobile ? <div className={isMobile && styles.modal}>{modalContents}</div> : popoverModal;
}

const CreateNewListButton = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const LIST_IDENTIFIER = 'New List';
  const { shoppingLists } = useSelector((state: GlobalState) => state.list);

  async function handleCreateNewList() {
    let newListNameCount = shoppingLists?.filter(({ listName }) =>
      listName?.includes(LIST_IDENTIFIER)
    )?.length;
    const NEW_LIST_NAME = `New List ${newListNameCount ? '(' + newListNameCount++ + ')' : ''}`;

    await createShoppingList(NEW_LIST_NAME);

    const response = await getShoppingListsWithItems();
    dispatch({
      type: 'UPDATE_SHOPPING_LISTS',
      payload: response?.shoppingList ?? []
    });

    props?.handleClose();

    if (!window?.location.href.includes('/my-account#lists')) {
      router.replace('/my-account#lists');
    }
  }

  return (
    <HlButton
      callbackMethod={handleCreateNewList}
      buttonTitle={
        <>
          <Add /> Create new list
        </>
      }
      style={{ height: 30 }}
    />
  );
};

const AccountCreationSignIn = () => {
  const loginHref = '/login';
  const labels = {
    summaryLine1: 'Do you want to save and create new lists?',
    summaryLine2: 'Sign in or register an account to enjoy the benefits!',
    register: 'Register an account',
    alreadyRegistered: 'Already registered?',
    login: 'Log in'
  };

  return (
    <div className={styles.modalBodyGuest}>
      <hr />
      {labels.summaryLine1} <br /> {labels.summaryLine2}
      <div className={styles.modalBodyGuestFooter}>
        <div className={styles.modalBodyGuestFooterAccount}>
          <AccountCircleOutlined className={styles.modalBodyGuestFooterAccountIcon} />
          <a className={styles.modalBodyGuestFooterAccountRegister} href={loginHref}>
            {labels.register}
          </a>
        </div>
        <label className={styles.modalBodyGuestFooterLogin}>
          {labels.alreadyRegistered} <a href={loginHref}>{labels.login}</a>
        </label>
      </div>
    </div>
  );
};
