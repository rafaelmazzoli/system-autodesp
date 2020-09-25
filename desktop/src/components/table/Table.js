import React from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import PropTypes from "prop-types"; //TODO Adicionar esse PropTypes nos Componentes Comuns

const Table = ({ columns, sortColumn, onSort, data, onDoubleClickTr }) => {
  return (
    <table className="table table-hover">
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody
        data={data}
        columns={columns}
        onDoubleClickTr={onDoubleClickTr}
      />
    </table>
  );
};

export default Table;

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  sortColumn: PropTypes.object.isRequired,
  onSort: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};
