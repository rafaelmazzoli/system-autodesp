import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/utilities/LoadingScreen";
import Input from "../../components/form/Input";
import useForm from "../../hooks/useForm";
import _ from "lodash";
import LoadingButton from "../../components/form/LoadingButton";
import TextArea from "../../components/form/TextArea";

export default function ClienteForm({ customer, setCustomer, doSubmit }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const formController = useForm(
    {
      name: {
        valuePath: "name",
        value: customer.name,
        label: "Nome",
        type: "text",
        validationRules: { isRequired: true, maxLength: 35 },
      },
      cpf_cnpj: {
        valuePath: "cpf_cnpj",
        value: customer.cpf_cnpj,
        label: "CPF/CNPJ",
        type: "text",
        mask: { 18: "cnpj", 14: "cpf" },
        validationRules: { isRequired: true, isCpfOrCnpj: true },
      },
      phone1: {
        valuePath: "phone1",
        value: customer.phone1,
        label: "Telefone 1",
        type: "text",
        mask: { 14: "phone", 15: "cellphone" },
        validationRules: { isRequired: true, isPhone: true },
      },
      phone2: {
        valuePath: "phone2",
        value: customer.phone2,
        label: "Telefone 2",
        type: "text",
        mask: { 14: "phone", 15: "cellphone" },
        validationRules: { isPhone: true },
      },
      email: {
        valuePath: "email",
        value: customer.email,
        label: "E-mail",
        type: "text",
        validationRules: { isEmail: true },
      },
      notes: {
        valuePath: "notes",
        value: customer.notes,
        label: "Observações",
        type: "textArea",
        validationRules: {},
      },
      id: {
        valuePath: "_id",
        value: customer._id,
        label: "Id Cliente",
        type: "text",
        readOnly: true,
        validationRules: {},
      },
    },
    doSubmit,
    onChange
  );

  useEffect(() => {
    formController.reloadFormValues(customer);
    setIsLoaded(true);
    // eslint-disable-next-line
  }, [customer]);

  function onChange(name, valuePath, value) {
    const newCustomer = Object.assign({}, customer);
    _.set(newCustomer, valuePath, value);
    setCustomer(newCustomer);
  }

  return isLoaded ? (
    <form onSubmit={formController.handleSubmit}>
      <div className="container p-3 rounded-lg bg-light">
        <div className="row m-1">
          <div className="col h3 p-0">
            <i className="fas fa-user" />
            &nbsp;Cliente
          </div>
          <div className="col-sm-auto text-center">
            <LoadingButton
              disabledWhen={!formController.formIsValid}
              isLoading={formController.formIsSubmitting}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-sm">
            <Input
              name="id"
              onChange={formController.handleChange}
              formControls={formController.formControls}
            />
          </div>
          <div className="col-sm">
            <Input
              name="cpf_cnpj"
              onChange={formController.handleChange}
              formControls={formController.formControls}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <Input
              name="name"
              onChange={formController.handleChange}
              formControls={formController.formControls}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <Input
              name="email"
              onChange={formController.handleChange}
              formControls={formController.formControls}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <Input
              name="phone1"
              onChange={formController.handleChange}
              formControls={formController.formControls}
            />
          </div>
          <div className="col-sm">
            <Input
              name="phone2"
              onChange={formController.handleChange}
              formControls={formController.formControls}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TextArea
              name="notes"
              onChange={formController.handleChange}
              formControls={formController.formControls}
            />
          </div>
        </div>
      </div>
    </form>
  ) : (
    <LoadingScreen />
  );
}
