import React from "react";

/**
 * Render de Inputs
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

export default function Input({ name, formControls, onChange }) {
  const {
    label,
    error,
    showLabel,
    validateClass,
    valid,
    touched,
    className,
    value,
    type,
    placeholder,
    autoFocus,
    readOnly,
    autoComplete,
    showError,
  } = formControls[name];

  return (
    <div className="form-group" id={name}>
      {showLabel && <label htmlFor={name}>{label}</label>}
      <input
        autoComplete={autoComplete}
        value={value || ""}
        type={type}
        placeholder={placeholder}
        autoFocus={autoFocus}
        readOnly={readOnly}
        onChange={onChange}
        name={name}
        className={
          validateClass && touched
            ? `${className} ${valid ? "is-valid" : "is-invalid"}`
            : className
        }
      />
      {showError &&
        error &&
        touched &&
        (validateClass ? (
          <small className="text-danger">{error}</small>
        ) : (
          <div className="badge badge-pill badge-danger">{error}</div>
        ))}
    </div>
  );
}
