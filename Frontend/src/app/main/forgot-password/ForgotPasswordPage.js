import FuseAnimate from '@fuse/core/FuseAnimate';
import { useForm } from '@fuse/hooks';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { TextFieldFormsy } from '@fuse/core/formsy';
import Formsy from 'formsy-react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { submitfPassword } from 'app/auth/store/forgotPasswordSlice';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles(theme => ({
	root: {
		background: `radial-gradient(${darken(theme.palette.primary.dark, 0.5)} 0%, ${theme.palette.primary.dark} 80%)`,
		color: theme.palette.primary.contrastText
	}
}));

function ForgotPasswordPage(props) {
	const dispatch = useDispatch();
	const fPassword = useSelector(({ auth }) => auth.fPassword);

	const classes = useStyles();
	const { form, handleChange, resetForm } = useForm({
		email: ''
	});

	const [isFormValid, setIsFormValid] = useState(false);

	const formRef = useRef(null);

	useEffect(() => {
		if (fPassword.error && (fPassword.error.email || fPassword.error.password)) {
			formRef.current.updateInputsWithError({
				...fPassword.error
			});
			disableButton();
		}
	}, [fPassword.error]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit(module) {
		dispatch(submitfPassword(module));
	}

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32')}>
			<div className="flex flex-col items-center justify-center w-full">
				<FuseAnimate animation="transition.expandIn">
					<Card className="w-full max-w-384 rounded-8">
						<CardContent className="flex flex-col items-center justify-center p-32">
							<div className="w-128 m-32">
								<img src="assets/images/logos/fuse.svg" alt="logo" />
							</div>

							<Typography variant="h6" className="mt-16 mb-32">
								RECOVER YOUR PASSWORD
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

								<Button
									type="submit"
									variant="contained"
									color="primary"
									className="w-full mx-auto mt-16 normal-case"
									aria-label="LOG IN"
									disabled={!isFormValid}
									value="legacy"
								>
									SEND RESET LINK
								</Button>
							</Formsy>

							<div className="flex flex-col items-center justify-center pt-32 pb-24">
								<Link className="font-medium" to="/login">
									Go back to login
								</Link>
							</div>
						</CardContent>
					</Card>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default ForgotPasswordPage;
