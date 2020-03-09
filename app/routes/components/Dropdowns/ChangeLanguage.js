import React from 'react';
import {DropdownToggle} from './../../../components';
import {DropdownItem, DropdownMenu, UncontrolledButtonDropdown} from "../../../components";
import {useTranslation} from "react-i18next";
import i18n from "../../../config/i18n";

export function ChangeLanguage() {
    const {t} = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    return (
        <UncontrolledButtonDropdown>
            <DropdownToggle caret color="secondary" outline>
                {t(window.localStorage.i18nextLng)}
            </DropdownToggle>
            <DropdownMenu persist>
                <DropdownItem selected value="en" onClick={() => {
                    changeLanguage('en');
                }}>{t('en')}</DropdownItem>
                <DropdownItem value="de" onClick={() => {
                    changeLanguage('de');
                }}>{t('de')}</DropdownItem>
            </DropdownMenu>
        </UncontrolledButtonDropdown>
    );
}