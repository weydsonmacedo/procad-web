import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import PaperContainer from "../../components/PaperContainer";
import { GlobalStateContext } from "../../store";
import moment from "moment";
import { useHistory } from "react-router";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { updateFormulary } from "../../store/reducers/formulary";

const SnackAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditTable() {
  const [state, dispatch] = useContext(GlobalStateContext);
  const params = useParams();

  const history = useHistory();

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
    setEndDate(x.format("yyyy-MM-DD"));
    x.subtract(2, "y");
    x.add(1, "d");
    if (x.isValid()) {
      setStartDate(x.format("yyyy-MM-DD"));
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
      await updateFormulary(dto, dispatch, params.formularyId);
      setSuccess(true);
      history.push(`/relatorio-de-atividades/${params.formularyId}`);
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setOpen(true);
    }
  };

  function GetRoleId() {
    return ((state.formulary.data || {}).dbFormulary || {}).roleId;
  }

  function GetLevelId() {
    return ((state.formulary.data || {}).dbFormulary || {}).levelId;
  }

  function GetEndDate() {
    const date = new Date(((state.formulary.data || {}).dbFormulary || {}).to);
    const formatedDate = `${date.getFullYear()}-${addLeadingZero(
      date.getMonth() + 1
    )}-${addLeadingZero(date.getDate())}`;
    return formatedDate;
  }

  function GetComission() {
    return ((state.formulary.data || {}).dbFormulary || {}).comission;
  }

  function GetStartDate() {
    const date = new Date(
      ((state.formulary.data || {}).dbFormulary || {}).from
    );
    const formatedDate = `${date.getFullYear()}-${addLeadingZero(
      date.getMonth() + 1
    )}-${addLeadingZero(date.getDate())}`;
    return formatedDate;
  }

  function addLeadingZero(value) {
    return value < 10 ? "0" + value : value;
  }

  function GetClassId() {
    return ((state.formulary.data || {}).dbFormulary || {}).classId;
  }

  function GetTypeFormulary() {
    return ((state.formulary.data || {}).dbFormulary || {}).type;
  }

  const updateComission = (atributte, index, newName) => {
    const updatedComission = { ...comission };

    if (updatedComission) {
      updatedComission[index] = {
        ...updatedComission[index],
        [atributte]: newName,
      };

      setComission(updatedComission);
    }
  };

  const [user, setUser] = useState({
    firstName: localStorage.getItem("firstName") || "User",
    lastName: localStorage.getItem("lastName") || "Name",
    siape: localStorage.getItem("siape") || "XXXXXXX",
  });

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [solicitacao, setSolicitacao] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const [roleId, setRoleId] = useState("");
  const [classId, setClassId] = useState("");
  const [levelId, setLevelId] = useState("");
  const [comission, setComission] = useState({});

  useEffect(() => {
    setRoleId(GetRoleId());
    setLevelId(GetLevelId());
    setEndDate(GetEndDate());
    setStartDate(GetStartDate());
    setClassId(GetClassId());
    setComission(GetComission());
    setSolicitacao(GetTypeFormulary());
  }, [state]);

  return (
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
                    value={startDate}
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
                    value={endDate}
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
            <TextField
              label="Professor"
              name="primeiroProfessor"
              value={comission && comission[0]?.professorName}
              onChange={(e) =>
                updateComission("professorName", 0, e.target.value)
              }
            />
            <TextField
              label="Departamento"
              name="primeiroDepartamento"
              value={comission && comission[0]?.department}
              onChange={(e) => updateComission("department", 0, e.target.value)}
            />
            <TextField
              label="Instituto"
              name="primeiroInstituto"
              value={comission && comission[0]?.institute}
              onChange={(e) => updateComission("institute", 0, e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
            <TextField
              label="Professor"
              name="segundoProfessor"
              value={comission && comission[1]?.professorName}
              onChange={(e) =>
                updateComission("professorName", 1, e.target.value)
              }
            />
            <TextField
              label="Departamento"
              name="segundoDepartamento"
              value={comission && comission[1]?.department}
              onChange={(e) => updateComission("department", 1, e.target.value)}
            />
            <TextField
              label="Instituto"
              name="segundoInstituto"
              value={comission && comission[1]?.institute}
              onChange={(e) => updateComission("institute", 1, e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            <TextField
              label="Professor"
              name="terceiroProfessor"
              value={comission && comission[2]?.professorName}
              onChange={(e) =>
                updateComission("professorName", 2, e.target.value)
              }
            />
            <TextField
              label="Departamento"
              name="terceiroDepartamento"
              value={comission && comission[2]?.department}
              onChange={(e) => updateComission("department", 2, e.target.value)}
            />
            <TextField
              label="Instituto"
              name="terceiroInstituo"
              value={comission && comission[2]?.institute}
              onChange={(e) => updateComission("institute", 2, e.target.value)}
            />
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
            Cancelar Edição
          </Button>

          <Button
            style={{ marginLeft: "auto" }}
            variant="contained"
            color="primary"
            size="large"
            type="submit"
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
          Formulário Editado!
        </SnackAlert>
      </Snackbar>
    </PaperContainer>
  );
}
