import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/utilities/LoadingScreen";
import apiBackend from "../../services/apiBackend";
import { toast } from "react-toastify";
import ClienteForm from "./ClienteForm";
import VehicleForm from "./VehiclesForm";
import uniqid from "uniqid";

export default function ClienteInformationForm({ match, history }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    async function fisrtLoad() {
      const { id } = match.params;

      if (id === "novo") {
        setCustomer({ _id: "novo", vehicles: [] });
        setIsLoaded(true);
        return;
      }

      await loadCustomer(id);
      setIsLoaded(true);
    }
    fisrtLoad();
    // eslint-disable-next-line
  }, [match.params]);

  const loadCustomer = async (id) => {
    try {
      const data = await apiBackend.getCustomerByID(id);
      if (data.vehicles)
        data.vehicles = data.vehicles.map((vehicle) => ({
          ...vehicle,
          _isValid: true,
          _key: uniqid(),
        }));
      setCustomer(data);
    } catch (error) {
      history.push(`/não encontrado`);
    }
  };

  async function handleSubmit() {
    try {
      //Valida Subformulários
      if (customer.vehicles)
        customer.vehicles.forEach((vehicle) => {
          if (vehicle._isValid !== true)
            throw new Error(
              `O veículo ${
                vehicle.license_plate ? vehicle.license_plate : ""
              } está inválido`
            );
        });

      //Valida se é um novo cliente
      const { id } = match.params;

      if (id === "novo") customer._id = "";
      // Salva / Cria Novo Cliente
      const savedCustomer = await apiBackend.saveCustomer(customer);

      // Salva / Cria Novo Veículo para Cliente
      if (customer.vehicles)
        savedCustomer.vehicles = await Promise.all(
          customer.vehicles.map(async (vehicle) => {
            vehicle.owner = savedCustomer._id;
            return await apiBackend.saveVehicle(vehicle);
          })
        );

      //Renderiza
      setCustomer(savedCustomer);
      //Alerta
      history.replace({ pathname: `/cliente/${savedCustomer._id}` });
      toast.success(`Cliente ${savedCustomer._id} salvo com Sucesso!`);
    } catch (error) {
      return "error";
    }
  }

  return isLoaded ? (
    <div className="container mt-3">
      <div className="row">
        <div className="col border-right p-2 pr-3">
          <ClienteForm
            customer={customer}
            setCustomer={setCustomer}
            doSubmit={handleSubmit}
          />
        </div>
        <div
          className={`col-sm-5 p-2 pl-3 ${
            customer.vehicles.length <= 0 ? "align-self-center" : ""
          }`}
        >
          <VehicleForm
            customer={customer}
            setCustomer={setCustomer}
            doSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  ) : (
    <LoadingScreen />
  );
}
