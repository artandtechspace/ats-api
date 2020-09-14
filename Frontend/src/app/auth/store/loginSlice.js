import { createSlice } from '@reduxjs/toolkit';
import jwtService from 'app/services/jwtService';
import bowser from 'bowser';
import { setUserData } from './userSlice';

export const submitLogin = ({ email, password, remember }) => async dispatch => {
	return jwtService
		.signInWithEmailAndPassword(email, password, remember, {
			environment: bowser.getParser(window.navigator.userAgent)
		})
		.then(user => {
			dispatch(setUserData(user));

			return dispatch(loginSuccess());
		})
		.catch(error => {
			return dispatch(loginError(error));
		});
};

const initialState = {
	success: false,
	error: {
		username: null,
		password: null
	}
};

const loginSlice = createSlice({
	name: 'auth/login',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.success = true;
		},
		loginError: (state, action) => {
			state.success = false;
			state.error = action.payload;
		}
	},
	extraReducers: {}
});

export const { loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;
