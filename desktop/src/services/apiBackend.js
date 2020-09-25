import axios from "axios";
import { toast } from "react-toastify";
import _ from "lodash";

const apiBackend = axios.create({ baseURL: "http://localhost:3333/API" });

apiBackend.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error(`Algum erro inexperado ocorreu.`);
  } else {
    if (error.response.status === 403 || error.response.status === 401)
      toast.warn("Usuário sem Permissão");
    else
      toast.error(
        `${error.response.status}: ${
          _.isString(error.response.data)
            ? error.response.data
            : "Erro no Webservice"
        }`
      );
  }

  return Promise.reject(error);
  // .catch(err => {});
});

const getCustomerByID = async (id, options = undefined) => {
  if (options) options = JSON.stringify(options);
  const { data: result } = await apiBackend.get(`/customer/${id}`, {
    params: options,
  });
  return result;
};

const getAllCustomers = async (options = undefined) => {
  if (options) options = JSON.stringify(options);
  const { data: result } = await apiBackend.get("/customers", {
    params: options,
  });
  return result;
};

const getAllVehicles = async (options = undefined) => {
  if (options) options = JSON.stringify(options);
  const { data: result } = await apiBackend.get("/vehicles", {
    params: options,
  });
  return result;
};

const saveCustomer = async (newData, options = undefined) => {
  if (options) options = JSON.stringify(options);
  if (newData._id) {
    const body = { ...newData };
    delete body._id;
    const { data: result } = await apiBackend.put(
      `/customer/${newData._id}`,
      body,
      {
        params: options,
      }
    );
    return result;
  }

  const body = { ...newData };
  delete body._id;
  const { data: result } = await apiBackend.post(`/customer`, body, {
    params: options,
  });
  return result;
};

const saveVehicle = async (newData, options = undefined) => {
  if (options) options = JSON.stringify(options);
  if (newData._id) {
    const body = { ...newData };
    delete body._id;
    const { data: result } = await apiBackend.put(
      `/vehicle/${newData._id}`,
      body,
      {
        params: options,
      }
    );
    return result;
  }

  const body = { ...newData };
  delete body._id;
  const { data: result } = await apiBackend.post(`/vehicle`, body);
  return result;
};

const removeVehicle = async (id, options = undefined) => {
  if (options) options = JSON.stringify(options);
  await apiBackend.delete(`/vehicle/${id}`, {
    params: options,
  });
  return true;
};

const removeCustomer = async (id, options = undefined) => {
  if (options) options = JSON.stringify(options);
  await apiBackend.delete(`/customer/${id}`, {
    params: options,
  });
  return true;
};

const checkVehicleAdvised = async (id, check, options = undefined) => {
  if (options) options = JSON.stringify(options);
  await apiBackend.post(`/vehicle/${id}/check/${check}`, {
    params: options,
  });
  return true;
};

export default {
  getCustomerByID,
  getAllCustomers,
  getAllVehicles,
  saveCustomer,
  saveVehicle,
  removeVehicle,
  removeCustomer,
  checkVehicleAdvised,
};
