import React from 'react';
import {Link} from 'react-router-dom';
import {ChangeLanguage} from "../../components/Dropdowns/ChangeLanguage";

import {Button, EmptyLayout, Form, FormGroup, Input, Label, ThemeConsumer} from './../../../components';

import {HeaderAuth} from "../../components/Pages/HeaderAuth";
import {FooterAuth} from "../../components/Pages/FooterAuth";
import {useTranslation} from "react-i18next";

function LockScreen() {
    const {t} = useTranslation();
    return (
        <EmptyLayout>
            <EmptyLayout.Section center>
                { /* START Header */}
                <HeaderAuth
                    title={t('LockScreen.title')}
                    subtitle={t('LockScreen.subtitle')}
                />
                { /* END Header */}
                { /* START Form */}
                <Form className="mb-3">
                    <FormGroup>
                        <Label for="password">{t('LockScreen.password')}</Label>
                        <Input type="password" name="password" id="password"
                               placeholder={t('LockScreen.passwordPlaceholder')}
                               className="bg-white"/>
                    </FormGroup>
                    <ThemeConsumer>
                        {
                            ({color}) => (
                                <Button color={color} block tag={Link} to="/">{t('LockScreen.unlock')}</Button>
                            )
                        }
                    </ThemeConsumer>
                </Form>
                { /* END Form */}
                { /* START Bottom Links */}
                <div className="d-flex mb-5">
                    <Link to="/pages/login" className="text-decoration-none">{t('LockScreen.signDifferent')}</Link>
                </div>
                { /* END Bottom Links */}
                { /* START Footer */}
                <FooterAuth/>
                <ChangeLanguage/>
                { /* END Footer */}
            </EmptyLayout.Section>
        </EmptyLayout>
    );
}

export default LockScreen;
