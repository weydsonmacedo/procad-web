import React from 'react';
import { Typography, Box, Modal } from '@material-ui/core';
import { ArrowForward, ExpandMore, Check } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import styles from './styles';




const AtividadeItem = ({atividade, onSelectItem, done}) => {
    const classes = styles();

    const handleSelect = () => {
        onSelectItem(atividade);
    }

    return (
        <div className={classes.link} onClick={handleSelect}>
            <div className={done ? classes.atividadeWrapperActive : classes.atividadeWrapper}>
                <Typography style={{flex: 1}}>
                    {atividade.atividade}
                </Typography>

                {done ? <Check color="primary"/> : <ArrowForward/>}
            </div>
        </div>
    );
}

export default AtividadeItem;