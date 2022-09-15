import { combineReducers } from '../utils';
import { authReducer as auth } from './auth';
import { commonReducer as common } from './common';
import { formularyReducer as formulary } from './formulary'
import { reportReducer as report } from './report'

export default combineReducers({
    auth,
    common,
    formulary,
    report
});