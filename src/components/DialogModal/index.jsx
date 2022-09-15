import React from 'react';
import { 
    Button, 
    Container, 
    IconButton, 
    Typography, 
    Modal, 
} from '@material-ui/core';
import PaperContainer from '../PaperContainer';
import { HighlightOff } from "@material-ui/icons"

const headerContainer = {
    display: 'flex',    
}

const DialogModal = ({open, handleClose, onClickYes, onClickNo, titulo, mensagem}) => {
    
    const onClose = () => {        
        handleClose()
    }

    return (
        <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Container>
                <div style={{marginTop: '35%'}}>
                <PaperContainer>

                    <div style={headerContainer}>
                        <div style={{flex: 1}}>
                            <Typography id="modal-modal-title" variant="h6" component="h3">
                                {titulo}
                            </Typography>
                        </div>
                        
                        <div style={{width: 'maxContent', marginLeft: 8}}>
                            <IconButton 
                                onClick={onClose}
                                aria-label="close" 
                                style={{padding: 6}} 
                                color="secondary"
                            >
                                <HighlightOff />
                            </IconButton>
                        </div>
                    </div>
                    <div style={{marginTop: 20}}>
                        
                        <div style={{display: 'flex'}}>
                            <div style={{flex: 2}}>
                                <Typography color="textSecondary" variant="body2">
                                    {mensagem}
                                </Typography>
                                <div style={{display: 'flex', gap: 8, marginTop: 8}}>                                    

                                </div>
                            </div>                        
                        </div>
                        
                        <div style={{display: 'flex', textAlign: 'center', justifyContent: 'center', marginTop: 25}}>
                            <div style={{marginRight: '20px'}}>
                            <Button variant="contained" color="primary" onClick={onClickYes}>Sim</Button>
                            </div>
                            <div>
                            <Button variant="contained" color="primary" onClick={onClickNo}>Não</Button>
                            </div>
                        </div>
                    </div>
                </PaperContainer>
                </div>
            </Container>
        </Modal>
    );
}

export default DialogModal;