import React, { useContext, useEffect, useState } from 'react';
import { 
	AppBar, 
	Toolbar, 
	Typography, 
	Menu, 
	MenuItem, 
	Button
} from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import { AccountCircle } from '@material-ui/icons';
import styles from "./styles";
import { logout } from '../../store/reducers/auth';
import { GlobalStateContext } from '../../store';

function Header() {

	const classes = styles();
	const history = useHistory();
	const [state, dispatch] = useContext(GlobalStateContext)

	const [user, setUser] = useState({
		firstName: localStorage.getItem("firstName") || "User",
		lastName: localStorage.getItem("lastName") || "Name",
		siape: localStorage.getItem("siape") || "XXXXXXX"
	});
	const [anchorEl, setAnchorEl] = React.useState(null);
  	const open = Boolean(anchorEl);

	useEffect(() => {
		
		if(state.auth.user){
			setUser(state.auth.user);
		}

	}, [])

	const handleMenu = (event) => {
    	setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
  	
  	const handleLogout = () => {
		setAnchorEl(null);
		logout(dispatch).then(r => {
			history.push("/");
		});
	}	

	const handleMinhaConta = () => {
		setAnchorEl(null);			
		history.push("/minha-conta");		
	}	

	return (
		<AppBar position="static" className={classes.root}>
			<Toolbar className={classes.container}>
				<div className={classes.wrapper}>
				
				<div className={classes.appTitleWrapper}>
					<Typography variant="h6" className={classes.appTitle} onClick={() => history.push("/")}>
						procad
					</Typography>
				</div>
				
				<div className={classes.userMenu}>
					<Button
						aria-label="account of current user"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						onClick={handleMenu}
						color="inherit"
					>
						<AccountCircle style={{marginRight: '10px'}}/>
						<Typography style={{ textTransform: 'initial' }}>Olá, <strong style={{ fontWeight: 'bolder'}}>{user.firstName}</strong></Typography>
					</Button>

					<Menu
						id="menu-appbar"
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={open}
						onClose={handleClose}
					>
						{/* <MenuItem onClick={handleClose}>Minha Conta</MenuItem> */}
						<MenuItem onClick={handleMinhaConta}>Minha Conta</MenuItem>
						<MenuItem onClick={handleLogout}>Sair</MenuItem>
					</Menu>
				</div>

				</div>
			</Toolbar>
		</AppBar>
	);
}

export default Header;