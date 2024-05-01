"use strict";

var _require = require("mongoose"),
  Schema = _require.Schema,
  model = _require.model;
var VehicleSchema = new Schema({
  license_plate: {
    type: String,
    uppercase: true,
    required: true,
    match: /[a-z]{3}-\d[a-z0-9]\d{2}/i
  },
  brand: {
    type: String,
    set: function set(value) {
      return capitalize_Words(value);
    }
  },
  model: {
    type: String,
    required: true,
    set: function set(value) {
      return capitalize_Words(value);
    }
  },
  renavam: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "customer",
    required: true
  },
  holder: {
    type: String,
    set: function set(value) {
      return capitalize_Words(value);
    }
  },
  advised: {
    type: Date
  }
}, {
  timestamps: true
});
function capitalize_Words(str) {
  return str.toLowerCase().replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
module.exports = model("vehicle", VehicleSchema);