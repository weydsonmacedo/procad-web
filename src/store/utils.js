export const combineReducers = (reducers) => (state = {}, action) => {
    const dto =    {};
    for (let key in reducers) {
        dto[key] = reducers[key](state[key], action);
    }
     return dto;
 }
 
 export const reducerSelector = (initialState, reducers) =>
 (state = initialState, action)=> {
     const reducer = reducers[action.type]
     if(reducer) {
         return reducer(state, action)
     }
     return state
 }