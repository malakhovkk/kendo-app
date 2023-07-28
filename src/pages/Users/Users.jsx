import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import users from "./Users.json";
import './Users.css';
import { useGetAllUsersQuery, useEditUserMutation, useCreateUserMutation } from "../../features/apiSlice";
import { Button } from "@progress/kendo-react-buttons";
import { Window } from "@progress/kendo-react-dialogs";
import { uid } from 'uid';
import { formatCodeBlockIcon } from "@progress/kendo-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { addUser, removeUser, editUser } from "../../features/slice";
// const CustomCell = (props) => {
//   return (
//     <td
//       {...props.tdProps}
//       colSpan={1}
//       style={{
//         color: props.color,
//       }}
//     >
//       {props.children}
//     </td>
//   );
// };
// const MyCustomCell = (props) => <CustomCell {...props} color={"red"} />;


const Users = () => {
  const dispatch = useDispatch();
  const EditCell = (props) => {
    //console.log(props)
    return (
      <td>
        <Button onClick={() => openDialog(props.dataItem.id)}>Изменить</Button>
      </td>
    );
  };

  const DeleteCell = (props) => {
    //console.log(props)
    return (
      <td>
        <Button themeColor="error" onClick={() => deleteUser(props.dataItem.id)}>Удалить</Button>
      </td>
    );
  };

  
  const { data, error, isLoading, refetch } = useGetAllUsersQuery();
  const [edit] = useEditUserMutation();
  const [_addUser] = useCreateUserMutation();
  const [visible, setVisible] = React.useState(false);
  const [id, setId] = React.useState(null);
  // const [info, setInfo] = React.useState(users);
  // const info = useSelector((state) => state.info.users);
  // React.useEffect(() =>{
  //   console.log(info)
  // },[info])

  React.useEffect(() =>{
    console.log("data ", data)
  },[data])

  const [formData, setFormData] = React.useState({});

  const getById = id => {
    const element = data.find(el => el.id === id);
    return element;
  }

  const openDialog = id => {
    console.log("Active");
    setVisible(1);
    setFormData({});
    setId(id);
    setFormData(getById(id));
  };

  const deleteUser = (id) => {
    //const arr = info.filter(el => el.id !== id);
    if(window.confirm('Удалить пользователя?'))
    dispatch(removeUser(id));
    //setInfo(arr);
  }

  const closeDialog = () => {
    setVisible(0);
    setId(null);
    setFormData({surname: '', code:'', password:''});
  }

  // const getCodeById = id => {
  //   const element = data.find(el => el.id === id);
  //   return element.code;
  // };
  // const getSurnameById = id => {
  //   const element = data.find(el => el.id === id);
  //   return element.surname;
  // };
  const save = () => {
    // const arr = info.map(el =>{
    //    if(el.id != id) return el;
    //    else return formData;
    // });
    //dispatch(editUser({id, formData}));
    edit(formData);
    //setInfo(arr);
    closeDialog();
  }
  const addUser1 = () => {
    setVisible(2);
    setFormData({name:'', login:'', email:'', password:''});
  }
  const add = () => {
    if(formData.name && formData.email && formData.login && formData.password)
    {
      //formData.id = uid();
      //setInfo([...info, formData]);
      // dispatch(addUser(formData));
      _addUser(formData)
      setFormData({name:'', login:'', email:'', password:''});
      setVisible(0);
    }
  }

  return (
    <div>
      <div className="add_user">
        <Button onClick={() => addUser1()}>Добавить</Button>
      </div>
    <Grid
      data={data}
      className="grid"
      style={{
        height: "400px",
      }}
    >
      <GridColumn field="name" title="Name"  />
      <GridColumn field="email" title="Email"  />
      <GridColumn field="login" title="Login"  />
      {/* <GridColumn field="code" title="Code"  />
      <GridColumn field="surname" title="Surname" /> */}
      <GridColumn cell={EditCell}  width="200px" />
      <GridColumn cell={DeleteCell}  width="200px" />
    </Grid>
     {!!visible && (
      <Window title={"User"} onClose={closeDialog} initialHeight={350}>
        <form className="k-form">
          <fieldset>
            {visible === 1 ? <legend>User Details</legend> : <legend>Add User</legend>  }

            <label className="k-form-field">
              <span>Name</span>
              <input className="k-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Name" />
            </label>
            <label className="k-form-field">
              <span>Email</span>
              <input className="k-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email" />
            </label>
            <label className="k-form-field">
              <span>Login</span>
              <input className="k-input" value={formData.login} onChange={(e) => setFormData({...formData, login: e.target.value})} placeholder="Login" />
            </label>
            {
              visible === 2 ? 
            <label className="k-form-field">
              <span>Password</span>
              <input className="k-input" value={formData.password} type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Password" />
            </label>: <></>
            }
          </fieldset>

          <div className="text-right">
            <button
              type="button"
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              onClick={closeDialog}
            >
              Cancel
            </button>
            {/* <button
              type="button"
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
               onClick={save}
            >
              Submit
            </button> */}

            {
              visible === 1 ? <button
              type="button"
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
               onClick={save}
            >
              Submit
            </button>:
            <button
            type="button"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
             onClick={add}
          >
            Submit
          </button>
            }
          </div>
        </form>
      </Window>
      )}
    </div>
  );
};
export default Users;