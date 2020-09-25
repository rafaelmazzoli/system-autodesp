import React from "react";

export default function NotFound() {
  return (
    <div className="container h1 h-75">
      <div className="row align-items-center justify-content-center h-100">
        <div className="col-sm-3 text-center">
          <span className="badge badge-danger mb-3">404</span>
          <p className="h5">
            A página que está tentando acessar não foi encontrada!
          </p>
        </div>
      </div>
    </div>
  );
}
