import Customer from "../models/Customer";
import Vehicle from "../models/Vehicle";
import Fawn from "fawn";
import { isValidObjectId } from "mongoose";

module.exports = {
  async getAll(req, res) {
    const { filter } = JSON.parse(req.query[0]);
    Object.keys(filter).forEach(
      (key) => (filter[key] = new RegExp(filter[key]))
    );
    const vehicles = await Vehicle.find(filter).populate("owner");

    return res.json(vehicles);
  },

  async create(req, res) {
    const {
      license_plate,
      brand,
      model,
      renavam,
      owner,
      holder,
      advised,
    } = req.body;

    const customer = await Customer.findById(owner);
    if (!customer)
      return res.status(400).send(`Proprietário ${owner} não existe`);

    const vehicleExists = await Vehicle.findOne({ license_plate });
    if (vehicleExists && vehicleExists.owner.toString() === owner.toString()) {
      return res.json(vehicleExists);
    } else if (
      vehicleExists &&
      vehicleExists.owner.toString() !== owner.toString()
    )
      return res
        .status(400)
        .send(`Veículo já existe para o Cliente ${vehicleExists.owner}`);

    const vehicle = new Vehicle({
      license_plate,
      brand,
      model,
      renavam,
      owner,
      holder,
      advised,
    });

    //Transaction
    const task = new Fawn.Task();
    task.save(vehicle);
    task.update(customer, { $push: { vehicles: { $ojFuture: "0._id" } } });

    const [resultVehicle] = await task.run({
      useMongoose: true,
    });

    return res.status(201).json(resultVehicle);
  },

  async update(req, res) {
    const { vehicleId } = req.params;

    if (!isValidObjectId(vehicleId))
      return res.status(400).send("ID de Veículo inválido");

    const {
      license_plate,
      brand,
      model,
      renavam,
      owner,
      holder,
      advised,
    } = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, {
      license_plate,
      brand,
      model,
      renavam,
      owner,
      holder,
      advised,
    });
    if (!vehicle) return res.sendStatus(404);

    return res.json(vehicle);
  },

  async remove(req, res) {
    const { vehicleId } = req.params;

    if (!isValidObjectId(vehicleId))
      return res.status(400).send("ID de Veículo inválido");

    const vehicle = await Vehicle.findById(vehicleId).populate("owner");
    if (!vehicle) {
      return res.sendStatus(406);
    }

    //Transaction
    const task = new Fawn.Task();
    task.remove(vehicle);
    task.update(vehicle.owner, { $pull: { vehicles: vehicle._id } });

    await task.run({
      useMongoose: true,
    });

    return res.sendStatus(204);
  },

  async checkAdvised(req, res) {
    const { vehicleId, check } = req.params;

    if (!isValidObjectId(vehicleId))
      return res.status(400).send("ID de Veículo inválido");

    const newValue = check === "true" ? new Date() : null;

    const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, {
      advised: newValue,
    });
    if (!vehicle) return res.sendStatus(404);

    return res.json(vehicle);
  },
};
