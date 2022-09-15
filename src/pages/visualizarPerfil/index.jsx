import React, { useContext, useEffect, useState } from 'react'
import {
    TextField,
    Button,
    Typography,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Grid,
    Container
} from '@material-ui/core';

import { GlobalStateContext } from "../../store/index";
import { getAcademicDegrees, getCareers, getNationalities } from '../../store/reducers/common';
import { CIVIL_STATUS } from '../../utils/constants';
import moment from 'moment';
import { getUser, updateUser } from '../../store/reducers/auth';
import { useHistory } from 'react-router';
import { CircularProgress } from "@mui/material";
import './style.css';
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert"

const SnackAlert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function VisualizarPerfil() {

    const [state, dispatch] = useContext(GlobalStateContext);
    const history = useHistory();    
    
    const [academicDegreeId, setAcademicDegreeId] = useState('');
    const [careerId, setCareerId] = useState('');
    const [civilStatus, setCivilStatus] = useState('');
    const [nationalityId, setNationalityId] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [naturalidade, setNaturalidade] = useState('');
    const [siape, setSiape] = useState('');
    const [workload, setWorkload] = useState('');

    useEffect(() => {

        async function fetchCommonData() {
            getAcademicDegrees(dispatch)
            getCareers(dispatch)
            getNationalities(dispatch)

            let usuario = await getUser(localStorage.getItem("userId"), dispatch).catch(err => {
                history.push("/")
            })

            if (usuario) {
                setFirstName(usuario.firstName)
                setLastName(usuario.lastName)
                setEmail(usuario.email)
                setSiape(usuario.siape)
                setWorkload(usuario.workload)
                setNaturalidade(usuario.naturalidade)
                setNationalityId(usuario.nationalityId)
                setCareerId(usuario.careerId)
                setCivilStatus(usuario.civilStatus)
                setAcademicDegreeId(usuario.academicDegreeId)
                setBirthdate(moment(usuario.birthdate).format("yyyy-MM-DD"))
            }
        }
        fetchCommonData();

    }, [dispatch])

    const goBack = () => {
        history.goBack()
    }

    const [open, setOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [success, setSuccess] = React.useState(false)

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
    };

	const handleSubmit = async (form) => {
        try {
            await updateUser(form, dispatch)
            setSuccess(true)            
            
        } catch (error) {
            setErrorMessage(error.response.data.error)
            setOpen(true);
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const dto = {
            id: localStorage.getItem("userId"),
            academicDegreeId, // id do grau academico
            birthdate, // data de aniversario, nulavel
            careerId, // id da carreira
            civilStatus,
            firstName,
            lastName,
            nationalityId, // id da nacionalidade
            naturalidade, // nulavel			
            siape,
            workload, // carga horaria de trabalho
        }

        handleSubmit(dto)
    }

    return (
        <Container>
            {state.auth.loading && <div style={{ width: "100%", height: "100%", zIndex: 9999, top: 0, left: 0, position: "fixed", display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,.3)" }}>
                <CircularProgress />
            </div>}
            <form className="signup-form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Typography variant="h5" style={{ marginBottom: '25px', alignSelf: 'start' }}>Minha conta</Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sm={6} lg={3}>
                        <TextField
                            required
                            labelId="firstname-input-label"
                            id="firstname-input"
                            value={firstName}
                            variant="outlined"
                            size="small"
                            fullWidth
                            onChange={(event) => setFirstName(event.target.value)}
                            label="Primeiro Nome"
                        />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6} lg={3}>
                        <FormControl variant="outlined" fullWidth size="small" style={{ marginBottom: '8px' }}>
                            {/* <InputLabel id="formacao-input-label">Primeiro Nome</InputLabel> */}
                            <TextField
                                labelId="lastname-input-label"
                                id="lastname-input"
                                value={lastName}
                                variant="outlined"
                                size="small"
                                fullWidth
                                onChange={(event) => setLastName(event.target.value)}
                                label="Último Nome"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4} sm={6} lg={3}>
                        <FormControl variant="outlined" fullWidth size="small" style={{ marginBottom: '8px' }}>
                            <InputLabel id="formacao-input-label">Formação</InputLabel>
                            <Select
                                required
                                labelId="formacao-input-label"
                                id="formacao-input"
                                value={academicDegreeId}
                                fullWidth
                                onChange={(event) => setAcademicDegreeId(event.target.value)}
                                label="Formação"
                            >
                                {state.common.academicDegrees.map(acd => (
                                    <MenuItem value={acd.id} key={acd.id}>
                                        {acd.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6} lg={3}>
                        <FormControl variant="outlined" fullWidth size="small" style={{ marginBottom: '8px' }}>
                            <InputLabel id="carreira-input-label">Carreira</InputLabel>
                            <Select
                                required
                                labelId="carreira-input-label"
                                id="carreira-input"
                                value={careerId}
                                fullWidth
                                onChange={(event) => setCareerId(event.target.value)}
                                label="Carreira"
                            >
                                {state.common.careers.map(career => (
                                    <MenuItem value={career.id} key={career.id}>
                                        {career.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6} lg={3}>
                        <FormControl variant="outlined" fullWidth size="small" style={{ marginBottom: '8px' }}>
                            <InputLabel id="estadocivil-input-label">Estado Civil</InputLabel>
                            <Select
                                labelId="estadocivil-input-label"
                                id="estadocivil-input"
                                value={civilStatus}
                                fullWidth
                                onChange={(event) => setCivilStatus(event.target.value)}
                                label="Estado Civil"
                            >
                                <MenuItem value={CIVIL_STATUS.SINGLE}>
                                    Solteiro(a)
                                </MenuItem>
                                <MenuItem value={CIVIL_STATUS.MARRIED}>
                                    Casado(a)
                                </MenuItem>
                                <MenuItem value={CIVIL_STATUS.DIVORCED}>
                                    Divorciado(a)
                                </MenuItem>
                                <MenuItem value={CIVIL_STATUS.WIDOWED}>
                                    Viúvo(a)
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6} lg={3}>
                        <FormControl variant="outlined" fullWidth size="small" style={{ marginBottom: '8px' }}>
                            <InputLabel id="nacionalidade-input-label">Nacionalidade</InputLabel>
                            <Select
                                required
                                labelId="nacionalidade-input-label"
                                id="nacionalidade-input"
                                value={nationalityId}
                                fullWidth
                                onChange={(event) => setNationalityId(event.target.value)}
                                label="Nacionalidade"
                            >
                                {state.common.nationalities.map(nat => (
                                    <MenuItem value={nat.id} key={nat.id}>
                                        {nat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6} lg={3}>
                        <TextField
                            id="date"
                            label="Nascimento"
                            fullWidth
                            size="small"
                            variant="outlined"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={birthdate}
                            onChange={(event) => setBirthdate(event.target.value)}
                            style={{ marginBottom: '8px' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6} lg={3}>
                        <TextField
                            required
                            id="naturalidade-input"
                            fullWidth
                            label="Naturalidade"
                            size="small"
                            name="naturalidade"
                            variant="outlined"
                            value={naturalidade}
                            onChange={(event) => setNaturalidade(event.target.value)}
                            style={{ marginBottom: '8px' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6} lg={3}>
                        <TextField
                            required
                            id="siape-input"
                            fullWidth
                            label="Siape"
                            size="small"
                            name="siape"
                            variant="outlined"
                            value={siape}
                            onChange={(event) => setSiape(event.target.value)}
                            style={{ marginBottom: '8px' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} sm={6} lg={3}>
                        <TextField
                            required
                            id="email-input"
                            fullWidth
                            label="Email"
                            size="small"
                            name="email"
                            variant="outlined"
                            disabled
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            style={{ marginBottom: '8px' }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4} sm={6} lg={3}>
                        <TextField
                            id="workload-input"
                            fullWidth
                            size="small"
                            label="Carga Horária"
                            name="workload"
                            variant="outlined"
                            value={workload}
                            onChange={(event) => setWorkload(event.target.value)}
                            style={{ marginBottom: '24px' }}
                        />
                    </Grid>
                </Grid>

                <Grid container justifyContent="center">
                    <Grid item xs={12} md={4}>
                        <Button
                            onClick={onSubmit}
                            color="primary"
                            variant="contained"
                            type="submit"
                            fullWidth>
                            Alterar Cadastro
                        </Button>
                    </Grid>                    
                </Grid>
                <Grid item xs={12} md={4}>
                        <Button
                            onClick={goBack}
                            color="primary"
                            className="margin"
                            fullWidth>
                            Voltar
                        </Button>
                    </Grid>
            </form>

            <Snackbar open={open} autoHideDuration={3500} onClose={handleClose}>
                <SnackAlert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </SnackAlert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={3500} onClose={handleCloseSuccess}>
                <SnackAlert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Dados cadastrais atualzizados com sucesso!
                </SnackAlert>
            </Snackbar>

        </Container>

    )
}
