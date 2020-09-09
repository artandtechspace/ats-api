import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

/* eslint-disable camelcase */

const api = axios.create({
	baseURL: 'http://localhost:3003/api',
	timeout: 10000
});

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();
		const refresh_token = this.getRefreshToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token.split('::')[1])) {
			this.setSession(access_token, refresh_token);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null, null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			api.post('/auth/signup', data)
				.then(response => {
					this.setSession(response.data.webToken.accessToken, response.data.webToken.refreshToken);
					resolve(response.data.user);
				})
				.catch(error => {
					reject(error.response.data.error);
				});
		});
	};

	signInWithEmailAndPassword = (email, password) => {
		return new Promise((resolve, reject) => {
			api.post('/auth/signin', {
				email,
				password
			})
				.then(response => {
					this.setSession(response.data.webToken.accessToken, response.data.webToken.refreshToken);
					resolve(response.data.user);
				})
				.catch(error => {
					reject(error.response.data.error);
				});
		});
	};

	forgotPasswordWithEmail = email => {
		return new Promise((resolve, reject) => {
			api.post('/auth/signin', {
				email
			})
				.then(response => {
					resolve(response.data.user);
				})
				.catch(error => {
					reject(error.response.data.error);
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			api.get('/auth/session/verify', {
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(response => {
					if (response.data.user) {
						this.setSession(response.data.webToken.accessToken, response.data.webToken.refreshToken);
						resolve(response.data.user);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(error => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	};

	updateUserData = user => {
		return api.post('/auth/user/update', {
			user
		});
	};

	setSession = (accessToken, refreshToken) => {
		if (accessToken && refreshToken) {
			localStorage.setItem('jwt_access_token', accessToken);
			localStorage.setItem('jwt_refresh_token', refreshToken);
			api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			localStorage.removeItem('jwt_refresh_token');
			delete api.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.log('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};

	getRefreshToken = () => {
		return window.localStorage.getItem('jwt_refresh_token');
	};
}

const instance = new JwtService();

export default instance;
