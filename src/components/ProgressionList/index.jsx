import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Typography } from '@material-ui/core'
import { Add } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import PaperContainer from '../PaperContainer';
import { GlobalStateContext } from '../../store'
import { getFormularies, deleteFormulary } from '../../store/reducers/formulary';
import FormulariesTable from '../FormulariesTable';
import { useHistory } from 'react-router';
import DialogModal from '../DialogModal';
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

export default function ProgressionList() {

    const history = useHistory();
    const [state, dispatch] = useContext(GlobalStateContext);
    const [openModal, setOpenModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false)    
    const [itemSelected, setItemSelected] = useState("")

    useEffect(() => {
        getFormularies(dispatch).catch(err => {
            history.push("/")
        })
    }, [dispatch])

    const SnackAlert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

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

    const handleClose = () => {
        setItemSelected("");
        setOpenModal(false);
    };

    const handleDeleteClick = (item) => {
        setItemSelected(item);                
        setOpenModal(true);
    }

    const handleClickYes = async () => {
        try {
            await deleteFormulary(itemSelected, dispatch)
            setSuccess(true);
            setOpenModal(false);
        } catch (error) {
            setErrorMessage(error.response.data.error)
        }

        getFormularies(dispatch).catch(err => {
            history.push("/")
        });
    }    

    return (
        <Container>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <Link to="/nova-solicitacao">
                    <Button
                        style={{ marginLeft: 'auto' }}
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<Add />}
                    >
                        Nova Solicitação
                    </Button>
                </Link>
            </div>

            <div>
                <Typography variant="h5" style={{ marginBottom: "20px" }}>Solicitações</Typography>
                {state.formulary.list.length ?
                    <FormulariesTable list={state.formulary.list} onDeleteClick={handleDeleteClick}/>
                    :
                    <div>
                        <div style={{ textAlign: 'center', marginTop: '50px', border: '1px dashed #ddd', borderColor: '#ddd' , borderRadius: '8px', padding: '15px' }}>
                            <Typography variant="body1" color="textSecondary">Nenhuma solicitação em progresso</Typography>
                        </div>
                    </div>
                }
            </div>

            <DialogModal open={openModal} handleClose={handleClose} onClickNo={handleClose} onClickYes={handleClickYes}
            titulo="Excluir Solicitação" 
            mensagem="Ao realizar a exclusão, todos os dados da solicitação serão perdidos. Deseja realmente excluir?"/>
            <Snackbar open={open} autoHideDuration={3500} onClose={handleCloseSnack}>
                <SnackAlert onClose={handleCloseSnack} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </SnackAlert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={3500} onClose={handleCloseSuccess}>
                <SnackAlert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Item excluído com sucess!
                </SnackAlert>
            </Snackbar>

        </Container>
    )
}
