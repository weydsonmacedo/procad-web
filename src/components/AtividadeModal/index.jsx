import React, { useContext, useEffect, useState } from 'react';
import {
    Button,
    Container,
    IconButton,
    Typography,
    Modal,
    TextField,
    Input
} from '@material-ui/core';
import PaperContainer from '../PaperContainer';
import { HighlightOff } from "@material-ui/icons"
import { GlobalStateContext } from '../../store';
import moment from 'moment';
import Upload from '../Upload';
import FileList from '../FileList';
import { uniqueId } from 'lodash';
import filesize from 'filesize';

const headerContainer = {
    display: 'flex',
}

const AtividadeModal = ({ open, handleClose, atividade, onSubmit }) => {

    const [state,] = useContext(GlobalStateContext);

    const [semestre1, setSemestre1] = useState(0);
    const [semestre2, setSemestre2] = useState(0);
    const [semestre3, setSemestre3] = useState(0);
    const [semestre4, setSemestre4] = useState(0);

    const [erroQuantidade, setErroQuantidade] = useState(false);
    const [erroComprovantes, setErroComprovantes] = useState(false);


    let { from = '2021-10-4' } = (state.formulary.data || {}).dbFormulary || {};

    let dates = {
        p1: moment(from),
        p2: moment(from).add(6, "months"),
        p3: moment(from).add(12, "months"),
        p4: moment(from).add(18, "months"),
    }

    const intersticio = {
        period1: `${dates.p1.year()}.${dates.p1.month() < 6 ? 1 : 2}`,
        period2: `${dates.p2.year()}.${dates.p2.month() < 6 ? 1 : 2}`,
        period3: `${dates.p3.year()}.${dates.p3.month() < 6 ? 1 : 2}`,
        period4: `${dates.p4.year()}.${dates.p4.month() < 6 ? 1 : 2}`,
    }

    const [upFiles, setUploadedFiles] = useState([]);


    const handleUpload = async (files) => {
        let list = []
        let listAux = []

        var arrayLength = files.length;
        for (var i = 0; i < arrayLength; i++) {
            listAux.push({
                id: uniqueId(),
                name: files[i].name,
                readableSize: filesize(files[i].size),
                content: await toBase64(files[i])
            });
        }

        list = upFiles.concat(listAux);
        setUploadedFiles(list);
        setErroComprovantes(false); 
    };

    const handleDeleteFile = id => {
        setUploadedFiles(upFiles.filter(file => file.id !== id))
    }


    useEffect(() => {

        let { from = '2021-10-4', to = '2022-10-4' } = (state.formulary.data || {}).dbFormulary || {};

        setUploadedFiles([]);

        let dtoFiles = ((atividade || {}).files || {})

        if (!!dtoFiles.length) {

            let list = []

            var arrayLength = dtoFiles.length;

            for (var i = 0; i < arrayLength; i++) {

                list.push({ id: dtoFiles[i].id, name: dtoFiles[i].filename, content: dtoFiles[i].content, });
            }

            setUploadedFiles(list);
        }

        let dto = ((atividade || {}).answers || {})

        let answer = (dto || {}).answer || [];

        const inter = {
            period1: `${dates.p1.year()}.${dates.p1.month() < 7 ? 1 : 2}`,
            period2: `${dates.p2.year()}.${dates.p2.month() < 7 ? 1 : 2}`,
            period3: `${dates.p3.year()}.${dates.p3.month() < 7 ? 1 : 2}`,
            period4: `${dates.p4.year()}.${dates.p4.month() < 7 ? 1 : 2}`,
        }

        let models = [
            { period: inter.period1, cb: setSemestre1 },
            { period: inter.period2, cb: setSemestre2 },
            { period: inter.period3, cb: setSemestre3 },
            { period: inter.period4, cb: setSemestre4 },
        ]

        models.forEach(m => {
            let exist = answer.find(ans => ans.semester === m.period)
            if (exist) m.cb(exist.quantity)
        })
    }, [atividade])

    const getTotal = () => {
        const sum = semestre1 + semestre2 + semestre3 + semestre4;
        let dto = sum / atividade.peso;        
        return (dto * atividade.pontos).toFixed(2);
    }

    const handleSemestreInput = (value, semestre) => {
        let dto = Number(value);
        if (Number.isNaN(dto) || dto < 0) {
            dto = 0;
        }        
        semestre(dto);
        if (dto > 0) {setErroQuantidade(false); }
    }

    const onClose = () => {
        setSemestre1(0);
        setSemestre2(0);
        setSemestre3(0);
        setSemestre4(0);
        setUploadedFiles([]);
        setErroQuantidade(false); 
        setErroComprovantes(false); 

        handleClose()
    }

    const toBase64 = fileObj => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileObj);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const validFormularyAnswer = () => {

        setErroQuantidade(false); 
        setErroComprovantes(false); 
        let valido = true;

        if ((semestre1 + semestre2 + semestre3 + semestre4) <= 0) {
            setErroQuantidade("Quantidade de ocorrência inválida.");     
            valido = false;            
        }

        if (upFiles.length <= 0) {            
            setErroComprovantes("É necessário incluir pelo menos um comprovante.");            
            valido = false;            
        }        
                
        return valido;
    }


    const handleSubmit = () => {


        let answers = (atividade || {}).answers || {}

        let arquivos = []

        if (!!upFiles.length) {

            var arrayLength = upFiles.length;
            for (var i = 0; i < arrayLength; i++) {
                arquivos.push({ id: upFiles[i].id, filename: upFiles[i].name, content: upFiles[i].content });
            }

        }

        const formDto = {
            id: answers.id || null,
            formularyId: null,
            fieldId: null,
            activityId: atividade.id,
            files: arquivos,
            answers: [
                {
                    semester: intersticio.period1,
                    quantity: semestre1
                },
                {
                    semester: intersticio.period2,
                    quantity: semestre2
                },
                {
                    semester: intersticio.period3,
                    quantity: semestre3
                },
                {
                    semester: intersticio.period4,
                    quantity: semestre4
                },
            ]
        }
        if (validFormularyAnswer()) {
            onSubmit(formDto).then(r => {
                onClose();
            });
        }

    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Container>
                <div style={{ marginTop: '10%' }}>
                    <PaperContainer>

                        <div style={headerContainer}>
                            <div style={{ flex: 1 }}>
                                <Typography id="modal-modal-title" variant="h6" component="h3">
                                    {atividade.atividade}
                                </Typography>
                            </div>

                            <div style={{ width: 'maxContent', marginLeft: 8 }}>
                                <IconButton
                                    onClick={onClose}
                                    aria-label="close"
                                    style={{ padding: 6 }}
                                    color="secondary"
                                >
                                    <HighlightOff />
                                </IconButton>
                            </div>
                        </div>
                        <div style={{ marginTop: 36 }}>

                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: 4 }}>
                                    <Typography color="textSecondary" variant="body2">
                                        Quantidade durante o período: {intersticio.period1} a {intersticio.period4}
                                    </Typography>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        <TextField
                                            variant="outlined"
                                            label={intersticio.period1}
                                            type="number"
                                            size="small"
                                            value={semestre1}
                                            error={erroQuantidade}
                                            onChange={(event) => handleSemestreInput(event.target.value, setSemestre1)} />

                                        <TextField
                                            variant="outlined"
                                            label={intersticio.period2}
                                            type="number"
                                            size="small"
                                            value={semestre2}
                                            error={erroQuantidade}
                                            onChange={(event) => handleSemestreInput(event.target.value, setSemestre2)} />

                                        <TextField
                                            variant="outlined"
                                            label={intersticio.period3}
                                            type="number"
                                            size="small"
                                            value={semestre3}
                                            error={erroQuantidade}
                                            onChange={(event) => handleSemestreInput(event.target.value, setSemestre3)} />

                                        <TextField
                                            variant="outlined"
                                            label={intersticio.period4}
                                            type="number"
                                            size="small"
                                            value={semestre4}
                                            error={erroQuantidade}
                                            onChange={(event) => handleSemestreInput(event.target.value, setSemestre4)} />

                                    </div>
                                    <div style={{ marginTop: '5px', textAlign: 'center', color: 'red' }}>
                                        <Typography style={{ fontSize: 12 }}>{erroQuantidade}</Typography>
                                    </div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ marginLeft: '25px' }}>
                                        <Typography color="textSecondary" variant="body2">Referência</Typography>
                                        <div style={{ textAlign: 'left', marginTop: '15px' }}>
                                            <small>{atividade.label}</small>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <Typography color="textSecondary" variant="body2">Total de pontos</Typography>
                                    <div style={{ textAlign: 'center', marginTop: '5px' }}>
                                        <Typography variant="h4" color="primary">{getTotal()}</Typography>
                                    </div>
                                </div>

                            </div>

                            <div style={{ marginTop: '20px', marginBottom: '15px' }}>
                                <div style={{}}>
                                    <Typography color="textSecondary" variant="body2">Comprovante das atividades</Typography>
                                </div>
                                <div style={{ marginTop: '0px', textAlign: 'left', color: 'red', marginBottom: '15px' }}>
                                    <Typography style={{ fontSize: 12 }}>{erroComprovantes}</Typography>
                                </div>
                                <Upload onUpload={handleUpload} />
                                {!!upFiles.length && (
                                    <FileList files={upFiles} onDelete={handleDeleteFile} />
                                )}
                            </div>

                            <div>
                                <Button variant="contained" color="primary" style={{ marginLeft: 'auto', display: 'block' }} onClick={handleSubmit}>Salvar</Button>
                            </div>

                        </div>
                    </PaperContainer>
                </div>
            </Container>
        </Modal>
    );
}

export default AtividadeModal;