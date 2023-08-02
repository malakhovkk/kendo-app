import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import users from "./UserGroup.json";
import './Rights.css';
import { Button } from "@progress/kendo-react-buttons";
import { Window } from "@progress/kendo-react-dialogs";
import { uid } from 'uid';
import { useNavigate } from "react-router-dom";
import { formatCodeBlockIcon } from "@progress/kendo-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { useGetAllRightsQuery, useEditRightMutation, useCreateRightMutation, useDeleteRightMutation } from "../../features/apiSlice";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Fade } from "@progress/kendo-react-animation";
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


const Rights = () => {
  const { data, error: err,  isLoading, refetch } = useGetAllRightsQuery();
  const [edit] = useEditRightMutation();
  const [_addRight] = useCreateRightMutation();
  const [_deleteRight] = useDeleteRightMutation();
  const [visible, setVisible] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  const navigate = useNavigate();
  if(err?.status === 401) navigate('/');

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
        <Button themeColor="error" onClick={() => deleteRight(props.dataItem.id)}>Удалить</Button>
      </td>
    );
  };

  
  

  // const [info, setInfo] = React.useState(users);
  // const info = useSelector((state) => state.user_group.users);
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

  const deleteRight = (id) => {
    //const arr = info.filter(el => el.id !== id);
    if(window.confirm('Удалить право?'))
    _deleteRight(getById(id));
    // dispatch(removeUser(id));
    //setInfo(arr);
  }

  const closeDialog = () => {
    setVisible(0);
    setId(null);
    setFormData({id:'', name:'', code:''});
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
    edit(formData)
    .unwrap()
    .then((payload) => { 
      if(payload.message === "Server error"){
        setError(true);
        setTimeout(() =>{
          setError(false);
        },2000)
      }
      if(payload.message === "success"){
        setSuccess(true);
        setTimeout(() =>{
          setSuccess(false);
        },2000)
      }        
    })
    .catch((error) => console.error('rejected', error))
    //setInfo(arr);
    closeDialog();
  }
  const addRight1 = () => {
    setVisible(2);
    setFormData({id:'', name:'', code:''});
  }
  const add = () => {
    if(formData.name)
    {
      //formData.id = uid();
      //setInfo([...info, formData]);
      // dispatch(addUser(formData));
      _addRight(formData)
      .unwrap()
      .then((payload) => { 
        if(payload.message === "Server error"){
          setError(true);
          setTimeout(() =>{
            setError(false);
          },2000)
        }
        if(payload.message === "success"){
          setSuccess(true);
          setTimeout(() =>{
            setSuccess(false);
          },2000)
        }        
      })
      .catch((error) => console.error('rejected', error))
      setFormData({name:'', login:'', email:'', password:''});
      setVisible(0);
    }
  }
  return (
    <div>
      <div className="add_user">
        <Button onClick={() => addRight1()}>Добавить</Button>
      </div>
    <Grid
      data={data}
      className="grid"
      style={{
        height: "400px",
      }}
    >
      <GridColumn field="name" title="Name" />
      <GridColumn field="code" title="Code" />
      <GridColumn cell={EditCell}  width="200px" />
      <GridColumn cell={DeleteCell}  width="200px" />
    </Grid>
     {!!visible && (
      <Window title={"Group"} onClose={closeDialog} initialHeight={350}>
        <form className="k-form">
          <fieldset>
            {visible === 1 ? <legend>Group Details</legend> : <legend>Add Group</legend>  }

            <label className="k-form-field">
              <span>Name</span>
              <input className="k-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Code" />
            </label>
            <label className="k-form-field">
              <span>Code</span>
              <input className="k-input" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="Code" />
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
      <NotificationGroup
        style={{
          right: 0,
          bottom: 0,
          alignItems: "flex-start",
          flexWrap: "wrap-reverse",
        }}
      >
        <Fade>
          {success && (
            <Notification
              type={{
                style: "success",
                icon: true,
              }}
              closable={true}
              
            >
              <span>Your data has been saved.</span>
            </Notification>
          )}
        </Fade>
        <Fade>
          {error && (
            <Notification
              type={{
                style: "error",
                icon: true,
              }}
              closable={true}
            >
              <span>Oops! Something went wrong ...</span>
            </Notification>
          )}
        </Fade>
       
      
      </NotificationGroup>
    </div>
  );
};
export default Rights;