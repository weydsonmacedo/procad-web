import React, { useContext } from "react";
import { GlobalStateContext } from "../../store";
import { Redirect, Route } from "react-router-dom"

function PrivateRoute({ children, ...rest }) {
	const [state, dispatch] = useContext(GlobalStateContext);
	const token = localStorage.getItem("token");
	return (
		<Route
			{...rest}
			render={({ location }) =>
			token ? (
					children
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: location }
						}}
					/>
				)
			}
		/>
	);
}

export default PrivateRoute;