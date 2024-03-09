import callApi from '../callApi'
import callApiNotAuth from '../callApiNotAuth'

export function forgotPassword(username) {
  let url = `/user/forgot-password`

  const options = {
    method: 'POST',
    data: {username: username}
  }

  return callApiNotAuth(url, options)
}