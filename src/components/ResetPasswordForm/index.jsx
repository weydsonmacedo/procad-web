import React, { useContext, useState } from 'react'
import {
	TextField,
	Button,
	Typography,
	Grid
} from '@material-ui/core';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { GlobalStateContext } from "../../store/index";
import { CircularProgress, Box } from "@mui/material"
import './style.css';

export default function ResetPasswordForm({ handleSubmit }) {

	const [state, dispatch] = useContext(GlobalStateContext);

	const params = useParams();

	const [password, setPassword] = useState('');
	const [rpassword, setRPassword] = useState('');
	const [passwordError, setPasswordError] = useState(null);

	const validPassword = () => {

		if (password && rpassword === password) {
			if (passwordError) { setPasswordError(null); }
			return true;
		}

		setPasswordError("Credenciais inválidas!")

		return false;
	}

	const onSubmit = (event) => {
		event.preventDefault();

		const dto = {
			userId: params.userId,
			password,
			rpassword,
		}

		if (validPassword()) {			
			handleSubmit(dto)
		}
	}

	return (
		<Grid container alignItems="center" flexwrap="wrap" style={{ height: '100vh' }} >
			<Grid justifyContent="flex-end" xs={12} md={6}>
				<div className="title-auth">
					<h1 className="procad">procad</h1>
					<p className="subtitle">Sistema de Progressão e Promoção de Carreira Acadêmica</p>
				</div>
			</Grid>
			<Grid container justifyContent="flex-end" xs={12} md={6} className="login-form-container">
				<form className="signup-form" noValidate autoComplete="off" onSubmit={handleSubmit}>
					<Typography variant="h5" style={{ marginBottom: '16px', alignSelf: 'start' }}>Alterar Senha</Typography>
					<Grid container spacing={12}>
						<TextField
							required
							id="password-input"
							fullWidth
							size="small"
							label="Senha"
							type="password"
							name="password"
							autoComplete="current-password"
							variant="outlined"
							value={password}
							error={passwordError}
							helperText={passwordError}
							onChange={(event) => setPassword(event.target.value)}
							style={{ marginBottom: '24px' }}
						/>
					</Grid>

					<Grid container spacing={12}>
						<TextField
							required
							id="rpassword-input"
							fullWidth
							size="small"
							label="Repetir Senha"
							type="password"
							name="password"
							autoComplete="current-password"
							variant="outlined"
							value={rpassword}
							error={passwordError}
							helperText={passwordError}
							onChange={(event) => setRPassword(event.target.value)}
							style={{ marginBottom: '24px' }}
						/>
					</Grid>

					<Grid container justifyContent="center" style={{ marginTop: '16px', marginBottom: '10px' }}>
						<Grid item xs={12} md={8} >
							<Button
								onClick={onSubmit}
								color="primary"
								variant="contained"
								type="submit"
								fullWidth>
								Alterar senha
							</Button>
						</Grid>
					</Grid>
					<Link to="/login">
						<Button
							color="primary"
							className="margin"
							fullWidth>
							Voltar
						</Button>
					</Link>
				</form>
			</Grid>
		</Grid>
	)
}
