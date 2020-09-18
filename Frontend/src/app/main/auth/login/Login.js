import FuseAnimate from '@fuse/core/FuseAnimate';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { submitLogin } from 'app/auth/store/loginSlice';
import Formsy from 'formsy-react';
import { TextFieldFormsy, CheckboxFormsy } from '@fuse/core/formsy';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	}
}));

function Login() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const login = useSelector(({ auth }) => auth.login);

	const [isFormValid, setIsFormValid] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const formRef = useRef(null);

	useEffect(() => {
		if (login.error && (login.error.email || login.error.password || login.error.remember)) {
			formRef.current.updateInputsWithError({
				...login.error
			});
			disableButton();
		}
	}, [login.error]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit(model) {
		dispatch(submitLogin(model));
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
							LOGIN TO YOUR ACCOUNT
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
								name="email"
								label="Username/Email"
								value="lucaq@awd.co"
								validations={{
									minLength: 4
								}}
								validationErrors={{
									minLength: 'Min character length is 4'
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
								validations={{
									minLength: 4
								}}
								validationErrors={{
									minLength: 'Min character length is 4'
								}}
								InputProps={{
									className: 'pr-2',
									type: showPassword ? 'text' : 'password',
									endAdornment: (
										<InputAdornment position="end">
											<IconButton onClick={() => setShowPassword(!showPassword)}>
												<Icon className="text-20" color="action">
													{showPassword ? 'visibility' : 'visibility_off'}
												</Icon>
											</IconButton>
										</InputAdornment>
									)
								}}
								variant="outlined"
								required
							/>

							<div className="flex items-center justify-between">
								<CheckboxFormsy name="remember" label="Remember Me" />
								<Link className="font-medium" to="/forgot-password">
									Forgot Password?
								</Link>
							</div>

							<Button
								type="submit"
								variant="contained"
								color="primary"
								className="w-full mx-auto mt-16"
								aria-label="LOG IN"
								disabled={!isFormValid}
								value="legacy"
							>
								LOGIN
							</Button>
						</Formsy>

						<div className="my-24 flex items-center justify-center">
							<Divider className="w-32" />
							<span className="mx-8 font-bold">OR</span>
							<Divider className="w-32" />
						</div>

						<Button variant="contained" color="secondary" size="small" className="normal-case w-192 mb-8">
							Log in with GitHub
						</Button>

						<Button variant="contained" color="primary" size="small" className="normal-case w-192">
							Log in with Apple
						</Button>

						<div className="flex flex-col items-center justify-center pt-32 pb-24">
							<span className="font-medium">Don't have an account?</span>
							<Link className="font-medium" to="/register">
								Create an account
							</Link>
						</div>
					</CardContent>
				</Card>
			</FuseAnimate>
		</div>
	);
}

export default Login;
