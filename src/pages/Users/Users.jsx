import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import "./Users.css";
import {
  useGetAllUsersQuery,
  useEditUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
} from "../../features/apiSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useGetVendorsQuery } from "../../features/apiSlice";
import WindowUser from "../../components/WindowUser";

const Users = () => {
  const EditCell = (props) => {
    return (
      <td>
        <img
          onClick={() => openDialog(props.dataItem.id)}
          src={require("../../assets/edit.png")}
          alt="Изменить"
        />
      </td>
    );
  };

  const DeleteCell = (props) => {
    return (
      <td>
        <img
          onClick={() => deleteUser(props.dataItem.id)}
          src={require("../../assets/remove.png")}
          alt="Удалить"
        />
      </td>
    );
  };

  const { data: users, error: err, isLoading, refetch } = useGetAllUsersQuery();
  const [edit] = useEditUserMutation();
  const [addUserReq] = useCreateUserMutation();
  const [deleteUserReq] = useDeleteUserMutation();
  const [visible, setVisible] = React.useState(false);
  const [initialValue, setInitialValue] = React.useState();
  const { data: vendors } = useGetVendorsQuery();
  const data = vendors
    ? users?.map((user) => ({
        ...user,
        companyName:
          vendors.find((vendor) => vendor.id === user.companyId)?.name ?? "",
      }))
    : [];
  const optionsVendor = vendors?.map((vendor) => ({
    value: vendor.id,
    label: vendor.name,
  }));

  // const [formData, setFormData] = React.useState({});

  const getById = (id) => {
    const element = data.find((el) => el.id === id);
    return element;
  };

  const openDialog = (id) => {
    setInitialValue(getById(id));
    setVisible(1);
  };

  const deleteUser = (id) => {
    if (window.confirm("Удалить пользователя?")) deleteUserReq(getById(id));
  };

  const closeDialog = () => {
    setVisible(0);
  };

  const showSuccess = (msg) => {
    toast.success(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const showError = (msg) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  }

  const save = (formData) => {
    edit(formData)
      .unwrap()
      .then((payload) => {
        if (payload.message === "success") {
          showSuccess(`Успешно пользователь добавлен! `);
        } else {
          showError(`Ошибка при добавлении пользователя!`)
        }
      })
      .catch((error) =>  console.error("rejected", error));
    closeDialog();
  };
  const addUser = () => {
    setVisible(2);
  };

  const add = (formData) => {
    if (formData.name && formData.login && formData.password) {
      addUserReq(formData)
        .unwrap()
        .then((payload) => {
          if (payload.message === "success") {
            showSuccess(`Успешно пользователь добавлен! `);
          } else {
            showError(`Ошибка при добавлении пользователя!`)
          }
        })
        .catch((error) => console.error("rejected", error));
      setVisible(0);
    } else {
      showError(`Ошибка: заполните необходимые поля`);
    }
  };


  return (
    <div style={{ marginTop: "100px" }}>
      <div className="add_user">
        <img
          style={{
            marginTop: "10px",
            width: "35px",
          }}
          onClick={addUser}
          src={require("../../assets/add_btn.png")}
        />
      </div>
      <Grid
        data={data}
        className="grid"
        style={{
          height: "400px",
        }}
      >
        <GridColumn field="name" title="Name" />
        <GridColumn field="email" title="Email" />
        <GridColumn field="login" title="Login" />
        <GridColumn field="companyName" title="CompanyName" />
        <GridColumn cell={EditCell} width="50px" />
        <GridColumn cell={DeleteCell} width="50px" />
      </Grid>
      {!!visible && (
        <WindowUser
          visible={visible}
          initialValue={initialValue}
          closeDialog={closeDialog}
          save={save}
          add={add}
          optionsVendor={optionsVendor}
        />
      )}
    </div>
  );
};
export default Users;
