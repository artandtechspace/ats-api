import React from 'react';

import classes from './PageLoader.scss';
import {useTranslation} from 'react-i18next';

export default function PageLoader() {
    const {t} = useTranslation();
    return (
        <div className={classes.pageLoader}>{t('PageLoader.loading')}</div>
    )
}