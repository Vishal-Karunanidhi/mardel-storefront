import { useState, useEffect } from 'react';
import { useSelector } from '@Redux/store';

import { CircularProgress } from '@mui/material';
import styles from '@Styles/common/spinner.module.scss';

export default function Spinner(props: any): JSX.Element {
    const { isVisible, className } = useSelector((state) => state.layout.spinnerData);
    return (
        <>
            {(isVisible || props.spinnerVisible) && (
                <div className={styles.spinner}>
                    <CircularProgress className={className} />
                </div>
            )}
        </>
    );
}