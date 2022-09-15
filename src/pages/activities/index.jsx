import React, { useEffect, useState, useContext } from 'react';
import {
    Button,
    Container,
    IconButton,
    Typography
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { useParams, useHistory } from 'react-router-dom';
import PaperContainer from '../../components/PaperContainer';
import AtividadeItem from '../../components/AtividadeItem';
import AtividadeModal from '../../components/AtividadeModal';
import { getActivities } from '../../store/reducers/report';
import { GlobalStateContext } from '../../store';
import { updateFormAnswer, getFormulary } from '../../store/reducers/formulary';
import { getFields, getActivitiesCompleted } from '../../store/reducers/report';
import { Snackbar, CircularProgress } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const SnackAlert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Activities = () => {

    const params = useParams();
    const history = useHistory();

    const [openModal, setOpenModal] = useState(false);
    const [atividadeSelected, setAtividadeSelected] = useState({});

    const [state, dispatch] = useContext(GlobalStateContext);

    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false)

    const campo = (state.report.fields || []).find(el => el.id === params.campoId) || {}

    useEffect(() => {

        getActivities(params.campoId, dispatch).catch(console.log);
    }, [dispatch]);

    let { dbFormularyAnswers = [] } = state.formulary.data || {};
    let fieldAnswers = dbFormularyAnswers.filter(ans => ans.fieldId === params.campoId);

    let { dbFiles = [] } = state.formulary.data || {};    
    let fileAnswers = dbFiles.filter(ans => ans.fieldId === params.campoId);    

    const handleAtividadesRealizadas = async (atividade) => {
        atividade.fieldId = params.campoId;
        atividade.formularyId = params.formularyId
        try {
            await updateFormAnswer(atividade, dispatch);
            setSuccess(true);
        } catch (error) {
            setErrorMessage(error.response.data.error)
            setOpen(true);
        }

    }

    const handleCloseSnack = (event, reason) => {
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

    const getPontuacao = () => {

        let soma = 0;
        fieldAnswers.forEach(fan => {
            let activity = (state.report.activities || []).find(act => fan.activityId === act.id)
            if (activity) {
                const sum = Number(fan.answer[0].quantity) + Number(fan.answer[1].quantity) + Number(fan.answer[2].quantity) + Number(fan.answer[3].quantity);
                let dto = Number(sum / activity.peso);
                soma += Number((dto * activity.pontos).toFixed(2));
            }
        })
        return soma;
    }

    const handleClose = async () => {
        setAtividadeSelected({});
        setOpenModal(false);
        await getFormulary(params.formularyId, dispatch).catch(console.log);
    };

    const handleSelectItem = (atividade) => {
        let answers = fieldAnswers.find(act => act.activityId === atividade.id) || {};
        let files = fileAnswers.filter(fil => fil.activityId === atividade.id) || {};        
        setAtividadeSelected({ ...atividade, answers, files });        
        setOpenModal(true);
    }

    const isDone = (activityId) => {
        return !!fieldAnswers.find(atv => atv.activityId === activityId);
    }

    const goBack = async () => {
        let formulary = await getFormulary(params.formularyId, dispatch).catch(console.log);
        await getFields(dispatch);

        let answers = (formulary || {}).dbFormularyAnswers || [];
        await getActivitiesCompleted(answers, dispatch)

        history.goBack();
    }

    return (
        <Container>
            {state.formulary.loading && <div style={{ width: "100%", height: "100%", zIndex: 9999, top: 0, left: 0, position: "fixed", display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,.3)" }}>
                <CircularProgress />
            </div>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                <div>
                    <IconButton edge="start" aria-label="voltar" onClick={goBack}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="button">
                        Relatório de Atividades
                    </Typography>
                </div>
                <Typography variant="subtitle1">
                    Adicionar Atividade
                </Typography>
            </div>

            <PaperContainer>
                <div style={{ padding: '0 8px 8px 8px' }}>
                    <Typography>{campo.observacao}</Typography>

                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <div style={{ padding: '0 8px' }}>
                        {(state.report.activities || []).map(atv => <AtividadeItem atividade={atv} key={atv.id} onSelectItem={handleSelectItem} done={isDone(atv.id)} />)}

                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                    <div style={{ marginTop: '12px', padding: '0 8px' }}>
                        <Typography>Pontuação Total: <Typography variant="h3" color="primary">{getPontuacao()}</Typography></Typography>
                    </div>

                    <div >
                        <Button variant="contained" color="primary" onClick={goBack}>Confirmar</Button>
                    </div>
                </div>
            </PaperContainer>



            <AtividadeModal open={openModal} handleClose={handleClose} atividade={atividadeSelected} onSubmit={handleAtividadesRealizadas} />
            <Snackbar open={open} autoHideDuration={3500} onClose={handleCloseSnack}>
                <SnackAlert onClose={handleCloseSnack} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </SnackAlert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={3500} onClose={handleCloseSuccess}>
                <SnackAlert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Atividade foi salva!
                </SnackAlert>
            </Snackbar>
        </Container>
    );
}

export default Activities;