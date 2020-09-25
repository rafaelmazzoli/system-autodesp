import React from "react";

/**
 * Render de Checkboxes
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

export default function Checkbox({ name, formControls, onChange }) {
  const {
    label,
    error,
    showLabel,
    validateClass,
    valid,
    touched,
    className,
    value,
    autoFocus,
    readOnly,
    showError,
  } = formControls[name];

  return (
    <div className="form-group form-check">
      <input
        onChange={onChange}
        name={name}
        type="checkbox"
        checked={value}
        id={name}
        readOnly={readOnly}
        autoFocus={autoFocus}
        className={
          validateClass && touched
            ? `${className} ${valid ? "is-valid" : "is-invalid"}`
            : className
        }
      />
      {showLabel && (
        <label className="form-check-label" htmlFor={name}>
          {label}
        </label>
      )}
      {showError &&
        error &&
        touched &&
        (validateClass ? (
          <small className="text-danger">{error}</small>
        ) : (
          <div className="badge badge-pill badge-danger">{error}</div>
        ))}
      {error && <div className="badge badge-pill badge-danger">{error}</div>}
    </div>
  );
}
