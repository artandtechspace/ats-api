import FuseUtils from '@fuse/utils';
import appsConfigs from 'app/main/apps/appsConfigs';
import CallbackConfig from 'app/main/callback/CallbackConfig';
import ForgotPasswordConfig from 'app/main/auth/forgot-password/ForgotPasswordPageConfig';
import LoginConfig from 'app/main/auth/login/LoginConfig';
import LogoutConfig from 'app/main/auth/logout/LogoutConfig';
import pagesConfigs from 'app/main/pages/pagesConfigs';
import RegisterConfig from 'app/main/auth/register/RegisterConfig';
import UserInterfaceConfig from 'app/main/user-interface/UserInterfaceConfig';
import React from 'react';
import { Redirect } from 'react-router-dom';
import authsConfigs from '../main/auth/authsConfigs';

const routeConfigs = [
	...appsConfigs,
	...authsConfigs,
	...pagesConfigs,
	UserInterfaceConfig,
	LogoutConfig,
	ForgotPasswordConfig,
	LoginConfig,
	RegisterConfig,
	LogoutConfig,
	CallbackConfig
];

const routes = [
	// if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin', 'staff', 'user']),
	{
		path: '/',
		exact: true,
		component: () => <Redirect to="/apps/dashboards/analytics" />
	},
	{
		component: () => <Redirect to="/pages/errors/error-404" />
	}
];

export default routes;
