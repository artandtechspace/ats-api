import React from 'react';
import {Link} from 'react-router-dom';
import {ChangeLanguage} from "../../components/Dropdowns/ChangeLanguage";

import {
    Button,
    CustomInput,
    EmptyLayout,
    Form,
    FormGroup,
    FormText,
    Input,
    Label,
    ThemeConsumer
} from './../../../components';

import {HeaderAuth} from "../../components/Pages/HeaderAuth";
import {FooterAuth} from "../../components/Pages/FooterAuth";
import {useTranslation} from "react-i18next";

export default function Login() {
    const {t} = useTranslation();
    return (
        <EmptyLayout>
            <EmptyLayout.Section center>
                { /* START Header */}
                <HeaderAuth title={t('Login.title')} subtitle={t('Login.subtitle')}/>
                { /* END Header */}
                { /* START Form */}
                <Form action="/" className="mb-3">
                    <FormGroup>
                        <Label for="emailAdress">{t('Login.email')}</Label>
                        <Input type="email" name="email" id="emailAdress" placeholder={t('Login.emailPlaceholder')}
                               className="bg-white"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">{t('Login.password')}</Label>
                        <Input type="password" name="password" id="password"
                               placeholder={t('Login.passwordPlaceholder')} className="bg-white"/>
                        <FormText color="muted">{t('Login.passwordText')}</FormText>
                    </FormGroup>
                    <FormGroup>
                        <CustomInput type="checkbox" id="rememberPassword" label={t('Login.rememberMe')} inline/>
                    </FormGroup>
                    <ThemeConsumer>
                        {
                            ({color}) => (
                                <Button color={color} block tag={Link} to="/">{t('Login.signIn')}</Button>
                            )
                        }
                    </ThemeConsumer>
                </Form>
                { /* END Form */}
                { /* START Bottom Links */}
                <div className="d-flex mb-5">
                    <Link to="/pages/forgotpassword" className="text-decoration-none">{t('Login.forgotPassword')}</Link>
                    <Link to="/pages/register" className="ml-auto text-decoration-none">{t('Login.Register')}</Link>
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