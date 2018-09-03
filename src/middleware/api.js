import { normalize, schema } from 'normalizr'
import { camelizeKeys, decamelizeKeys } from 'humps'
import Taro from '@tarojs/taro'
import   apiConfig from '../config/apiConfig'

const API_ROOT =  apiConfig.apiDomain

const callApi = (endpoint, schema, query = null) => {
    let fullUrl = endpoint
    const {method = 'get', data , headers = {}} = query || {}
    const baseURL = endpoint.match('auth/logout') ? API_ROOT.slice(0, -3) : API_ROOT;

    if (method.toLowerCase() === 'get') {
        const q = decamelizeKeys(data||{})
     
        if (q && q.query_optional) {
            Object.keys(q.query_optional).forEach(v => {
                q.query_optional[v] = JSON.parse(q.query_optional[v])
            })

        }
         Object.keys(q).map(v => {
            if(v && q[v])
                return `${v}=${q[v]}`
            else
                return ''
        }).filter(v => v && v.length)
        if (fullUrl.indexOf('?') === -1) {
            fullUrl += '?'
        } else {
            fullUrl += '&'
        }
        fullUrl +=  'q=' + encodeURIComponent(JSON.stringify(q))
}

  const config = {
      url: `${baseURL}${fullUrl}`, 
      data:decamelizeKeys(data||{}),
      method,
      header: {
        'content-type': 'application/json' 
      }
  }
  if(Taro.getStorageSync("session_id")){
     config.header.Cookie = `PHPSESSID=${Taro.getStorageSync("session_id")}`
  }
  
  return Taro.request(config)
}


export const CALL_API = 'Call API'

export default store => next => action => {
    // const loginInfo = store.getState().get('loginInfo').toObject()

    const callAPI = action[CALL_API]
    
    if (typeof callAPI === 'undefined') {
        return next(action)
    }

    let {endpoint} = callAPI
    const {schema, types, query} = callAPI
    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState())
    }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }
    if (!schema) {
        throw new Error('Specify one of the exported Schemas.')
    }

    if (!Array.isArray(types)) {
        throw new Error('Expected an array of action types.')
    }
    if (!types.every(type => typeof type === 'string')) {
        throw new Error('Expected action types to be strings.')
    }

    const actionWith = data => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_API]
        return finalAction
    }
    // if (loginInfo && loginInfo.sessionId) {
    //     if (endpoint.indexOf('?') !== -1) {
    //         endpoint += '&'
    //     } else {
    //         endpoint += '?'
    //     }
    // }
    const [requestType, successType, failureType] = types
  
    next(actionWith({type: requestType}))

    Taro.showLoading({ title: '加载中'})
    Taro.showNavigationBarLoading()

    return callApi(endpoint, schema, query).then(
        response => {

            if(response.statusCode === 200){
                next(actionWith({
                    response: {[schema] :response.data.data},
                    type: successType
                }))
            } else {
                let errMsg = ''
                switch(response.statusCode){
                    case 404:
                        errMsg = '页面未找到404'
                        break
                    case 401:
                        errMsg = '请登录在操作'
                        break
                    default:
                    errMsg = '服务异常'
                }
                Taro.showToast({
                    title: errMsg,
                    icon: 'loading',
                    duration: 1000
                  })
                  next(actionWith({
                      type: failureType,
                      response: errMsg
                  }))
            }
          
            Taro.hideLoading()
            Taro.hideNavigationBarLoading()

            return response
        })
}