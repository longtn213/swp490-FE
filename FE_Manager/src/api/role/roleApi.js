import callApi from "../callApi";

export function importRolePermission(data) {
    const url = "/role/role-permission/import";
  
    const options = {
      method: "POST",
      data: data
    };
  
    return callApi(url, options);
  }