import React from "react";

export default function SideFilter({ onRadioFilterChange }) {
  return (
    <div
      className="col-sm-2 align-self-start text-center border-right p-3 rounded-lg bg-light"
      onChange={onRadioFilterChange}
    >
      <h5>
        <i className="fas fa-car" />
        &nbsp;Final de Placa
      </h5>
      <div className="form-check">
        <input
          id="final_license_plate_all"
          className="form-check-input"
          type="radio"
          name="final_license_plate"
          value=""
          defaultChecked
        />
        <label
          className="form-check-label px-2"
          htmlFor="final_license_plate_all"
        >
          Todos
        </label>
      </div>
      <div className="form-check">
        <input
          id="final_license_plate_1"
          className="form-check-input"
          type="radio"
          name="final_license_plate"
          value="1$"
        />
        <label
          className="form-check-label px-2"
          htmlFor="final_license_plate_1"
        >
          1
        </label>
      </div>
      <div className="form-check">
        <input
          id="final_license_plate_2"
          className="form-check-input"
          type="radio"
          name="final_license_plate"
          value="2$"
        />
        <label
          className="form-check-label px-2"
          htmlFor="final_license_plate_2"
        >
          2
        </label>
      </div>
      <div className="form-check">
        <input
          id="final_license_plate_3"
          className="form-check-input"
          type="radio"
          name="final_license_plate"
          value="3$"
        />
        <label
          className="form-check-label px-2"
          htmlFor="final_license_plate_3"
        >
          3
        </label>
      </div>
      <div className="form-check">
        <input
          id="final_license_plate_4"
          className="form-check-input"
          type="radio"
          name="final_license_plate"
          value="4$"
        />
        <label
          className="form-check-label px-2"
          htmlFor="final_license_plate_4"
        >
          4
        </label>
      </div>
      <div className="form-check">
        <input
          id="final_license_plate_5"
          className="form-check-input"
          type="radio"
          name="final_license_plate"
          value="5$"
        />
        <label
          className="form-check-label px-2"
          htmlFor="final_license_plate_5"
        >
          5
        </label>
      </div>
      <div className="form-check">
        <input
          id="final_license_plate_6"
          className="form-check-input"
          type="radio"
          name="final_license_plate"
          value="6$"
        />
        <label
          className="form-check-label px-2"
          htmlFor="final_license_plate_6"
        >
          6
        </label>
      </div>
      <div className="form-check">
        <input
          id="final_license_plate_7"
          className="form-check-input"
          type="radio"
          name="final_license_plate"
          value="7$"
        />
        <label
          className="form-check-label px-2"
          htmlFor="final_license_plate_7"
        >
          7
        </label>
      </div>
      <div className="form-check">
        <input
          id="final_license_plate_8"
          className="form-check-input"
          type="radio"
          name="final_license_plate"
          value="8$"
        />
        <label
          className="form-check-label px-2"
          htmlFor="final_license_plate_8"
        >
          8
        </label>
      </div>
      <div className="form-check">
        <input
          id="final_license_plate_9"
          className="form-check-input"
          type="radio"
          name="final_license_plate"
          value="9$"
        />
        <label
          className="form-check-label px-2"
          htmlFor="final_license_plate_9"
        >
          9
        </label>
      </div>
      <div className="form-check">
        <input
          id="final_license_plate_0"
          className="form-check-input"
          type="radio"
          name="final_license_plate"
          value="0$"
        />
        <label
          className="form-check-label px-2"
          htmlFor="final_license_plate_0"
        >
          0
        </label>
      </div>
    </div>
  );
}
