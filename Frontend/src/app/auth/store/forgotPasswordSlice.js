import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import jwtService from 'app/services/jwtService';

export const submitfPassword = ({ email }) => async dispatch => {
	return jwtService
		.forgotPasswordWithEmail(email)
		.then(user => {
			return dispatch(fPasswordSuccess());
		})
		.catch(error => {
			return dispatch(showMessage({ message: error.message }));
		});
};

const initialState = {
	success: false,
	error: {
		email: null
	}
};

const fPasswordSlice = createSlice({
	name: 'auth/fPassword',
	initialState,
	reducers: {
		fPasswordSuccess: (state, action) => {
			state.success = true;
		},
		loginError: (state, action) => {
			state.success = false;
			state.error = action.payload;
		}
	},
	extraReducers: {}
});

export const { fPasswordSuccess, fPasswordError } = fPasswordSlice.actions;

export default fPasswordSlice.reducer;
