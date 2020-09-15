import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const api = axios.create({
	baseURL: 'http://localhost:3003/api',
	timeout: 10000
});

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		api.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleError = (reject, err) => {
		if (!err.status) {
			return reject(new Error('Internal Server Error'));
		}
		return reject(err.response.data.error);
	};

	handleAuthentication = () => {
		const accessToken = this.getAccessToken();
		const refreshToken = this.getRefreshToken();

		if (!accessToken) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(accessToken.split('::')[1])) {
			this.setSession(accessToken, refreshToken);
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
					console.log(response);
					this.setSession(response.data.webToken.accessToken, response.data.webToken.refreshToken);
					resolve(response.data.user);
				})
				.catch(error => {
					console.error('error', error);
					this.handleError(reject, error);
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
					this.handleError(reject, error);
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
					this.handleError(reject, error);
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

	isAuthTokenValid = accessToken => {
		if (!accessToken) {
			return false;
		}
		const decoded = jwtDecode(accessToken);
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
