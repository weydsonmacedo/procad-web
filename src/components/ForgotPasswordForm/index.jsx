import React, { useContext, useState } from 'react'
import {
    TextField,
    Button,
    Typography,
    Grid
} from '@material-ui/core';

import { Link } from 'react-router-dom';
import { GlobalStateContext } from "../../store/index";
import { CircularProgress, Box } from "@mui/material"
import './style.css';

export default function ForgotPasswordForm({ handleSubmit }) {

    const [state, dispatch] = useContext(GlobalStateContext);

    const [email, setEmail] = useState('')

    const onSubmit = (event) => {
        event.preventDefault();

        const dto = {
            email
        }

        handleSubmit(dto)
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
                    <Typography variant="h5" style={{ marginBottom: '16px', alignSelf: 'start' }}>Recuperar Senha</Typography>
                    <Grid container spacing={12}>
                        <TextField
                            required
                            id="email-input"
                            fullWidth
                            label="Email"
                            size="small"
                            name="email"
                            variant="outlined"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            style={{ marginBottom: '8px' }}
                        />
                    </Grid>
                    <Grid container justifyContent="center" style={{ marginTop: '16px', marginBottom: '10px' }}>
                        <Grid item xs={12} md={8}>
                            <Button
                                onClick={onSubmit}
                                color="primary"
                                variant="contained"
                                type="submit"
                                fullWidth>
                                Recuperar
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
