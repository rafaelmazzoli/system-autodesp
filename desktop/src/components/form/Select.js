import React from "react";
/**
 * Render de Selects
 *
 * @param name STRING
 * @description nome do input e usado para pegar informações no formControls
 *
 * @param formControls OBJECT
 * @description variável contendo o formControls do hook useForm.js
 *
 * @param onChange FUNCTION
 * @description função que é chamada para atualizar o valor do input
 */

export default function Select({ name, formControls, onChange }) {
  const {
    autoFocus,
    showLabel,
    readOnly,
    validateClass,
    valueSelector,
    labelSelector,
    label,
    value,
    className,
    options,
    error
  } = formControls[name];

  return (
    <div className="form-group" id={name}>
      {showLabel && <label htmlFor={name}>{label}</label>}
      <select
        value={value}
        readOnly={readOnly}
        autoFocus={autoFocus}
        onChange={onChange}
        className={className}
        name={name}
      >
        {options &&
          options.map(option => (
            <option
              key={option[labelSelector] + option[valueSelector]}
              value={option[valueSelector]}
            >
              {option[labelSelector]}
            </option>
          ))}
      </select>
      {error &&
        (validateClass ? (
          <small className="text-danger">{error}</small>
        ) : (
          <div className="badge badge-pill badge-danger">{error}</div>
        ))}
    </div>
  );
}
