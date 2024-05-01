/**
 * Validador de Inputs
 *
 * @param formSchema OBJECT (Obrigatório) de valor inicial da variável de Controle de Formulário
 * @param doSubmitCallback FUNCTION (Obrigatório) que é executada quando o formulário é enviado (Essa função pode retornar nada, default, error, done)
 * @param onChangeCallback FUNCTION (Opcional) que é executada quando o valor de um campo é alterado
 * @return { {
 * formControls,
 * handleSubmit,
 * handleChange
 * } } Retorna a função de Submit, os Controles do Formulário e a função de mundança de valor do
 */

import { useState } from "react";
import validateInput from "../utils/validateInput";
//import { conformToMask } from "react-text-mask";
//import createNumberMask from "text-mask-addons/dist/createNumberMask";
import moment from "moment";
import _ from "lodash";

export default function useForm(
  formSchema,
  doSubmitCallback,
  onChangeCallback
) {
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [formIsValid, setFormIsValid] = useState(true);
  const [formControls, setFormControlsState] = useState(
    initiateFormControls(formSchema)
  );

  const setFormControls = (formControls) => {
    setFormControlsState(initiateFormControls(formControls));
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const possibleEnds = {
      default: () => {
        setFormIsSubmitting(false);
      },
      error: () => {
        Object.keys(formControls).forEach((name) => {
          formControls[name].valid = false;
        });
        setFormIsSubmitting(false);
        setFormControls(formControls);
      },
      done: () => {},
    };

    //Aplica validação de Campos e Formulário
    let valid = true;
    Object.keys(formControls).forEach((inputName) => {
      valid = formControls[inputName].valid && valid;
    });
    setFormIsValid(valid);

    if (!formIsValid && valid) return;

    //Chamada de Callback
    setFormIsSubmitting(true);
    const result = await doSubmitCallback();
    if (possibleEnds[result || "default"]) possibleEnds[result || "default"]();
  };

  const handleChange = (e) => {
    e.persist();
    const name = e.target.name;
    const updatedElement = formControls[name];

    const possibleInputs = {
      checkbox: () => e.target.checked,
      autocomplete: () => e.target.value, // TODO Implementar cenário de input autocomplete
      default: () => e.target.value,
    };

    //Transferir valor do Input para o Controller
    updatedElement.value = possibleInputs[e.target.type]
      ? possibleInputs[e.target.type]()
      : possibleInputs.default();

    //Preparar Máscaras prontas
    updatedElement.currentMask = setUpMask(
      updatedElement.value,
      updatedElement.mask
    );

    //Aplica Máscaras se Existirem
    updatedElement.value = applyMask(
      updatedElement.value,
      updatedElement.currentMask
    );

    //Validar valores com Regras
    const { valid: validInput, error } = validateInput(
      updatedElement.value,
      updatedElement.label,
      updatedElement.validationRules
    );
    updatedElement.valid = validInput;
    updatedElement.error = error;

    //Merge dos Objetos
    formControls[name] = {
      ...updatedElement,
      touched: true,
    };

    //Aplica validação de Campos e Formulário
    let valid = true;
    Object.keys(formControls).forEach((inputName) => {
      valid = formControls[inputName].valid && valid;
    });

    //Aplicar Conversões de Data
    formControls[name].value =
      formControls[name].type === "date" && formControls[name].value
        ? convertDate(
            formControls[name].value,
            "YYYY-MM-DD",
            formControls[name].dateIOFormat
          )
        : updatedElement.value;

    //Formatar Valor
    const value = formatValue(
      formControls[name].value,
      formControls[name].formatValue
    );

    //Chama Callback se existir
    onChangeCallback && onChangeCallback(name, updatedElement.valuePath, value);

    setFormIsValid(valid);
    setFormControls({ ...formControls });
  };

  const reloadFormValues = (newDataObject) => {
    const formControlsCopy = { ...formControls };
    Object.keys(formControlsCopy).forEach((key) => {
      formControlsCopy[key].value = _.get(
        newDataObject,
        formControlsCopy[key].valuePath,
        ""
      );
    });
    setFormControls(formControlsCopy);
  };

  return {
    formControls,
    formIsSubmitting,
    formIsValid,
    handleSubmit,
    handleChange,
    reloadFormValues,
    setFormControls,
  };
}

function initiateFormControls(newFormControls) {
  const formControls = {};

  Object.keys(newFormControls).forEach((name) => {
    //Merge de Objetos
    formControls[name] = {
      ...emptyModels(newFormControls[name].type),
      ...newFormControls[name],
    };

    //Preparar Máscaras prontas
    formControls[name].currentMask = setUpMask(
      formControls[name].value ? formControls[name].value : "",
      formControls[name].mask
    );

    //Aplica Máscaras se Existirem
    formControls[name].value = applyMask(
      formControls[name].value,
      formControls[name].currentMask
    );

    //Aplicar Conversões de Data
    if (formControls[name].type === "date" && formControls[name].value)
      formControls[name].value = convertDate(
        formControls[name].value,
        formControls[name].dateIOFormat,
        "YYYY-MM-DD"
      );

    //Validar valores com Regras
    const { valid, error } = validateInput(
      formControls[name].value,
      formControls[name].label,
      formControls[name].validationRules
    );
    formControls[name].valid = valid;
    formControls[name].error = error;

    //Formatar Valor
    formControls[name].value = formatValue(
      formControls[name].value,
      formControls[name].formatValue
    );
  });

  //Aplica validação de Campos e Formulário
  let valid = true;
  Object.keys(formControls).forEach((inputName) => {
    valid = formControls[inputName].valid && valid;
  });

  return formControls;
}

