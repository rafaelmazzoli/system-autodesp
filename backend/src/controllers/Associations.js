import Customer from "../models/Customer";
import Vehicle from "../models/Vehicle";
import Fawn from "fawn";
import mongoose from "mongoose";

//Fawn.init(mongoose);

module.exports = {
  async associateCustomerAndVehicle(req, res) {
    const { customerId, vehicleId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) res.status(404).send("Cliente não existe");

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) res.status(404).send("Veículo não existe");

    const newVehicle = vehicle.toObject();
    newVehicle.owner = customerId;

    const newCustomer = customer.toObject();
    if (
      !newCustomer.vehicles.find(
        (customerVehicleId) =>
          toString(customerVehicleId) === toString(vehicleId)
      )
    )
      newCustomer.vehicles.push(vehicleId);

    //Transaction
    const task = new Fawn.Task();
    task.update(vehicle, newVehicle).options({ viaSave: true });
    task.update(customer, newCustomer).options({ viaSave: true });

    const [resultVehicle, resultCustomer] = await task.run({
      useMongoose: true,
    });

    return res.json({ customer: resultCustomer, vehicle: resultVehicle });
  },

  async create(req, res) {
    const { name, cpf_cnpj, phone1, phone2, email } = req.body;

    const customerExists = await Customer.findOne({ cpf_cnpj });

    if (customerExists) return res.json(customerExists);

    const customer = await Customer.create({
      name,
      cpf_cnpj,
      phone1,
      phone2,
      email,
    });

    return res.json(customer);
  },
};
