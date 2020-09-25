import React from "react";
import uniqid from "uniqid";
import _ from "lodash";

export default function TableBody({ data, columns, onDoubleClickTr }) {
  function renderCell(item, column) {
    if (column.content) {
      return column.content(item);
    }
    return _.get(item, column.path);
  }

  function createKey(item, column) {
    return item.id + (column.path || column.key);
  }

  return (
    <tbody>
      {data.map((item) => (
        <tr
          key={uniqid()}
          onDoubleClick={(e) => {
            onDoubleClickTr({ e, item });
          }}
        >
          {columns.map((column, index) => {
            if (column.visible !== undefined && !column.visible) return null;
            return index !== 0 ? (
              <td className="p-1 align-middle" key={createKey(item, column)}>
                {renderCell(item, column)}
              </td>
            ) : (
              <th
                scope="row"
                className="p-1 align-middle font-weight-normal"
                key={createKey(item, column)}
              >
                {renderCell(item, column)}
              </th>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
