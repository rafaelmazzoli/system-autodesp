const CustomerController = require("./controllers/Customer");
const VehicleController = require("./controllers/Vehicle");

module.exports = (app) => {
  //Rotas de Customer
  app.post(`/API/customer`, CustomerController.create);
  app.get(`/API/customers`, CustomerController.getAll);
  app.get(`/API/customer/:customerId`, CustomerController.getById);
  app.put(`/API/customer/:customerId`, CustomerController.update);
  app.delete(`/API/customer/:customerId`, CustomerController.remove);

  //Rotas de Vehicles
  app.post(`/API/vehicle`, VehicleController.create);
  app.get(`/API/vehicles`, VehicleController.getAll);
  app.put(`/API/vehicle/:vehicleId`, VehicleController.update);
  app.delete(`/API/vehicle/:vehicleId`, VehicleController.remove);
  app.post(
    `/API/vehicle/:vehicleId/check/:check`,
    VehicleController.checkAdvised
  );
};
