import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/utilities/LoadingScreen";
import Input from "../../components/form/Input";
import useForm from "../../hooks/useForm";
import _ from "lodash";
import Table from "../../components/table/Table";
import uniqid from "uniqid";
import { toast } from "react-toastify";
import apiBackend from "../../services/apiBackend";

export default function VehicleForm({ customer, setCustomer, doSubmit }) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sortColumn, setSortColumn] = useState({
    path: "license_plate",
    order: "asc",
  });
  const vehicleTable = {
    columns: [
      { path: "license_plate", label: "Placa" },
      { path: "model", label: "Modelo" },
      {
        key: "controls",
        label: (
          <button
            onClick={() => {
              addNewVehicle();
            }}
            className="btn btn-success btn-sm"
          >
            Novo&nbsp;
            <i className="fas fa-plus" />
          </button>
        ),
        content: (vehicleRow) => (
          <div className="container text-right">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                const vehicleIndex = customer.vehicles.findIndex(
                  (customerVehicle) => vehicleRow._key === customerVehicle._key
                );
                setSelectedVehicle(vehicleIndex);
                formController.reloadFormValues(
                  customer.vehicles[vehicleIndex]
                );
              }}
            >
              <i className="far fa-eye" />
            </button>
            <button
              onClick={async () => {
                if (
                  !window.confirm(
                    `Você deseja realmente apagar o veículo ${
                      vehicleRow.license_plate ? vehicleRow.license_plate : ""
                    }?`
                  )
                )
                  return;

                customer.vehicles = customer.vehicles.filter(
                  (vehicle) => vehicle._key !== vehicleRow._key
                );
                setCustomer({ ...customer });

                if (customer.vehicles.length > 0) {
                  setSelectedVehicle(0);
                  formController.reloadFormValues(customer.vehicles[0]);
                } else {
                  setSelectedVehicle(null);
                  formController.reloadFormValues({});
                }

                if (vehicleRow._id)
                  await apiBackend.removeVehicle(vehicleRow._id);

                toast.success(
                  `Veículo ${
                    vehicleRow.license_plate ? vehicleRow.license_plate : ""
                  } foi apagado!`
                );
              }}
              className="btn btn-danger btn-sm m-1"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        ),
      },
    ],
  };
  const formController = useForm(
    {
      license_plate: {
        valuePath: "license_plate",
        label: "Placa",
        mask: "license_plate",
        validationRules: { isRequired: true, isLicensePlate: true },
      },
      brand: {
        valuePath: "brand",
        label: "Marca",
      },
      model: {
        valuePath: "model",
        label: "Modelo",
        validationRules: { isRequired: true },
      },
      renavam: {
        valuePath: "renavam",
        label: "Renavam",
      },
      holder: {
        valuePath: "holder",
        label: "Proprietário",
      },
      id: {
        valuePath: "_id",
        label: "Id Veículo",
        readOnly: true,
      },
    },
    doSubmit,
    onChange
  );

  useEffect(() => {
    //Primeira Carga de Dados
    if (customer.vehicles.length > 0 && selectedVehicle === null) {
      setSelectedVehicle(0);
      formController.reloadFormValues(customer.vehicles[0]);
    } else if (selectedVehicle !== null)
      formController.reloadFormValues(customer.vehicles[selectedVehicle]);
    setIsLoaded(true);
    // eslint-disable-next-line
  }, [customer.vehicles]);

  const addNewVehicle = () => {
    const emptyVehicleIndex = customer.vehicles.findIndex(
      (vehicle) => !vehicle.license_plate
    );
    if (emptyVehicleIndex < 0) {
      customer.vehicles.push({ _isValid: false, _key: uniqid() });
      setCustomer({ ...customer });

      const newSelectedIndex = customer.vehicles.length - 1;
      setSelectedVehicle(newSelectedIndex);
      formController.reloadFormValues(customer.vehicles[newSelectedIndex]);
    } else {
      setSelectedVehicle(emptyVehicleIndex);
      formController.reloadFormValues(customer.vehicles[emptyVehicleIndex]);
    }
  };

  const handleSort = (sortColumn) => {
    setSortColumn({ ...sortColumn });
  };

  const getProcessedData = () => {
    const sorted = _.orderBy(
      customer.vehicles,
      [sortColumn.path],
      [sortColumn.order]
    );
    return sorted;
  };

  function onChange(name, valuePath, value) {
    const newCustomer = Object.assign({}, customer);
    _.set(newCustomer.vehicles[selectedVehicle], valuePath, value);
    _.set(
      newCustomer.vehicles[selectedVehicle],
      "_isValid",
      formController.formIsValid
    );
    setCustomer(newCustomer);
  }

  return isLoaded ? (
    customer.vehicles.length > 0 ? (
      <>
        <div className="row">
          <div className="col-sm ">
            <Table
              columns={vehicleTable.columns}
              sortColumn={sortColumn}
              onSort={handleSort}
              data={getProcessedData()}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <form onSubmit={() => {}}>
              <div className="p-3 rounded-lg bg-light">
                <div className="row m-1">
                  <div className="col h3 p-0">
                    <i className="fas fa-car" />
                    &nbsp;Veículo
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm">
                    <Input
                      name="id"
                      onChange={formController.handleChange}
                      formControls={formController.formControls}
                    />
                  </div>
                  <div className="col-sm">
                    <Input
                      name="license_plate"
                      onChange={formController.handleChange}
                      formControls={formController.formControls}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm">
                    <Input
                      name="brand"
                      onChange={formController.handleChange}
                      formControls={formController.formControls}
                    />
                  </div>
                  <div className="col-sm">
                    <Input
                      name="model"
                      onChange={formController.handleChange}
                      formControls={formController.formControls}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm">
                    <Input
                      name="renavam"
                      onChange={formController.handleChange}
                      formControls={formController.formControls}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm">
                    <Input
                      name="holder"
                      onChange={formController.handleChange}
                      formControls={formController.formControls}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    ) : (
      <div className="row align-items-center justify-content-center">
        <div className="col align-self-center text-center">
          <i className="fas fa-car" />
          <p className="h5">
            Não há Veículos
            <br />
            cadastrados ainda
          </p>
          <button
            onClick={() => {
              addNewVehicle();
              setSelectedVehicle(0);
              formController.reloadFormValues(customer.vehicles[0]);
            }}
            className="btn btn-success btn-sm"
          >
            Novo&nbsp;
            <i className="fas fa-plus" />
          </button>
        </div>
      </div>
    )
  ) : (
    <LoadingScreen />
  );
}
