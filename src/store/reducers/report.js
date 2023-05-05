import { reducerSelector } from '../utils';
import axios from 'axios';


export const report = {
	fields: [],
	activities: [],
	allActivities: [],
	loading: false
}

export const ActionsTypes = {
	LOADING: 'loading/report',
	GET_FIELDS: 'fields/report',
	GET_ACTIVITIES: 'activities/report',
	CLEAR_ALL: 'clear/report',
	SET_ALL_ACTIVITIES: 'allActivities/report',

}

export const reportReducer = reducerSelector(report, {
	[ActionsTypes.LOADING](state, action) {
		const dto = {
			...state,
			loading: action.payload
		}
		return dto;
	},
	[ActionsTypes.GET_FIELDS](state, action) {
		const dto = {
			...state,
			fields: action.payload
		}
		return dto;
	},
	[ActionsTypes.GET_ACTIVITIES](state, action) {
		const dto = {
			...state,
			activities: action.payload
		}
		return dto
	},
	[ActionsTypes.SET_ALL_ACTIVITIES](state, action) {
		const dto = {
			...state,
			allActivities: action.payload
		}
		return dto
	}
})

// ActionCreators
export const setLoading = (isLoading, dispatch) => dispatch({ type: ActionsTypes.LOADING, payload: isLoading });
export const setFields = (fields, dispatch) => dispatch({ type: ActionsTypes.GET_FIELDS, payload: fields })
export const setActivities = (activities, dispatch) => dispatch({ type: ActionsTypes.GET_ACTIVITIES, payload: activities })
export const setAllActivities = (activities, dispatch) => dispatch({ type: ActionsTypes.SET_ALL_ACTIVITIES, payload: activities })
export const setEmail = (data, dispatch) => dispatch({ type: ActionsTypes.GET_FORMULARY, payload: data })

export function getFields(dispatch) {
	setLoading(true, dispatch);
	return axios.get('/fields')
		.then(({data}) => {
			setFields(data, dispatch)
			return data;
		})
		.catch(err => {
			console.log(err);
		})
		.finally(res => {
			setLoading(false, dispatch);
		})
}

export function getActivities(fieldId, dispatch) {
	setLoading(true, dispatch);
	return axios.get(`/field/${fieldId}/activities`)
		.then(({data}) => {
			setActivities(data, dispatch)
			return data
		}).catch(err => {
			console.log(err);
		})
		.finally(res => {
			setLoading(false, dispatch);
		})
}

export async function getActivitiesCompleted(list, dispatch){	
	setLoading(true, dispatch);	
	await axios.all(list.map(field => axios.get(`/field/${field.fieldId}/activities`)))
		.then(results => {
			let dto = [];
			let completed = [];

			results.forEach(r => {
				r.data.forEach( el => dto.push(el))
			})
			list.forEach(fan => {
				let activity = (dto || []).find(act => fan.activityId === act.id)
				if(activity){
					const sum = Number(fan.answer[0].quantity) + Number(fan.answer[1].quantity) + Number(fan.answer[2].quantity) + Number(fan.answer[3].quantity);
					let dto = Number(sum/activity.peso);
					let soma = Number((dto * activity.pontos).toFixed(2));
					let answerId = fan.id
					
					completed.push({
						points: soma,
						formularyAnswerId: answerId,
						...activity
					})
				}
			})
			setAllActivities(completed, dispatch)
		})
		.finally(r => {
			setLoading(false, dispatch);
		})        
}



export async function sendEmail(mail, dispatch) {
	setLoading(true, dispatch);
	return await axios.post('/email', mail)
	.then(({data}) => {
		return data;
		
	})
	.catch(err => {
		console.log(err);
		throw err;
	})
	.finally(res => {
		setLoading(false, dispatch);
	})
}

