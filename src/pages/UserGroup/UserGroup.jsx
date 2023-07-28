import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import users from "./UserGroup.json";
import './UserGroup.css';
import { Button } from "@progress/kendo-react-buttons";
import { Window } from "@progress/kendo-react-dialogs";
import { uid } from 'uid';
import { formatCodeBlockIcon } from "@progress/kendo-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { addUser, removeUser, editUser } from "../../features/reducer_user_group";
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


const UserGroup = () => {
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

  
  
  const [visible, setVisible] = React.useState(false);
  const [id, setId] = React.useState(null);
  // const [info, setInfo] = React.useState(users);
  const info = useSelector((state) => state.user_group.users);
  const [formData, setFormData] = React.useState({});
  const openDialog = id => {
    console.log("Active");
    setVisible(1);
    setFormData({});
    setId(id);
    setFormData({id, code: getCodeById(id), surname: getSurnameById(id)});
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
    setFormData({surname: '', code:''});
  }

  const getCodeById = id => {
    console.log(info, id);
    const element = info.find(el => el.id === id);
    return element.code;
  };
  const getSurnameById = id => {
    const element = info.find(el => el.id === id);
    return element.surname;
  };
  const save = () => {
    // const arr = info.map(el =>{
    //    if(el.id != id) return el;
    //    else return formData;
    // });
    dispatch(editUser({id, formData}));
    //setInfo(arr);
    closeDialog();
  }
  const addUser1 = () => {
    setVisible(2);
    setFormData({surname: '', code:''});
  }
  const add = () => {
    if(formData.code && formData.surname)
    {
      formData.id = uid();
      //setInfo([...info, formData]);
      dispatch(addUser(formData));
      setFormData({surname: '', code:''});
      setVisible(0);
    }
  }

  return (
    <div>
      <div className="add_user">
        <Button onClick={() => addUser1()}>Добавить</Button>
      </div>
    <Grid
      data={info}
      className="grid"
      style={{
        height: "400px",
      }}
    >
      <GridColumn field="code" title="Code"  />
      <GridColumn field="surname" title="Surname" />
      <GridColumn cell={EditCell}  width="200px" />
      <GridColumn cell={DeleteCell}  width="200px" />
    </Grid>
     {!!visible && (
      <Window title={"User"} onClose={closeDialog} initialHeight={350}>
        <form className="k-form">
          <fieldset>
            {visible === 1 ? <legend>User Details</legend> : <legend>Add User</legend>  }

            <label className="k-form-field">
              <span>Code</span>
              <input className="k-input" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="Code" />
            </label>
            <label className="k-form-field">
              <span>Surname</span>
              <input className="k-input" value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} placeholder="Surname" />
            </label>
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
export default UserGroup;