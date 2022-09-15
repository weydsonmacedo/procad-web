import React from 'react';
import { Typography } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { Link, useRouteMatch } from 'react-router-dom';

import styles from './styles';


const AreaItem = ({campo}) => {
    const classes = styles();
    const match = useRouteMatch();

    return (
        <Link to={`${match.url}/campo/${campo.id}`} className={classes.link}>
            <div className={classes.wrapper}>
                <Typography variant="h6" style={{flex: 1}}>
                    {campo.campo}
                </Typography>

                <ArrowForward/>
            </div>
        </Link>
    );
}

export default AreaItem;