function convertDate(value, inputFormat, outputFormat) {
  return moment(value, inputFormat || undefined).format(
    outputFormat || undefined
  );
}

function formatValue(value, format) {
  const validFormats = {
    int: +value,
    string: `${value}`,
    boolean: value && value !== "false" ? true : false,
  };

  return validFormats[format] || value;
}

function applyMask(value, mask) {
  if (
    value &&
    value.toString() &&
    mask &&
    (typeof mask === "function" || typeof mask === "object")
  )
    return value;
  // conformToMask(value.toString(), mask, {
  //   guide: false,
  //   previousConformedValue: value.toString(),
  // }).conformedValue;
  return value;
}

function emptyModels(type) {
  const validControls = {
    text: {
      formatValue: "",
      valuePath: "",
      value: "",
      label: "",
      mask: "",
      dateIOFormat: "",
      showLabel: true,
      type: "text",
      placeholder: "",
      autoFocus: false,
      validateClass: false,
      valid: false,
      validationRules: {},
      className: "form-control",
      error: "",
      showError: true,
      touched: false,
      readOnly: false,
      autoComplete: "off",
    },
    select: {
      formatValue: "",
      valuePath: "",
      value: "",
      label: "",
      showLabel: true,
      type: "select",
      autoFocus: false,
      valid: false,
      validationRules: {},
      className: "form-control",
      error: "",
      showError: true,
      touched: false,
      valueSelector: "value",
      labelSelector: "label",
      options: [
        { value: 1, label: "Exemplo 1" },
        { value: 2, label: "Exemplo 2" },
      ],
    },
    "select-one": {
      formatValue: "",
      valuePath: "",
      value: "",
      label: "",
      showLabel: true,
      type: "text",
      autoFocus: false,
      valid: false,
      validationRules: {},
      className: "form-control",
      error: "",
      showError: true,
      touched: false,
      options: [
        { value: "", displayValue: "" },
        { value: "", displayValue: "" },
      ],
    },
    checkbox: {
      formatValue: "boolean",
      valuePath: "",
      value: "",
      label: "",
      showLabel: true,
      autoFocus: false,
      validateClass: false,
      valid: false,
      validationRules: {},
      className: "form-check-input",
      error: "",
      showError: true,
      touched: false,
      readOnly: false,
    },
    textArea: {
      formatValue: "",
      valuePath: "",
      value: "",
      label: "",
      mask: "",
      showLabel: true,
      type: "textArea",
      placeholder: "",
      autoFocus: false,
      validateClass: false,
      valid: false,
      validationRules: {},
      className: "form-control",
      error: "",
      rows: 4,
      showError: true,
      touched: false,
      readOnly: false,
    },
  };

  return validControls[type] || validControls["text"];
}

function setUpMask(value, maskName) {
  const preCodedMasks = {
    cpf: [
      /\d/,
      /\d/,
      /\d/,
      ".",
      /\d/,
      /\d/,
      /\d/,
      ".",
      /\d/,
      /\d/,
      /\d/,
      "-",
      /\d/,
      /\d/,
    ],
    cnpj: [
      /\d/,
      /\d/,
      ".",
      /\d/,
      /\d/,
      /\d/,
      ".",
      /\d/,
      /\d/,
      /\d/,
      "/",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      "-",
      /\d/,
      /\d/,
    ],
    cellphone: [
      "(",
      /\d/,
      /\d/,
      ")",
      " ",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      "-",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
    phone: [
      "(",
      /\d/,
      /\d/,
      ")",
      " ",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      "-",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
    license_plate: [
      /[A-Za-z]/,
      /[A-Za-z]/,
      /[A-Za-z]/,
      "-",
      /\d/,
      /[A-Za-z0-9]/,
      /\d/,
      /\d/,
    ],
    // money: createNumberMask({
    //   prefix: "R$ ",
    //   allowDecimal: true,
    //   allowNegative: true,
    // }),
    date: [/[0-3]/, /\d/, "/", /[0-1]/, /\d/, "/", /[1-2]/, /\d/, /\d/, /\d/],
  };
  let selectedMask = maskName;

  //Trata máscaras por tamanho
  if (_.isPlainObject(maskName)) {
    const sizesArray = _.sortBy(Object.keys(maskName));
    const currentMaskSize = sizesArray.find((valueSize, index) => {
      if (value.length > valueSize && sizesArray[index + 1]) return false;
      return true;
    });
    selectedMask = maskName[currentMaskSize];
  }

  return preCodedMasks[selectedMask]
    ? preCodedMasks[selectedMask]
    : selectedMask;
}
