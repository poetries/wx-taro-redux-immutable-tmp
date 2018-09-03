import { CALL_API } from '../middleware/api'

export const FETCH_POETRY_REQUEST = 'FETCH_POETRY_REQUEST'
export const FETCH_POETRY_SUCCESS = 'FETCH_POETRY_SUCCESS'
export const FETCH_POETRY_FAILURE = 'FETCH_POETRY_FAILURE'
export const fetchPoetry = () => (dispatch, getState) => {
  return dispatch({
    [CALL_API]: {
      types: [FETCH_POETRY_REQUEST, FETCH_POETRY_SUCCESS, FETCH_POETRY_FAILURE],
      endpoint: `/mock/5b7fd63f719c7b7241f4e2fa/tangshi/tang-shi`,
      schema: 'poetry',
      query:{
        method:'get',
        data:{

        }
      }
    }
  })
}