import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import NotFound from "./pages/NotFound";
import VehicleTable from "./pages/VehicleTable";
import CustomerTable from "./pages/CustomerTable";
import ClienteInformationForm from "./pages/ClienteInformationForm";

export default function Routes() {
  return (
    <Switch>
      <Redirect from="/cliente/:id/reload" to="/cliente/:id" />
      <Route path="/cliente/:id" component={ClienteInformationForm} />
      <Route path="/lista/clientes" component={CustomerTable} />
      <Route path="/lista/veiculos" component={VehicleTable} />
      <Route path="/não encontrado" component={NotFound} />
      <Redirect from="/" to="/lista/veiculos" />
      <Redirect to="/não encontrado" />
    </Switch>
  );
}
