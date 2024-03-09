import callApiNotAuth from '../callApiNotAuth'
import callApi from '../callApi'

export function login(username, password) {
  const endPoint = '/user/login'

  const request = {
    username,
    password
  }

  const options = {
    method: 'POST',
    data: JSON.stringify(request)
  }

  return callApiNotAuth(endPoint, options).then(body => {
    return body
  })

  
}

export function changePassword(username, newPassword) {
  const url = '/user/change-password'

  const data = {
    username,
    newPassword
  }

  const options = {
    method: 'POST',
    data: JSON.stringify(data)
  }

  return callApi(url, options);

}

export function getProfile() {
  const url = "/user/profile";

  const options = {
    method: "GET",
  };

  return callApi(url, options);
}

export const callApiGetProfile = async () => {
  const res = await getProfile()
  if (!res) return
  if (!res.data) return
  if (!res.data.role) return
  if (!res.data.role.permissions) return
  localStorage.setItem('permission', JSON.stringify(res.data.role.permissions))
}

export const isAccessible = (permissionCode) => {
  const res = JSON.parse(localStorage.getItem('permission'))
  if(!res) return false
  const result = false
  res?.map(element => {
    if(element.code === permissionCode) {
      result = true
    }
  });

  return result
}
