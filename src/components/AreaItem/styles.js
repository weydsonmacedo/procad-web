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
    }
}));

export default styles;