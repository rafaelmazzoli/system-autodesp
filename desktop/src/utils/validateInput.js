/**
 * Validador de Inputs
 *
 * @param value STRING de valor do campo
 * @param label STRING de texto do campo
 * @param rules OBJECT das regras para aplicar no valor
 * @return { { valid, error } } resultado da validação e mensagem de erro se não passou na validação
 */

export default function validateInput(value, label, rules) {
  for (let rule in rules) {
    if (validateFunctions[rule]) {
      const result = validateFunctions[rule]({
        label,
        value,
        ruleValue: rules[rule],
      });

      if (!result.isValid)
        return { valid: result.isValid, error: result.invalidMessage };
    } else {
      throw new Error(
        `A regra da validação '${rule}' é inválida. São aceitos apenas os valores: ${Object.keys(
          validateFunctions
        ).join(", ")}`
      );
    }
  }

  return { valid: true, error: "" };
}

const validateFunctions = {
  minLength: ({ label, value, ruleValue }) => {
    return {
      isValid: value && value.length >= ruleValue,
      invalidMessage: `${label} tem no mínimo ${ruleValue} caracteres!`,
    };
  },

  maxLength: ({ label, value, ruleValue }) => {
    return {
      isValid: value && value.length <= ruleValue,
      invalidMessage: `${label} tem no máximo ${ruleValue} caracteres!`,
    };
  },

  isRequired: ({ label, value, ruleValue }) => {
    return {
      isValid: value && value.trim() !== "",
      invalidMessage: `${label} é um campo Requerido!`,
    };
  },

  isEmail: ({ label, value, ruleValue }) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return {
      isValid: !value || (value && re.test(String(value).toLowerCase())),
      invalidMessage: `${label} não é válido!`,
    };
  },

  isCpf: ({ label, value, ruleValue }) => {
    const re = /\d{3}\.\d{3}\.\d{3}-\d{2}/;

    return {
      isValid: !value || (value && re.test(String(value).toLowerCase())),
      invalidMessage: `${label} não válido!`,
    };
  },

  isCnpj: ({ label, value, ruleValue }) => {
    const re = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/;

    return {
      isValid: !value || (value && re.test(String(value).toLowerCase())),
      invalidMessage: `${label} não é válido!`,
    };
  },

  isCpfOrCnpj: ({ label, value, ruleValue }) => {
    const re = /(\d{3}\.\d{3}\.\d{3}-\d{2})|(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/;

    return {
      isValid: !value || (value && re.test(String(value).toLowerCase())),
      invalidMessage: `${label} não é válido!`,
    };
  },

  isPhone: ({ label, value, ruleValue }) => {
    const re = /\(\d{2}\) \d{4,5}-\d{4}/;

    return {
      isValid: !value || (value && re.test(String(value).toLowerCase())),
      invalidMessage: `${label} não é válido!`,
    };
  },

  isLicensePlate: ({ label, value, ruleValue }) => {
    const re = /[a-z]{3}-\d[a-z0-9]\d{2}/i;

    return {
      isValid: !value || (value && re.test(String(value).toLowerCase())),
      invalidMessage: `${label} não é válido!`,
    };
  },
};
