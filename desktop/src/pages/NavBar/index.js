import React from "react";
import { NavLink, Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav
      id="navBar-container"
      className="navbar navbar-expand-lg navbar-dark bg-dark"
    >
      <Link className="navbar-brand h1 mb-0" to="/lista/veiculos">
        Autodesp
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink className="nav-item nav-link" to="/cliente/novo">
            Cadastrar Cliente
          </NavLink>
          <NavLink className="nav-item nav-link" to="/lista/veiculos">
            Lista de Veículos
          </NavLink>
          <NavLink className="nav-item nav-link" to="/lista/clientes">
            Lista de Clientes
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
