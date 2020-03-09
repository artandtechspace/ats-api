import React from 'react';
import {Link} from 'react-router-dom';
import {ChangeLanguage} from "../../components/Dropdowns/ChangeLanguage";
import {useTranslation} from "react-i18next";
import {Button, EmptyLayout, Label, ThemeConsumer} from './../../../components';
import {AvField, AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {HeaderAuth} from "../../components/Pages/HeaderAuth";
import {FooterAuth} from "../../components/Pages/FooterAuth";

function Register() {
    const {t} = useTranslation();
    return (
        <EmptyLayout>
            <EmptyLayout.Section center width={480}>
                { /* START Header */}
                <HeaderAuth title={t('Register.title')} subtitle={t('Register.subtitle')}/>
                { /* END Header */}
                { /* START Form */}
                <AvForm className="mb-3">
                    <AvGroup>
                        <Label for="username">{t('Register.username')}</Label>
                        <AvInput type="text" name="text" id="username"
                                 placeholder={t('Register.usernamePlaceholder')}
                                 className="bg-white"/>
                    </AvGroup>
                    <AvGroup>
                        <Label for="password">{t('Register.password')}</Label>
                        <AvField type="password" name="password" id="password"
                                 placeholder={t('Register.passwordPlaceholder')}
                                 className="bg-white"/>
                    </AvGroup>
                    <AvGroup>
                        <Label for="repeatPassword">{t('Register.repeatPassword')}</Label>
                        <AvField type="password" name="password" id="repeatPassword"
                                 validate={{match: {value: 'password'}}}
                                 placeholder={t('Register.passwordPlaceholder')}
                                 className="bg-white"/>
                    </AvGroup>
                    <AvGroup>
                        <Label for="emailAddress">{t('Register.email')}</Label>
                        <AvInput type="email" name="email" id="emailAddress"
                                 placeholder={t('Register.emailPlaceholder')}
                                 className="bg-white"/>
                    </AvGroup>
                    <AvGroup>
                        <AvInput type="checkbox" id="acceptTerms" label={t('Register.terms')} inline/>
                    </AvGroup>
                    <ThemeConsumer>
                        {
                            ({color}) => (
                                <Button color={color} block tag={Link}
                                        type="submit">{t('Register.signUp')}</Button>
                            )
                        }
                    </ThemeConsumer>
                </AvForm>
                { /* END Form */}
                { /* START Bottom Links */}
                <div className="d-flex mb-5">
                    <Link to="/pages/forgot-password"
                          className="text-decoration-none">{t("Register.forgotPassword")}</Link>
                    <Link to="/pages/login" className="ml-auto text-decoration-none">{t("Register.login")}</Link>
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

export default Register;
