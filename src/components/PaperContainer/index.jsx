import React from 'react';
import styles from './styles';

const PaperContainer = ({children, ...props}) => {

    const classes = styles();

    return (
        <div props className={classes.cardContainer}>
            {children}
        </div>            
    );
}

export default PaperContainer;