import React from 'react';
import {Link, useHistory} from "react-router-dom";
import {ChangeLanguage} from "../../components/Dropdowns/ChangeLanguage";

import {CustomInput, EmptyLayout, FormGroup, ThemeConsumer} from './../../../components';
import {Button, Form, InputGroup,} from 'react-bootstrap';
import {HeaderAuth} from "../../components/Pages/HeaderAuth";
import {FooterAuth} from "../../components/Pages/FooterAuth";
import {useTranslation} from "react-i18next";
import {Formik} from 'formik';

export default function Login() {
    let history = useHistory();
    const {t} = useTranslation();
    return (
        <EmptyLayout>
            <EmptyLayout.Section center>
                { /* START Header */}
                <HeaderAuth title={t('Login.title')} subtitle={t('Login.subtitle')}/>
                { /* END Header */}
                { /* START Form */}
                <Formik
                    isSubmitting={false}
                    onSubmit={(values, actions) => {
                        fetch('http://localhost:3000/user/login', {
                            method: 'POST', // *GET, POST, PUT, DELETE, etc.
                            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                            credentials: 'same-origin', // include, *same-origin, omit
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            redirect: 'follow', // manual, *follow, error
                            referrerPolicy: 'no-referrer', // no-referrer, *client
                            body: JSON.stringify(values) // body data type must match "Content-Type" header
                        })
                            .then(res => res.json())
                            .then(
                                (result) => {
                                    console.log(result);
                                    if (result.token) {
                                        localStorage.setItem('auth', result.token);
                                        setTimeout(() => {
                                            actions.setSubmitting(false);
                                            history.push('/dashboards/analytics');
                                        }, 3000);
                                    }
                                    localStorage.setItem('auth', result.token);
                                },
                                (error) => {
                                    console.log(error);
                                    setTimeout(() => {
                                        -
                                            actions.setSubmitting(false);
                                    }, 3000);
                                }
                            );
                        setTimeout(() => {
                            actions.setSubmitting(false);
                        }, 3000);
                    }}
                    initialValues={{}}>
                    {({
                          handleSubmit,
                          values,
                          isSubmitting,
                          handleChange
                      }) => (
                        <Form noValidate onSubmit={handleSubmit} className="mb-3">
                            <Form.Group>
                                <Form.Label>{t('Login.email')}</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control
                                        type="text"
                                        placeholder={t('Login.emailPlaceholder')}
                                        aria-describedby="inputGroupPrepend"
                                        name="email"
                                        className="bg-white"
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>{t('Register.password')}</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder={t('Login.passwordPlaceholder')}
                                    aria-describedby="inputGroupPrepend"
                                    name="password"
                                    className="bg-white"
                                    value={values.password}
                                    onChange={handleChange}
                                />
                                <Form.Text color="muted"> {t('Login.passwordText')}</Form.Text>
                            </Form.Group>
                            <FormGroup>
                                <CustomInput type="checkbox"
                                             id="rememberPassword"
                                             label={t('Login.rememberMe')}
                                             i
                                             inline/>
                            </FormGroup>
                            <ThemeConsumer>
                                {
                                    ({color}) => (
                                        <Button color={color} block
                                                type="submit"
                                                disabled={isSubmitting}
                                        >{t('Register.signUp')}</Button>
                                    )
                                }
                            </ThemeConsumer>
                        </Form>
                    )}
                </Formik>
                { /* END Form */}
                { /* START Bottom Links */}
                <div className="d-flex mb-5">
                    <Link to="/auth/forgotpassword" className="text-decoration-none">{t('Login.forgotPassword')}</Link>
                    <Link to="/auth/register" className="ml-auto text-decoration-none">{t('Login.Register')}</Link>
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