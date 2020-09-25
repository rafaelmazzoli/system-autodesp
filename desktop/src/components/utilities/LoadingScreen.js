import React from "react";

export default function LoadingScreen() {
  return (
    <div className="container h-75">
      <div className="row align-items-center justify-content-center h-100">
        <span
          className="spinner-border text-primary mr-3"
          role="status"
          aria-hidden="true"
        ></span>
        <strong>Carregando...</strong>
      </div>
    </div>
  );
}
