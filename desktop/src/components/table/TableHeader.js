import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";

const TableHeader = ({ sortColumn, columns, onSort }) => {
  const raiseSort = (path) => {
    if (sortColumn.path === path)
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    else {
      sortColumn.path = path;
      sortColumn.order = "asc";
    }
    onSort(sortColumn);
  };

  const renderSortIcon = (column) => {
    const { path, order } = sortColumn;
    if (column.path !== path) return null;
    if (order === "asc") return <FontAwesomeIcon icon={faSortUp} />;
    return <FontAwesomeIcon icon={faSortDown} />;
  };

  return (
    <thead>
      <tr>
        {columns.map((column) => {
          if (column.visible !== undefined && !column.visible) return null;
          return (
            <th
              className={
                typeof column.label === "string"
                  ? "font-weight-bold pl-0"
                  : "font-weight-bold pl-0 text-right"
              }
              scope="col"
              style={{ cursor: "pointer" }}
              onClick={() =>
                column.label &&
                typeof column.label === "string" &&
                raiseSort(column.path)
              }
              key={column.path || column.key}
            >
              {column.label}&nbsp;
              {typeof column.label === "string" && renderSortIcon(column)}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
