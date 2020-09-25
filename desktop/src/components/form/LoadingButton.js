import React from "react";

/**
 * Render de Loading Button
 *
 * @param normalText STRING
 * @description texto apresentado no botão
 *
 * @param loadingText STRING
 * @description texto apresentado quando botão está carregando
 *
 * @param normalIcon STRING
 * @description ícone exibido normalmente no botão
 *
 * @param disabledWhen BOOLEAN
 * @description quando com valor TRUE deve desabilitar o botão
 *
 * @param isLoading BOOLEAN
 * @description quando com valor TRUE deve alterar o botão para desabilitado e SALVANDO
 */

export default function LoadingButton({
  normalText,
  loadingText,
  normalIcon,
  disabledWhen,
  isLoading,
  buttonClass,
}) {
  return (
    <button
      type="submit"
      className={buttonClass || "btn btn-primary mb-3"}
      disabled={disabledWhen || isLoading}
    >
      {isLoading ? (
        <>
          {loadingText || "Salvando"}
          <span
            className="spinner-border spinner-border-sm ml-2"
            role="status"
            aria-hidden="true"
          ></span>
        </>
      ) : (
        <>
          {normalText || "Salvar"}&nbsp;&nbsp;
          <i className={normalIcon || "fas fa-angle-double-right"} />
        </>
      )}
    </button>
  );
}
