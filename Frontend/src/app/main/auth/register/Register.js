import FuseAnimate from '@fuse/core/FuseAnimate';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Formsy from 'formsy-react';
import { submitRegister } from 'app/auth/store/registerSlice';
import { useDispatch, useSelector } from 'react-redux';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import { CheckboxFormsy, TextFieldFormsy } from '../../../../@fuse/core/formsy';

const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	}
}));

function Register() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const register = useSelector(({ auth }) => auth.register);

	const [isFormValid, setIsFormValid] = useState(false);
	const formRef = useRef(null);

	useEffect(() => {
		if (register.error && (register.error.username || register.error.password || register.error.email)) {
			formRef.current.updateInputsWithError({
				...register.error
			});
			disableButton();
		}
	}, [register.error]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit(model) {
		dispatch(submitRegister(model));
	}

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-auto flex-shrink-0 p-24 md:flex-row md:p-0')}>
			<div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
				<FuseAnimate animation="transition.expandIn">
					<img className="w-128 mb-32" src="assets/images/logos/fuse.svg" alt="logo" />
				</FuseAnimate>

				<FuseAnimate animation="transition.slideUpIn" delay={300}>
					<Typography variant="h3" color="inherit" className="font-light">
						Welcome to the FUSE!
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={400}>
					<Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper nisl erat, vel
						convallis elit fermentum pellentesque. Sed mollis velit facilisis facilisis.
					</Typography>
				</FuseAnimate>
			</div>

			<FuseAnimate animation={{ translateX: [0, '100%'] }}>
				<Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
					<CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
						<Typography variant="h6" className="md:w-full mb-32">
							CREATE AN ACCOUNT
						</Typography>

						<Formsy
							onValidSubmit={handleSubmit}
							onValid={enableButton}
							onInvalid={disableButton}
							ref={formRef}
							className="flex flex-col justify-center w-full"
						>
							<TextFieldFormsy
								className="mb-16"
								type="text"
								name="firstname"
								value="Luca"
								label="Firstname"
								validations={{
									minLength: 3
								}}
								validationErrors={{
									minLength: 'Min character length is 3'
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Icon className="text-20" color="action">
												person
											</Icon>
										</InputAdornment>
									)
								}}
								variant="outlined"
								required
							/>
							<TextFieldFormsy
								className="mb-16"
								type="text"
								name="lastname"
								value="Schöneberg"
								label="Lastname"
								validations={{
									minLength: 3
								}}
								validationErrors={{
									minLength: 'Min character length is 3'
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Icon className="text-20" color="action">
												person
											</Icon>
										</InputAdornment>
									)
								}}
								variant="outlined"
								required
							/>

							<TextFieldFormsy
								className="mb-16"
								type="text"
								name="email"
								label="Email"
								value="lucaq@awd.co"
								validations="isEmail"
								validationErrors={{
									isEmail: 'Please enter a valid email'
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Icon className="text-20" color="action">
												email
											</Icon>
										</InputAdornment>
									)
								}}
								variant="outlined"
								required
							/>

							<TextFieldFormsy
								className="mb-16"
								type="password"
								name="password"
								label="Password"
								value="L!23123adawAW"
								validations="equalsField:password-confirm"
								validationErrors={{
									equalsField: 'Passwords do not match'
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Icon className="text-20" color="action">
												vpn_key
											</Icon>
										</InputAdornment>
									)
								}}
								variant="outlined"
								required
							/>

							<TextFieldFormsy
								className="mb-16"
								type="password"
								name="password-confirm"
								label="Confirm Password"
								value="L!23123adawAW"
								validations="equalsField:password"
								validationErrors={{
									equalsField: 'Passwords do not match'
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Icon className="text-20" color="action">
												vpn_key
											</Icon>
										</InputAdornment>
									)
								}}
								variant="outlined"
								required
							/>

							<FormControl className="items-center">
								<CheckboxFormsy
									name="acceptTermsConditions"
									label="I read and accept terms and conditions"
								/>
							</FormControl>

							<Button
								variant="contained"
								color="primary"
								className="w-full mx-auto mt-16"
								aria-label="Register"
								disabled={!isFormValid}
								type="submit"
							>
								CREATE AN ACCOUNT
							</Button>
						</Formsy>

						<div className="flex flex-col items-center justify-center pt-32 pb-24">
							<span className="font-medium">Already have an account?</span>
							<Link className="font-medium" to="login">
								Login
							</Link>
						</div>
					</CardContent>
				</Card>
			</FuseAnimate>
		</div>
	);
}

export default Register;
