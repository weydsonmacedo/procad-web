import { makeStyles } from "@material-ui/styles"

const styles = makeStyles((theme) => ({
    root: {
        marginBottom: '48px',
    },
    container: {
        justifyContent: 'center'
    },
    wrapper: {
        display: 'flex',
        maxWidth: '1280px',
        width: '100%',
        alignItems: 'center',
        flex: 1,
    },
    userMenu: {
        paddingRight: '24px',
    },
    appTitle: {
        fontSize: '40px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    appTitleWrapper: {
        flexGrow: 1,
        paddingLeft: '24px',
    }
}))

export default styles