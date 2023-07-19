import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  IconButton,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import { ArrowBack, Add, Delete } from "@material-ui/icons";
import { Link } from "react-router-dom";
import PaperContainer from "../../components/PaperContainer";
import { createFormulary } from "../../store/reducers/formulary";
import { GlobalStateContext } from "../../store";
import moment from "moment";
import { useHistory } from "react-router";
import { CircularProgress, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { getLevels, getRoles } from "../../store/reducers/common";

const SnackAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditSolicitacao = () => {
  const [state, dispatch] = useContext(GlobalStateContext);
  const history = useHistory();

  const getRole = () => {
    let role = state.common.roles.filter(
      (r) => r.id === ((state.formulary.data || {}).dbFormulary || {}).roleId
    );

    let name = "N/A";

    if (!!role.length) {
      name = role.map((r) => {
        return r.id;
      });
    }

    return name;
  };

  const [user, setUser] = useState({
    firstName: localStorage.getItem("firstName") || "User",
    lastName: localStorage.getItem("lastName") || "Name",
    siape: localStorage.getItem("siape") || "XXXXXXX",
  });

  const [endDate, setEndDate] = useState("");

  const [solicitacao, setSolicitacao] = React.useState("female");
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const [roleId, setRoleId] = useState(getRole()[0]);
  const [classId, setClassId] = useState("");
  const [levelId, setLevelId] = useState("");

  useEffect(() => {
    if (state.auth.user) {
      setUser(state.auth.user);
    }

    async function fetchCommonData() {
      getLevels(dispatch);
      getRoles(dispatch);
    }
    fetchCommonData();
  }, [dispatch]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setErrorMessage("");
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
  };

  const handleSolicitacao = (event) => {
    setSolicitacao(event.target.value);
  };

  const handleStartDateChange = (event) => {
    let x = moment(event.target.value, "yyyy-MM-DD");
    x.subtract(2, "y");
    x.add(1, "d");
    if (x.isValid()) {
      setEndDate(x.format("yyyy-MM-DD"));
    }
  };

  const handleCancelarSolicitacao = () => {
    history.push("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      tipoSolicitacao,
      dataInicio,
      dataFim,
      primeiroProfessor,
      primeiroDepartamento,
      primeiroInstituto,
      segundoProfessor,
      segundoDepartamento,
      segundoInstituto,
      terceiroProfessor,
      terceiroDepartamento,
      terceiroInstituo,
    } = event.target;

    const dto = {
      type: tipoSolicitacao.value, // tipo do formulario
      period: {
        // periodo do formulario
        from: dataInicio.value,
        to: dataFim.value,
      },
      roleId: roleId,
      levelId: levelId,
      classId: classId.toString(),
      comission: [],
    };

    if (primeiroProfessor.value) {
      dto.comission.push({
        professorName: primeiroProfessor.value,
        department: primeiroDepartamento.value,
        institute: primeiroInstituto.value,
      });
    }

    if (segundoProfessor.value) {
      dto.comission.push({
        professorName: segundoProfessor.value,
        department: segundoDepartamento.value,
        institute: segundoInstituto.value,
      });
    }

    if (terceiroProfessor.value) {
      dto.comission.push({
        professorName: terceiroProfessor.value,
        department: terceiroDepartamento.value,
        institute: terceiroInstituo.value,
      });
    }

    try {
      //const data = await createFormulary(dto, dispatch);
      setSuccess(true);
      //history.push(`/relatorio-de-atividades/${data.id}`);
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setOpen(true);
    }
  };

  return (
    <Container>
      {state.formulary.loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            zIndex: 3001,
            top: 0,
            left: 0,
            position: "fixed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,.3)",
          }}
        >
          <CircularProgress />
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/">
          <IconButton edge="start" aria-label="voltar">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography variant="h6">Nova Progressão</Typography>
      </div>

      <PaperContainer>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                  <Typography color="textSecondary">SIAPE</Typography>

                  <Typography variant="h6" color="textSecondary">
                    {user.siape}
                  </Typography>
                </div>
                <div style={{ flex: 3 }}>
                  <Typography color="textSecondary">Nome do Docente</Typography>

                  <Typography variant="h6" color="textSecondary">
                    {user.firstName + " " + user.lastName}
                  </Typography>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, marginLeft: "30px" }}>
              <div style={{ display: "flex" }}>
                <div style={{ flex: 2 }}>
                  <Typography color="textSecondary">
                    Tipo de Solicitação
                  </Typography>

                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="position"
                      name="tipoSolicitacao"
                      defaultValue="top"
                      value={solicitacao}
                      onChange={handleSolicitacao}
                    >
                      <FormControlLabel
                        value="Progressão"
                        control={<Radio color="primary" />}
                        label="Progressão"
                      />
                      <FormControlLabel
                        value="Promoção"
                        control={<Radio color="primary" />}
                        label="Promoção"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ marginTop: "10px", marginBottom: "10px", display: "flex" }}
          >
            <div style={{ flex: 1 }}>
              <div>
                <Typography color="textSecondary">Interstício</Typography>

                <FormControl>
                  <div style={{ display: "flex", gap: 8, marginTop: "12px" }}>
                    <TextField
                      id="date"
                      label="Início"
                      size="small"
                      variant="outlined"
                      value={endDate}
                      type="date"
                      name="dataInicio"
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <TextField
                      id="date"
                      label="Fim"
                      name="dataFim"
                      size="small"
                      variant="outlined"
                      onChange={handleStartDateChange}
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                </FormControl>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex" }}>
                <div style={{ flex: 2, marginLeft: "15px" }}>
                  <Typography color="textSecondary">Perfil</Typography>

                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    style={{ marginBottom: "8px", marginTop: "12px" }}
                  >
                    <Select
                      required
                      id="perfil-input"
                      value={roleId}
                      fullWidth
                      onChange={(event) => setRoleId(event.target.value)}
                    >
                      {state.common.roles.map((role) => (
                        <MenuItem value={role.id} key={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div style={{ flex: 1, marginLeft: "15px" }}>
                  <Typography color="textSecondary">Classe</Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    style={{ marginBottom: "8px", marginTop: "12px" }}
                  >
                    <Select
                      required
                      id="nivel-input"
                      value={levelId}
                      fullWidth
                      onChange={(event) => setLevelId(event.target.value)}
                    >
                      {state.common.levels.map((level) => (
                        <MenuItem value={level.id} key={level.id}>
                          {level.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div style={{ flex: 1, marginLeft: "15px" }}>
                  <Typography color="textSecondary">Nível</Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    style={{ marginBottom: "8px", marginTop: "12px" }}
                  >
                    <Select
                      required
                      id="estadocivil-input"
                      value={classId}
                      fullWidth
                      onChange={(event) => setClassId(event.target.value)}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Typography color="textSecondary">Comissão</Typography>

            <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
              <TextField label="Professor" name="primeiroProfessor" />
              <TextField label="Departamento" name="primeiroDepartamento" />
              <TextField label="Instituto" name="primeiroInstituto" />
            </div>

            <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
              <TextField label="Professor" name="segundoProfessor" />
              <TextField label="Departamento" name="segundoDepartamento" />
              <TextField label="Instituto" name="segundoInstituto" />
            </div>

            <div style={{ display: "flex", gap: 24 }}>
              <TextField label="Professor" name="terceiroProfessor" />
              <TextField label="Departamento" name="terceiroDepartamento" />
              <TextField label="Instituto" name="terceiroInstituo" />
            </div>
          </div>

          <div style={{ width: "100%", display: "flex", paddingTop: "24px" }}>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              type="button"
              onClick={handleCancelarSolicitacao}
              startIcon={<Delete />}
            >
              Cancelar Solicitação
            </Button>

            <Button
              style={{ marginLeft: "auto" }}
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              startIcon={<Add />}
            >
              Relatório de Atividades
            </Button>
          </div>
        </form>
        <Snackbar open={open} autoHideDuration={3500} onClose={handleClose}>
          <SnackAlert
            onClose={handleClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </SnackAlert>
        </Snackbar>
        <Snackbar
          open={success}
          autoHideDuration={3500}
          onClose={handleCloseSuccess}
        >
          <SnackAlert
            onClose={handleCloseSuccess}
            severity="success"
            sx={{ width: "100%" }}
          >
            Solicitação Criada!
          </SnackAlert>
        </Snackbar>
      </PaperContainer>
    </Container>
  );
};

export default EditSolicitacao;
