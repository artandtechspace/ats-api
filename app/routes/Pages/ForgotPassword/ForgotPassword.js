import React from 'react';
import {Link} from 'react-router-dom';
import {ChangeLanguage} from "../../components/Dropdowns/ChangeLanguage";
import {useTranslation} from "react-i18next";
import {Button, EmptyLayout, Form, FormGroup, FormText, Input, Label, ThemeConsumer} from './../../../components';

import {HeaderAuth} from "../../components/Pages/HeaderAuth";
import {FooterAuth} from "../../components/Pages/FooterAuth";

function ForgotPassword() {
    const {t} = useTranslation();
    return (
        <EmptyLayout>
            <EmptyLayout.Section center>
                { /* START Header */}
                <HeaderAuth
                    title={t('ForgotPassword.title')}
                    subtitle={t('ForgotPassword.subtitle')}
                />
                { /* END Header */}
                { /* START Form */}
                <Form className="mb-3">
                    <FormGroup>
                        <Label for="emailAdress">{t('ForgotPassword.emailOrUsername')}</Label>
                        <Input type="email" name="email" id="emailAdress" placeholder={t('ForgotPassword.emailOrUsernamePlaceholder')} className="bg-white"/>
                    </FormGroup>
                    <div className="d-flex">
                        <ThemeConsumer>
                            {
                                ({color}) => (
                                    <Button color={color} tag={Link} to="/" className="align-self-center">{t('ForgotPassword.reset')}</Button>
                                )
                            }
                        </ThemeConsumer>
                    </div>
                </Form>
                { /* END Form */}
                { /* START Bottom Links */}
                <div className="d-flex mb-5">
                    <Link to="/pages/login" className="text-decoration-none">{t('ForgotPassword.login')}</Link>
                    <Link to="/pages/register" className="ml-auto text-decoration-none">
                        {t('ForgotPassword.register')}
                    </Link>
                </div>
                { /* END Bottom Links */}
                { /* START Footer */}
                <FooterAuth/>
                <ChangeLanguage/>
                { /* END Footer */}
            </EmptyLayout.Section>
        </EmptyLayout>
    )
}

export default ForgotPassword;
