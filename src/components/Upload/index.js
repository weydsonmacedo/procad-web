import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { DropContainer, UploadMessage } from './styles';

export default class Upload extends Component {
    
    renderDragMessage = (isDragActive, isDragReject) => {
        if (!isDragActive) {
            return <UploadMessage> Anexe aqui os seus comprovantes...</UploadMessage>
        }

        if (isDragReject) {
            return <UploadMessage type="error"> Arquivo não suportado.</UploadMessage>
        }

        return <UploadMessage type="success"> Solte os arquivos aqui</UploadMessage>
    };

    render() {
        const { onUpload } = this.props;

        const acceptedFiles = {
            'application/pdf': ['.pdf'],            
        }
                  
        return (
            <Dropzone accept={acceptedFiles} onDropAccepted={onUpload}>
                {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
                    <DropContainer
                        { ...getRootProps()}
                        isDragActive={isDragActive}
                        isDragReject={isDragReject}
                    >
                        <input { ...getInputProps()} />
                        {this.renderDragMessage(isDragActive, isDragReject)}
                    </DropContainer>
                )}
            </Dropzone>
        );
    }
}