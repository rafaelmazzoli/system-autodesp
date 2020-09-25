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

export default function CustomerTable({ history }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const table = {
    columns: [
      { path: "name", label: "Nome" },
      { path: "cpf_cnpj", label: "CPF/CNPJ" },
      { path: "phone1", label: "Telefone 1" },
      { path: "email", label: "E-mail" },
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
        content: (customerRow) => (
          <div className="container text-right">
            <button
              onClick={async () => {
                if (
                  !window.confirm(
                    `Você deseja realmente apagar a pessoa ${
                      customerRow.name ? customerRow.name : ""
                    }?`
                  )
                )
                  return;

                const newCustomers = customers.filter(
                  (customer) => customer._id !== customerRow._id
                );
                setCustomers(newCustomers);

                if (customerRow._id)
                  await apiBackend.removeCustomer(customerRow._id);

                toast.success(
                  `Pessoa ${
                    customerRow.name ? customerRow.name : ""
                  } foi apagada!`
                );
              }}
              className="btn btn-danger btn-sm m-1"
            >
              <i className="fas fa-times" />
            </button>
            <Link to={`/cliente/${customerRow._id}`}>
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
    async function firstLoad() {
      await loadCustomers();
      setIsLoaded(true);
    }
    firstLoad();
  }, []);

  const loadCustomers = async () => {
    const data = await apiBackend.getAllCustomers();
    setCustomers(data);
  };

  const getProcessedData = () => {
    const { pageSize } = table;
    let filtered = customers;
    if (searchQuery)
      filtered = customers.filter((customer) =>
        _.toString(_.get(customer, sortColumn.path))
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

  const handleDoubleClickTr = ({ item: customer }) => {
    history.push(`/cliente/${customer._id}`);
  };

  const { totalCount, data: processedVehicles } = getProcessedData();
  return isLoaded ? (
    <div className="container h-75 mt-5">
      <SearchBox
        value={searchQuery}
        onChange={handleSearch}
        placeholder={getPlaceHolder()}
      />
      <div className="mt-1">
        <Table
          columns={table.columns}
          sortColumn={sortColumn}
          onSort={handleSort}
          data={processedVehicles}
          onDoubleClickTr={handleDoubleClickTr}
        />
      </div>
      <Pagination
        itemsCount={totalCount}
        pageSize={table.pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  ) : (
    <LoadingScreen />
  );
}
