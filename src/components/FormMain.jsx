import * as React from "react";
import * as ReactDOM from "react-dom";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Error } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";
import { useLogonMutation } from "../features/apiSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginSlice } from "../features/login";
// Импортируем нужные действия
import { addToRights, logon } from "../features/settings.js";
import { logonUser } from "../features/actions";
// import { logon } from "../features/settings.js";
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
  // const [logon, { error }] = useLogonMutation();
  const login = useSelector((state) => state.settings.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginData = useSelector((state) => state.login);
  const isSuccess = useSelector((state) => state.login.isSuccess);

  React.useEffect(() => {
    console.log(1);
    console.log(loginData);
    if (!loginData?.data?.result) return;
    console.error("NOT ERROR");
    localStorage.setItem("token", loginData.data.result);
    localStorage.setItem("login", login);
    navigate("/home/profile");
    dispatch(addToRights(loginData.data.rights));
    dispatch(loginSlice.actions.delete());
  }, [loginData]);
  //console.log(error);
  //if(error) navigate('/');
  const handleSubmit = (dataItem) => {
    // logon(dataItem)
    //   .unwrap()
    //   .then((payload) => {
    //     console.log(payload);
    //     if (payload.message === "Server error") {
    //       // setError(true);
    //       // setTimeout(() =>{
    //       //   setError(false);
    //       // },2000)
    //       console.log("err");
    //     }
    //     if (payload.message === "success") {
    //       // setSuccess(true);
    //       // setTimeout(() =>{
    //       //   setSuccess(false);
    //       // },2000)
    //       localStorage.setItem("token", payload.result);
    //       localStorage.setItem("login", dataItem.login);
    //       // dispatch(addToRights(payload.rights));
    //       dispatch(logon(dataItem.login));
    //       navigate("/home/profile");
    //       console.log("suc");
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("rejected", error);
    //     if (error?.status === 400) alert("Неверный пароль");
    //   });
    dispatch(logon(dataItem.login));
    dispatch(logonUser(dataItem));
  };
  return (
    <>
      <Form
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement
            style={{
              maxWidth: 350,
              // border: "1px solid #e3e0e0",
              padding: 10,
              borderRadius: "5px",
            }}
          >
            <fieldset className={"k-form-fieldset"}>
              {/* <legend className={"k-form-legend"}>
              Please fill in the fields:
            </legend> */}
              {/* <div>
              <Field
                name={"firstName"}
                component={Input}
                label={"First name"}
              />
            </div> */}

              {/* <div>
              <Field name={"lastName"} component={Input} label={"Last name"} />
            </div> */}

              <div>
                <Field
                  name={"login"}
                  // type={"email"}
                  // component={EmailInput}
                  component={Input}
                  label={"Login"}
                  // validator={emailValidator}
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
                  // minLength={6}
                  // maxLength={18}
                />
              </div>
            </fieldset>
            <div className="k-form-buttons">
              <button
                type={"submit"}
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                // disabled={!formRenderProps.allowSubmit}
              >
                Войти
              </button>
            </div>
          </FormElement>
        )}
      />
    </>
  );
};

export default FormMain;
