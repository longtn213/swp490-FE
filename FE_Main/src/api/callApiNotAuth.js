import axios from 'axios'
import { PUBLIC_WITH_TOKEN } from '../../public/constant'

const callApiNotAuth = (url, options) => {
  if (!options.mode) {
    options.mode = 'cors'
  }
  if (options.headers) {
    if (!options.headers['Content-Type']) {
      Object.assign(options.headers, { 'Content-Type': 'application/json' })
    }

    if (options.headers.Accept == null) {
      options.headers.Accept = 'application/json'
    }
  } else {
    options.headers = {
      'Content-Type': 'application/json',

      Accept: 'application/json'
    }
  }

  if (!url.startsWith('http')) {
    if (!url.startsWith('/')) {
      options.url = `/${url}`
    }
    options.url = PUBLIC_WITH_TOKEN + url
  } else {
    options.url = url
  }

  return axios(options)
    .then(response => {
      console.log('lalalalaallaalala', response.data)

      return response.data
    })
    .catch(error => {
      console.log('lalalalaallaalala', error)
      if (error.response && error.response.data) {
        if (error.response.data.error === 'Forbidden') {
          // NotificationManager.error("Invalid role", "ROLE_ERROR", 5000);
          // Router.push('/');
          // return;
          return {
            result: {
              success: false,
              error_code: error.response.data.error,
              message: 'Tài khoản không có quyền thao tác'
            }
          }
        }
        if (error.response.data.code == '99') {
          return {
            result: {
              success: false,
              error_code: error.response.data.error,
              message: error.response.data.desc
            }
          }
        }

        return error.response.data
      }

      return {
        result: {
          success: false,
          error_code: 'SEND_REQUEST_FAILED',
          message: error
        }
      }
    })
}

export default callApiNotAuth
