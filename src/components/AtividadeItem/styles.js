import { makeStyles } from "@material-ui/styles";

const styles = makeStyles((theme) => ({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        borderRadius: '4px',
        border: '2px solid #c4cccb',
        background: '#c4cccb',
        marginTop: '8px',
        '&:hover': {
            border: `2px solid #324b4e`,
        }
    },
    link: {
        textDecoration: 'none',
        color: '#001b21'
    },
    atividadeWrapperActive: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        marginTop: '8px',
        borderRadius: '4px',
        border: '2px solid #2a9d8f',
        cursor: 'pointer',
        '&:hover': {
            background: 'rgba(0,0,0,.05)'
        },
    },
    atividadeWrapper: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        marginTop: '8px',
        borderRadius: '4px',
        cursor: 'pointer',
        '&:hover': {
            border: `1px solid #324b4e`,
            background: 'rgba(0,0,0,.05)'
        },
        boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px'
    }
}));

export default styles;