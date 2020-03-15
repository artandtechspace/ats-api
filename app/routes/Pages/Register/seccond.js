import React from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button } from 'reactstrap';
import {CustomInput, EmptyLayout, Form, FormGroup, Input, Label, ThemeConsumer} from "../../../components";
import {HeaderAuth} from "../../components/Pages/HeaderAuth";
import {Link} from "react-router-dom";
import {FooterAuth} from "../../components/Pages/FooterAuth";
import {ChangeLanguage} from "../../components/Dropdowns/ChangeLanguage";
import {useTranslation} from "react-i18next";

export default class Register extends React.Component {
    render() {
        const {t} = useTranslation();
        return (
            <EmptyLayout>
                <EmptyLayout.Section center width={480}>
                    { /* START Header */}
                    <HeaderAuth title={t('Register.title')} subtitle={t('Register.subtitle')}/>
                    { /* END Header */}
                    { /* START Form */}
                    <Form className="mb-3">
                        <FormGroup>
                            <Label for="username">{t('Register.username')}</Label>
                            <Input type="text" name="text" id="username"
                                   placeholder={t('Register.usernamePlaceholder')}
                                   className="bg-white"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">{t('Register.password')}</Label>
                            <Input type="password" name="password" id="password"
                                   placeholder={t('Register.passwordPlaceholder')}
                                   className="bg-white"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="repeatPassword">{t('Register.repeatPassword')}</Label>
                            <Input type="password" name="password" id="repeatPassword"
                                   placeholder={t('Register.passwordPlaceholder')}
                                   className="bg-white"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="emailAddress">{t('Register.email')}</Label>
                            <Input type="email" name="email" id="emailAddress"
                                   placeholder={t('Register.emailPlaceholder')}
                                   className="bg-white"/>
                        </FormGroup>
                        <FormGroup>
                            <CustomInput type="checkbox" id="acceptTerms" label={t('Register.terms')} inline/>
                        </FormGroup>
                        <ThemeConsumer>
                            {
                                ({color}) => (
                                    <Button color={color} block tag={Link}
                                            type="submit">{t('Register.signUp')}</Button>
                                )
                            }
                        </ThemeConsumer>
                    </Form>
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

    constructor(props) {
        super(props);

        this.handleValidSubmit = this.handleValidSubmit.bind(this);
        this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
        this.state = {email: false};
    }

    handleValidSubmit(event, values) {
        this.setState({email: values.email});
    }

    handleInvalidSubmit(event, errors, values) {
        this.setState({email: values.email, error: true});
    }
}
