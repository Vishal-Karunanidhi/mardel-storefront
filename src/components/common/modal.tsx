import CloseIcon from '@mui/icons-material/Close';
import { CSSProperties, Dispatch, SetStateAction, useEffect, useState, useRef } from 'react';
import styles from '@Styles/components/common/modal.module.scss';

type Props = {
  children: JSX.Element;
  closeModalHandler?: Dispatch<SetStateAction<boolean>>;
  backdropStyle?: CSSProperties;
  modalStyle?: CSSProperties;
};

export function Modal({
  children,
  closeModalHandler,
  backdropStyle,
  modalStyle
}: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const divRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (closeModalHandler) {
          closeModalHandler(false);
        }
      }
    };

    const divElement = divRef.current;
    divElement.addEventListener('keydown', handleKeyDown);
    divElement.setAttribute('tabIndex', '0');
    divElement.focus();

    return () => {
      divElement.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, [isOpen]);
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  function handleModalClose(event) {
    if (closeModalHandler) {
      closeModalHandler(false);
    }
    setIsOpen(false);
  }

  return (
    <div
      className={styles.modalBackdrop}
      style={backdropStyle}
      onClick={handleModalClose}
      ref={divRef}
    >
      <div className={styles.modal} style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalTop}>
          <CloseIcon className={styles.closeIcon} onClick={handleModalClose} />
        </div>
        {children}
      </div>
    </div>
  );
}
