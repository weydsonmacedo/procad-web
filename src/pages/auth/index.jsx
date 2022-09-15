import React from 'react';
import { signUp, signIn, forgotPassword, resetPassword } from "../../store/reducers/auth"
import LoginForm from '../../components/LoginForm';
import { Route, useHistory } from 'react-router-dom';
import UserForm from '../../components/UserForm';
import ForgotPassordForm from '../../components/ForgotPasswordForm';
import ResetPassordForm from '../../components/ResetPasswordForm';
import { useContext } from "react";
import { GlobalStateContext } from "../../store";
import { Container } from "@material-ui/core";
import { Snackbar, Alert } from "@mui/material";
import MuiAlert from "@mui/material/Alert"
import './style.css';
import { CircularProgress } from "@mui/material"

const SnackAlert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Auth() {

    let history = useHistory();
    const [state, dispatch] = useContext(GlobalStateContext);

    const [open, setOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [success, setSuccess] = React.useState(false)
    const [successForgotPassword, setForgotPasswordSuccess] = React.useState(false)
    const [successResetPassword, setResetPasswordSuccess] = React.useState(false)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpen(false);
        setErrorMessage("");
    };
    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setSuccess(false);
        setForgotPasswordSuccess(false);
        setResetPasswordSuccess(false);
    };

    const handleSignInSubmit = async (event) => {
        event.preventDefault();

        try {
            await signIn({
                email: event.target.email.value,
                password: event.target.password.value,
            }, dispatch)
            history.push("/"); 
        } catch (error) {
            setErrorMessage(error.response.data.error)
            setOpen(true);
        }
        
        if(state.auth.user) {
            history.push("/");
        }
    }

    const handleSignupSubmit = async (form) => {
        try {
            await signUp(form, dispatch)
            setSuccess(true)
            history.push("/login");
            
        } catch (error) {
            setErrorMessage(error.response.data.error)
            setOpen(true);
        }
    }

    const handleForgotPasswordSubmit = async (form) => {
        try {
            await forgotPassword(form, dispatch)
            setForgotPasswordSuccess(true);
            history.push("/login");
            
        } catch (error) {
            setErrorMessage(error.response.data.error)
            setOpen(true);
        }
    }

    const handleResetPasswordSubmit = async (form) => {
        try {
            await resetPassword(form, dispatch)
            setResetPasswordSuccess(true)
            history.push("/login");
            
        } catch (error) {
            setErrorMessage(error.response.data.error)
            setOpen(true);
        }
    }

    return (
        <Container>
            {state.auth.loading && <div style={{width: "100%", height: "100%", zIndex: 3001, top: 0, left: 0, position: "fixed", display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,.3)"}}>
				<CircularProgress />
			</div>}
            <Route path="/login">
                <LoginForm handleSubmit={handleSignInSubmit} />
            </Route>
            <Route path="/cadastro">
                <UserForm handleSubmit={handleSignupSubmit} />
            </Route>
            <Route path="/forgotPassword">
                <ForgotPassordForm handleSubmit={handleForgotPasswordSubmit} />
            </Route>
            <Route path="/resetPassword/:userId">
                <ResetPassordForm handleSubmit={handleResetPasswordSubmit} />
            </Route>
            <Snackbar open={open} autoHideDuration={3500} onClose={handleClose}>
                <SnackAlert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </SnackAlert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={3500} onClose={handleCloseSuccess}>
                <SnackAlert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Usuário criado!
                </SnackAlert>
            </Snackbar>
            <Snackbar open={successForgotPassword} autoHideDuration={3500} onClose={handleCloseSuccess}>
                <SnackAlert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    E-mail para recuperação de senha enviado!
                </SnackAlert>
            </Snackbar>
            <Snackbar open={successResetPassword} autoHideDuration={3500} onClose={handleCloseSuccess}>
                <SnackAlert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Senha alterada com sucesso!
                </SnackAlert>
            </Snackbar>
            
        </Container>
    )
}

export default Auth;