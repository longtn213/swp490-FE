import callApiNotAuth from "../callApiNotAuth";
import callApi from "../callApi";

export function login(username, password) {
  const endPoint = "/user/login";

  const request = {
    username,
    password,
  };

  const options = {
    method: "POST",
    data: JSON.stringify(request),
  };

  return callApiNotAuth(endPoint, options).then((body) => {
    return body;
  });
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

export function signup(data) {
  const url = `/user/create`;

  const options = {
    method: "POST",
    data: JSON.stringify(data),
  };

  return callApiNotAuth(url, options);
}
