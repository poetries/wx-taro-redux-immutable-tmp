
import * as ActionTypes from '../actions'
import {Map,List,fromJS} from 'immutable'

export default (state = fromJS({
	fetching : false,
	error 	 : false,
	data 	 : fromJS([])
}), action) => {

	if (action.type === ActionTypes.FETCH_POETRY_REQUEST) {
		return state.merge({
			fetching : true,
			error 	 : false
		})
	}else if(action.type === ActionTypes.FETCH_POETRY_SUCCESS){
    const {poetry} = action.response
		
		return state.merge({
			fetching : false,
			error 	 : false,
			data 	 :poetry
		})
	} else if (action.type === ActionTypes.FETCH_POETRY_FAILURE) {
    return state.merge({
			fetching : false,
			error 	 : true
		})
  }

	return state
}