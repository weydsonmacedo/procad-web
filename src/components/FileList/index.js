import React from 'react';
import { Container, FileInfo, Preview } from './styles';
import pdf from '../../img/icone-pdf.png'

const FileList = ({ files, onDelete }) => (
    <Container>
        {files.map(uploadedFile => (
            <li key={uploadedFile.id}>
                <FileInfo>
                    <Preview src={pdf} />
                    <div>
                        <strong>{uploadedFile.name}</strong>
                        <span>
                            {uploadedFile.readableSize}
                            <a
                                download={uploadedFile.name}
                                href={uploadedFile.content}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Baixar
                            </a>
                            <button onClick={() => onDelete(uploadedFile.id)}>Excluir</button>
                        </span>
                    </div>
                </FileInfo>
                <div>
                </div>
            </li>
        ))}
    </Container>
);

export default FileList;