import Customer from "../models/Customer";
import _ from "lodash";
import Fawn from "fawn";
import { isValidObjectId } from "mongoose";

module.exports = {
  async getAll(req, res) {
    const customers = await Customer.find().populate("vehicles");

    return res.json(customers);
  },

  async getById(req, res) {
    const { customerId } = req.params;

    if (!isValidObjectId(customerId))
      return res.status(400).send("ID de Cliente inválido");

    const customer = await Customer.findById(customerId).populate("vehicles");
    if (!customer) return res.status(400).send("Cliente não encontrado");

    return res.json(customer);
  },

  async create(req, res) {
    const { name, cpf_cnpj, phone1, phone2, email, notes } = req.body;

    const customerExists = await Customer.findOne({ cpf_cnpj });

    if (customerExists)
      return res.status(400).send("Esse CPF/CNPJ já está cadastrado");

    const customer = await Customer.create({
      name,
      cpf_cnpj,
      phone1,
      phone2,
      email,
      notes,
    });

    return res.status(201).json(customer);
  },

  async update(req, res) {
    const { customerId } = req.params;

    if (!isValidObjectId(customerId))
      return res.status(400).send("ID de Cliente inválido");

    const { name, cpf_cnpj, phone1, phone2, email, notes } = req.body;

    const customer = await Customer.findByIdAndUpdate(customerId, {
      name,
      cpf_cnpj,
      phone1,
      phone2,
      email,
      notes,
    });
    if (!customer) return res.sendStatus(404);

    return res.json(customer);
  },

  async remove(req, res) {
    const { customerId } = req.params;

    if (!isValidObjectId(customerId))
      return res.status(400).send("ID de Cliente inválido");

    const customer = await Customer.findById(customerId).populate("vehicles");
    if (!customer) return res.sendStatus(406);

    //Transaction
    const task = new Fawn.Task();
    task.remove(customer);
    task.remove("vehicle", { owner: customerId });

    await task.run({
      useMongoose: true,
    });

    return res.sendStatus(204);
  },
};
