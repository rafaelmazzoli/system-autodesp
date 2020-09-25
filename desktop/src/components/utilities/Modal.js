import React from "react";

export default function Modal({ id, title, header, body, footer }) {
  return (
    <div
      id={id}
      className="modal fade"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            {header || <h5 className="modal-title">{title}</h5>}
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{body}</div>
          <div className="modal-footer">{footer}</div>
        </div>
      </div>
    </div>
  );
}
