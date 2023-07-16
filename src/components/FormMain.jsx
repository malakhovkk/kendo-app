import * as React from "react";
import * as ReactDOM from "react-dom";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Error } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";
const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const emailValidator = (value) =>
  emailRegex.test(value) ? "" : "Please enter a valid email.";
const EmailInput = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};
const FormMain = () => {
  const handleSubmit = (dataItem) => alert(JSON.stringify(dataItem, null, 2));
  return (
    <Form
      onSubmit={handleSubmit}
      render={(formRenderProps) => (
        <FormElement
          style={{
            maxWidth: 350,
            border: "1px solid #e3e0e0",
            padding: 10,
            borderRadius: '5px'
          }}
        >
          <fieldset className={"k-form-fieldset"}>
            {/* <legend className={"k-form-legend"}>
              Please fill in the fields:
            </legend> */}
            <div>
              <Field
                name={"firstName"}
                component={Input}
                label={"First name"}
              />
            </div>

            <div>
              <Field name={"lastName"} component={Input} label={"Last name"} />
            </div>

            <div>
              <Field
                name={"email"}
                type={"email"}
                component={EmailInput}
                label={"Email"}
                validator={emailValidator}
              />
            </div>

            <div>
              <Field
                name="password"
                type="password"
                component={Input}
                style={{
                  width: "100%",
                }}
                label="Password"
                required={true}
                minLength={6}
                maxLength={18}
              />
            </div>
          </fieldset>
          <div className="k-form-buttons">
            <button
              type={"submit"}
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              disabled={!formRenderProps.allowSubmit}
            >
              Зарегистрироваться
            </button>
          </div>
        </FormElement>
      )}
    />
  );
};

export default FormMain;
