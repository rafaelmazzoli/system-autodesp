import React from "react";
import "./StepBar.css";

/**
 * Render de StepBar
 *
 * @param steps ARRAY [ @var { id, order, label, icon } ]
 * @description Lista com os Steps a serem exibidos
 *
 * @param selectedId NUMBER
 * @description representa o ID do Step atual
 */

export default function StepBar({ steps, selectedId }) {
  const actualOrder = steps.find(
    (step) => parseInt(step.id) === parseInt(selectedId)
  ).order;

  return (
    <ul className="stepBar">
      {steps.map((step) => (
        <li
          key={step.id}
          className={step.order <= actualOrder ? "active" : ""}
          ico={step.icon}
        >
          {step.label}
        </li>
      ))}
    </ul>
  );
}
