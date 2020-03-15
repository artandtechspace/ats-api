import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {Button, CustomInput, EmptyLayout, FormGroup, Label, ThemeConsumer} from "../../../components";
import {HeaderAuth} from "../../components/Pages/HeaderAuth";
import {Link} from "react-router-dom";
import {FooterAuth} from "../../components/Pages/FooterAuth";
import {ChangeLanguage} from "../../components/Dropdowns/ChangeLanguage";
import {AvField, AvForm} from 'availity-reactstrap-validation';

class Register extends Component {
    render() {
        // eslint-disable-next-line react/prop-types
        const {t} = this.props;
        return (
            <EmptyLayout>
                <EmptyLayout.Section center width={480}>
                    { /* START Header */}
                    <HeaderAuth title={t('Register.title')} subtitle={t('Register.subtitle')}/>
                    { /* END Header */}
                    { /* START Form */}
                    <AvForm className="mb-3">
                        <FormGroup>
                            <Label for="username">{t('Register.username')}</Label>
                            <AvField type="text" name="text" id="username"
                                     placeholder={t('Register.usernamePlaceholder')}
                                     className="bg-white" required/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">{t('Register.password')}</Label>
                            <AvField type="password" name="password" id="password"
                                     placeholder={t('Register.passwordPlaceholder')}
                                     minLength={8}
                                     className="bg-white"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="repeatPassword">{t('Register.repeatPassword')}</Label>
                            <AvField type="password" name="repeatPassword" id="repeatPassword"
                                     placeholder={t('Register.passwordPlaceholder')}
                                     minLength={8}
                                     validate={{match: {value: 'originalEmail'}}}
                                     className="bg-white"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="emailAddress">{t('Register.email')}</Label>
                            <AvField type="email" name="email" id="emailAddress"
                                     placeholder={t('Register.emailPlaceholder')}
                                     className="bg-white"/>
                        </FormGroup>
                        <FormGroup>
                            <CustomInput type="checkbox" id="acceptTerms" label={t('Register.terms')} inline required/>
                        </FormGroup>
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
        )
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

export default withTranslation()(Register);