import axios from 'axios'
import Router from 'next/router'

// import { useRouter } from "next/router";
import { BASE_URL } from '../../public/constant'


// import setJWTToken from "./setTokenUtil";
// import Router from 'next/router';

// import { NotificationManager } from 'react-notifications';

const callApi = (url, options, dispatch) => {
  const expiredDate = localStorage.getItem('expired_date')
  if(expiredDate == undefined) {
    Router.push(`/login`)
  }
  if(Date.now() > expiredDate) {
    Router.push(`/login`)
  }

  const jwtToken = localStorage['access_token'] || ''
  // const jwtToken = `Bearer ${USER_TOKEN}`
  if (!options.mode) {
    options.mode = 'cors'
  }
  if (options.headers) {
    if (!options.headers['Content-Type']) {
      Object.assign(options.headers, { 'Content-Type': 'application/json;charset=UTF-8' })
    }
    if (options.headers.Authorization == null) {
      options.headers.Authorization = jwtToken
    }
    if (options.headers.Accept == null) {
      options.headers.Accept = 'application/json'
    }
  } else {
    options.headers = {
      'Content-Type': 'application/json',
      Authorization: jwtToken,
      Accept: 'application/json'
    }
  }

  if (!url.startsWith('http')) {
    if (!url.startsWith('/')) {
      options.url = `/${url}`
    }
    options.url = BASE_URL + url
  } else {
    options.url = url
  }

  return axios(options)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log(error.response)

      if (error.response) {
        //Chưa login -> Xóa hết token và đưa ng dùng về trang login (chưa develop)
        if (error.response.status == 401) {
          // localStorage.removeItem("tokenSth");
          // setJWTToken(null);
          // Router.push("/login");

          return
        }

        //Ko có quyền -> Hiện thông báo (chưa develop)
        if (error.response.data) {
          if (error.response.status == 403) {
            return {
              meta: {
                code: '403',
                error_code: 'FORBIDDEN',
                message: 'Tài khoản không có quyền thao tác'
              }
            }
          }

          //Backend throw exception -> Hiện thông báo lên FE
          return {
            meta: {
              code: error.response.data.meta.code,
              error_code: 'BAD REQUEST',
              message: error.response.data.meta.message
            }
          }
        }
      }

      //BE chết -> Ko gọi đc -> Thông báo
      return {
        meta: {
          code: '2703',
          error_code: 'SEND_REQUEST_FAILED',
          message: 'Lỗi mạng, vui lòng thử lại sau.'
        }
      }
    })
}

export default callApi
