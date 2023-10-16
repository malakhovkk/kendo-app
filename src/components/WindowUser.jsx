import * as React from "react";
import * as ReactDOM from "react-dom";
import { Window } from "@progress/kendo-react-dialogs";
import Select from "react-select";

const WindowUser = ({
  visible,
  closeDialog,
  save,
  add,
  optionsVendor,
  initialValue,
}) => {
  console.log(initialValue);
  const [formData, setFormData] = React.useState({
    id: "",
    name: "",
    login: "",
    email: "",
    password: "",
  });
  React.useEffect(() => {
    console.log(initialValue);
    setFormData(
      initialValue ?? {
        id: "",
        name: "",
        login: "",
        email: "",
        password: "",
      }
    );
  }, [initialValue]);
  const onSelectVendor = (vendor) => {
    setFormData({ ...formData, companyId: vendor.value });
  };
  console.log("Render WindowUser");
  return (
    <Window
      title={"User"}
      onClose={() => {
        closeDialog();
        setFormData({ id: "", name: "", login: "", email: "", password: "" });
      }}
      initialHeight={350}
    >
      <form className="k-form">
        <fieldset>
          {visible === 1 ? (
            <legend>User Details</legend>
          ) : (
            <legend>Add User</legend>
          )}

          <label className="k-form-field">
            <span>Name</span>
            <input
              className="k-input"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Name"
            />
          </label>
          <label className="k-form-field">
            <span>Email</span>
            <input
              className="k-input"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email(optional)"
            />
          </label>
          <label className="k-form-field">
            <span>Login</span>
            <input
              className="k-input"
              value={formData.login}
              onChange={(e) =>
                setFormData({ ...formData, login: e.target.value })
              }
              placeholder="Login"
            />
          </label>
          <label className="k-form-field">
            <span>Login</span>
            <Select
              options={optionsVendor}
              onChange={onSelectVendor}
              placeholder="Выбрать компанию"
            />
          </label>

          {visible === 2 ? (
            <label className="k-form-field">
              <span>Password</span>
              <input
                className="k-input"
                value={formData.password}
                type="password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
              />
            </label>
          ) : (
            <></>
          )}
        </fieldset>

        <div className="text-right">
          <button
            type="button"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
            onClick={() => {
              closeDialog();
              setFormData({
                id: "",
                name: "",
                login: "",
                email: "",
                password: "",
              });
            }}
          >
            Cancel
          </button>

          {visible === 1 ? (
            <button
              type="button"
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
              onClick={() => save(formData)}
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
              onClick={() => add(formData)}
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </Window>
  );
};

export default WindowUser;
