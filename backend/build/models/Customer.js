"use strict";

var _require = require("mongoose"),
  Schema = _require.Schema,
  model = _require.model;
var CustomerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: function set(value) {
      return capitalize_Words(value);
    }
  },
  cpf_cnpj: {
    type: String,
    required: true,
    match: /(\d{3}\.\d{3}\.\d{3}\-\d{2})|(\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2})/
  },
  phone1: {
    type: String,
    required: true,
    match: /\(\d{2}\) \d{4,5}\-\d{4}/
  },
  phone2: {
    type: String,
    match: /\(\d{2}\) \d{4,5}\-\d{4}/
  },
  email: {
    type: String,
    match: /\S+@\S+\.\S+/i,
    lowercase: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  vehicles: [{
    type: Schema.Types.ObjectId,
    ref: "vehicle"
  }]
}, {
  timestamps: true
});
function capitalize_Words(str) {
  return str.toLowerCase().replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
module.exports = model("customer", CustomerSchema);