import React, { useReducer } from 'react';
import rootReducer from './reducers';
import { auth } from './reducers/auth';
import { common } from './reducers/common';
import { formulary } from './reducers/formulary';
import { report } from './reducers/report';

export const GlobalStateContext = React.createContext({});

const Store = ({children}) => {
    const [state, dispatch] = useReducer(rootReducer, {
        auth,
        common,
        formulary,
        report
    });
    return (
        <GlobalStateContext.Provider value={[state, dispatch]}>
            {children}
        </GlobalStateContext.Provider>
    )
}

export default Store;