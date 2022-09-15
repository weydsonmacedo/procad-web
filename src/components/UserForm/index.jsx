import React, { useContext, useEffect, useState } from 'react'
import {
	TextField,
	Button,
	Typography,
	FormControl,
	Select,
	InputLabel,
	MenuItem,
	Grid
} from '@material-ui/core';

import { Link } from 'react-router-dom';
import { GlobalStateContext } from "../../store/index";
import { getAcademicDegrees, getCareers, getNationalities } from '../../store/reducers/common';
import { CIVIL_STATUS } from '../../utils/constants';
import { CircularProgress, Box } from "@mui/material"

import './style.css';

export default function UserForm({ handleSubmit }) {

	const [state, dispatch] = useContext(GlobalStateContext);

	useEffect(() => {
		async function fetchCommonData() {
			getAcademicDegrees(dispatch)
			getCareers(dispatch)
			getNationalities(dispatch)
		}
		fetchCommonData();
	}, [dispatch])

	const [academicDegreeId, setAcademicDegreeId] = useState('');
	const [careerId, setCareerId] = useState('');
	const [civilStatus, setCivilStatus] = useState('');
	const [nationalityId, setNationalityId] = useState('');
	const [birthdate, setBirthdate] = useState(null);
	const [email, setEmail] = useState('')
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [naturalidade, setNaturalidade] = useState('');
	const [password, setPassword] = useState('');
	const [rpassword, setRPassword] = useState('');
	const [siape, setSiape] = useState('');
	const [workload, setWorkload] = useState('');
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
			academicDegreeId, // id do grau academico
			birthdate, // data de aniversario, nulavel
			careerId, // id da carreira
			civilStatus,
			email,
			firstName,
			lastName,
			nationalityId, // id da nacionalidade
			naturalidade, // nulavel
			password,
			siape,
			workload, // carga horaria de trabalho
		}

		if (validPassword()) {
			handleSubmit(dto)
		}

	}

	return (
		<div style={{ marginTop: '64px' }}>

			<div className="app-title-container">
				<h1 className="app-title">procad</h1>
			</div>

			<div className="signup-container">
				<form className="signup-form" noValidate autoComplete="off" onSubmit={handleSubmit}>
					<Typography variant="h5" style={{ marginBottom: '16px', alignSelf: 'start' }}>Cadastro</Typography>

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
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								style={{ marginBottom: '8px' }}
							/>
						</Grid>
						<Grid item xs={12} md={4} sm={6} lg={3}>
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

						<Grid item xs={12} md={4} sm={6} lg={3}>
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
								Registre-se
							</Button>
						</Grid>
					</Grid>
					<Link to="/login" style={{ marginTop: '8px' }}>
						<Button
							color="primary"
							className="margin"
							fullWidth>
							Fazer Login
						</Button>
					</Link>


				</form>
			</div>

		</div>

	)
}
