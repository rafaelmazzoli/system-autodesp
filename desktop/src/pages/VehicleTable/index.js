import React, { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import { paginate } from "../../utils/paginate";
import { Link } from "react-router-dom";
import SearchBox from "../../components/utilities/SearchBox";
import Pagination from "../../components/utilities/Pagination";
import _ from "lodash";
import apiBackend from "../../services/apiBackend";
import LoadingScreen from "../../components/utilities/LoadingScreen";
import { toast } from "react-toastify";
import SideFilter from "./SideFilter";
import moment from "moment";

export default function VehicleTable({ history }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [sortColumn, setSortColumn] = useState({
    path: "owner.name",
    order: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterLicense, setFilterLicense] = useState({ license_plate: "" });
  const table = {
    columns: [
      { path: "owner.name", label: "Nome" },
      { path: "owner.phone1", label: "Telefone 1" },
      { path: "license_plate", label: "Placa" },
      { path: "brand", label: "Marca" },
      { path: "model", label: "Modelo" },
      { path: "renavam", label: "Renavam" },
      { path: "holder", label: "Proprietario" },
      {
        key: "advised",
        label: <>Avisado no Mês</>,
        content: (vehicleRow) => (
          <div className="align-middle text-center">
            <input
              type="checkbox"
              onChange={handleAdvisedCheck(vehicleRow)}
              checked={
                vehicleRow.advised &&
                moment().diff(moment(vehicleRow.advised), "days") <= 31
                  ? true
                  : false
              }
            />
          </div>
        ),
      },
      {
        key: "controls",
        label: (
          <Link to="/cliente/novo">
            <button className="btn btn-success btn-sm">
              Novo&nbsp;
              <i className="fas fa-plus" />
            </button>
          </Link>
        ),
        content: (vehicleRow) => (
          <div className="text-right">
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

                const newVehicles = vehicles.filter(
                  (vehicle) => vehicle._id !== vehicleRow._id
                );
                setVehicles(newVehicles);

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
            <Link to={`/cliente/${vehicleRow.owner._id}`}>
              <button className="btn btn-primary btn-sm">
                <i className="far fa-eye" />
              </button>
            </Link>
          </div>
        ),
      },
    ],
    pageSize: 10,
  };

  //Carregar Dados do Banco
  useEffect(() => {
    async function reloadData() {
      await loadVehicles(filterLicense);
      setIsLoaded(true);
    }
    reloadData();
  }, [filterLicense]);

  const loadVehicles = async (filter) => {
    const data = await apiBackend.getAllVehicles({ filter });
    setVehicles(data);
  };

  const handleAdvisedCheck = (vehicleRow) => async (e) => {
    vehicles.forEach((vehicle) => {
      if (vehicleRow._id === vehicle._id)
        vehicle.advised = e.target.checked ? moment() : undefined;
    });
    setVehicles([...vehicles]);

    await apiBackend.checkVehicleAdvised(vehicleRow._id, e.target.checked);
  };

  const getProcessedData = () => {
    const { pageSize } = table;
    let filtered = vehicles;
    if (searchQuery)
      filtered = vehicles.filter((vehicle) =>
        _.toString(_.get(vehicle, sortColumn.path))
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    const ordered = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const data = paginate(ordered, currentPage, pageSize);
    return { totalCount: filtered.length, data };
  };

  const getPlaceHolder = () => {
    const { columns } = table;
    const sortColumnName = columns.filter((c) => {
      return sortColumn.path === c.path ? c : null;
    });
    return `Filtrar por ${sortColumnName[0].label}...`;
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (sortColumn) => {
    setSortColumn({ ...sortColumn });
  };

  const handleRadioFilterChange = async (e) => {
    const newFilter = { license_plate: e.target.value };
    setFilterLicense(newFilter);
  };

  const handleDoubleClickTr = ({ item: vehicle }) => {
    history.push(`/cliente/${vehicle.owner._id}`);
  };

  const { totalCount, data: processedVehicles } = getProcessedData();
  return isLoaded ? (
    <div className="container-fluid p-5">
      <div className="row">
        <SideFilter onRadioFilterChange={handleRadioFilterChange} />
        <div className="col-10">
          <SearchBox
            value={searchQuery}
            onChange={handleSearch}
            placeholder={getPlaceHolder()}
          />
          <div className="pt-1 px-1">
            <Table
              columns={table.columns}
              sortColumn={sortColumn}
              onSort={handleSort}
              data={processedVehicles}
              onDoubleClickTr={handleDoubleClickTr}
            />
          </div>
          <div className="d-flex justify-content-center">
            <Pagination
              itemsCount={totalCount}
              pageSize={table.pageSize}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <LoadingScreen />
  );
}
