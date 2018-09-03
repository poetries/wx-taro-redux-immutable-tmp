import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import api from '../middleware/api'
import rootReducer from '../reducers'

const middlewares = [
  thunkMiddleware,
  api,
  createLogger()
]
export default function configStore () {
  const store = createStore(rootReducer, applyMiddleware(...middlewares))
  return store
}
