import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

export default function Pagination({
  itemsCount,
  pageSize,
  onPageChange,
  currentPage,
}) {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;

  const pages = _.range(1, pagesCount + 1);

  const maxPagesLimit = 3;

  return (
    <nav>
      <ul className="pagination">
        {pages.map((page) => {
          if (
            page <= currentPage + maxPagesLimit &&
            page >= currentPage - maxPagesLimit
          )
            return (
              <li
                key={page}
                className={
                  page === currentPage ? "page-item active" : "page-item"
                }
              >
                <button
                  onClick={() => onPageChange(page)}
                  className="page-link"
                >
                  {page}
                </button>
              </li>
            );
        })}
      </ul>
    </nav>
  );
}

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
