import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import users from "./UserGroup.json";
import "./Vendor.css";
import { Button } from "@progress/kendo-react-buttons";
import { Window } from "@progress/kendo-react-dialogs";
import { uid } from "uid";
import { useNavigate } from "react-router-dom";
import { formatCodeBlockIcon } from "@progress/kendo-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  addUser,
  removeUser,
  editUser,
} from "../../features/reducer_user_group";
import {
  useCreateVendorMutation,
  useDeleteVendorMutation,
  useEditVendorMutation,
  useGetVendorContactsMutation,
  useGetVendorsQuery,
  useRemoveVendorContactsMutation,
  useEditVendorContactsMutation,
  useAddContactMutation,
} from "../../features/apiSlice";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Fade } from "@progress/kendo-react-animation";
import { useEffect } from "react";
import { useGetDictionaryQuery } from "../../features/apiSlice";
import Select from "react-select";
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
import PopUpContactVendors from "../../components/PopUpContactVendors";
const UserGroup = () => {
  const { data, error: err, isLoading, refetch } = useGetVendorsQuery();

  const [visible, setVisible] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [usersByGroup, setUsersByGroup] = React.useState([]);
  const [rightsByGroup, setRightsByGroup] = React.useState([]);
  const [contacts, setContacts] = React.useState([]);
  const [payload, setPayload] = React.useState([]);
  const [contactTypes, setContactTypes] = React.useState([]);
  const [editVendor] = useEditVendorMutation();
  const [createVendor] = useCreateVendorMutation();
  const [_deleteVendor] = useDeleteVendorMutation();
  const [getContacts] = useGetVendorContactsMutation();
  const [deleteContact] = useRemoveVendorContactsMutation();
  const [editContact] = useEditVendorContactsMutation();
  const { data: dict } = useGetDictionaryQuery();
  const [editContactData, setEditContactData] = React.useState([]);
  const [contactType, setContactType] = React.useState([]);
  const [showContactVisibility, setShowContactVisibility] = React.useState(0);
  const [idContact, setIdContact] = React.useState();
  const [addContact] = useAddContactMutation();
  function f() {
    return;
  }
  // console.log("error: ", err);
  // const navigate = useNavigate();
  // if (err?.status === 401) navigate("/");
  const dispatch = useDispatch();
  const EditCell = (props) => {
    //console.log(props)
    return (
      <td>
        <img
          onClick={() => openDialog(props.dataItem.id)}
          src={require("../../assets/edit.png")}
          alt="Изменить"
        />
        {/* <Button onClick={() => openDialog(props.dataItem.id)}>Изменить</Button> */}
      </td>
    );
  };

  const DeleteCell = (props) => {
    //console.log(props)
    return (
      <td>
        <img
          onClick={() => deleteVendor(props.dataItem.id)}
          src={require("../../assets/remove.png")}
          alt="Удалить"
        />
        {/* <Button themeColor="error" onClick={() => deleteVendor(props.dataItem.id)}>Удалить</Button> */}
      </td>
    );
  };

  const DeleteContactCell = (props) => {
    //console.log(props)
    return (
      <td>
        <img
          onClick={() => deleteContactVendor(props.dataItem.id)}
          src={require("../../assets/remove.png")}
          alt="Удалить"
        />
        {/* <Button themeColor="error" onClick={() => deleteVendor(props.dataItem.id)}>Удалить</Button> */}
      </td>
    );
  };
  const editContactVendor = (id) => {
    setShowContactVisibility(1);
    setEditContactData(contacts.find((contact) => contact.id === id));
    console.log("editContactVendor");
  };
  const EditContactCell = (props) => {
    //console.log(props)
    console.log();
    return (
      <td>
        <img
          onClick={() => editContactVendor(props.dataItem.id)}
          src={require("../../assets/edit.png")}
          alt="Редактировать"
        />
        {/* <Button themeColor="error" onClick={() => deleteVendor(props.dataItem.id)}>Удалить</Button> */}
      </td>
    );
  };

  const ContactCell = (props) => {
    //console.log(props)
    return (
      <td>
        <div onClick={() => showContact(props.dataItem.id)}>
          <img
            style={{ width: "20px" }}
            src={require("../../assets/contact.png")}
            alt="Показать контакты"
            title="Показать контакты"
          />
        </div>

        {/* <Button themeColor="error" onClick={() => deleteVendor(props.dataItem.id)}>Удалить</Button> */}
      </td>
    );
  };

  const AddCell = (props) => {
    //console.log(props)
    return (
      <td>
        <div
          onClick={() => {
            console.log(props.dataItem.id);
            setIdContact(props.dataItem.id);
            setShowContactVisibility(3);
          }}
        >
          <img
            style={{ width: "20px" }}
            src={require("../../assets/add.png")}
            alt="Добавить контакт"
            title="Добавить контакт"
          />
        </div>

        {/* <Button themeColor="error" onClick={() => deleteVendor(props.dataItem.id)}>Удалить</Button> */}
      </td>
    );
  };

  const deleteContactVendor = (id) => {
    deleteContact({ id });
  };

  const showContact = (id) => {
    if (id !== undefined) setIdContact(id);
    else id = idContact;
    getContacts({ id })
      .unwrap()
      .then((payload) => {
        // if (payload.message === "Server error") {
        //   setError(true);
        //   setTimeout(() => {
        //     setError(false);
        //   }, 2000);
        // }
        // if (payload.message === "success") {
        //   setSuccess(true);
        //   setTimeout(() => {
        //     setSuccess(false);
        //   }, 2000);
        // }
        setPayload(payload);
        console.log(payload);
      })
      .catch((error) => console.error("rejected", error));
  };

  useEffect(() => {
    if (dict === undefined || payload === undefined) return;
    let info = dict
      .filter((rec) => rec.dictId === 8)
      .map((el) => ({ name: el.name, type: el.id }));
    console.log(info);
    setContacts(
      payload.map((contact) => ({
        ...contact,
        type: info.find((el) => el.type == contact.type)?.name,
      }))
    );
    setContactType(
      dict
        .filter((rec) => rec.dictId === 8)
        .map((el) => ({ value: el.id, label: el.name }))
    );
  }, [dict, payload]);

  const removeFromGroup = async (id) => {
    // await removeUserFromGroup({GroupId: idGroup, UserId: id})
    // getUsersByGroup({id:idGroup})
    // .unwrap()
    // .then(payload =>{
    //   setUsersByGroup(payload);
    //   console.log(payload);
    // })
    // .catch(err => console.log(err));
  };
  const removeRightFromGroup = async (id) => {
    // await _removeRightFromGroup({GroupId: idGroup, RightId: id})
    // getRightsByGroup({id:idGroup})
    // .unwrap()
    // .then(payload =>{
    //   setRightsByGroup(payload);
    //   console.log(payload);
    // })
    // .catch(err => console.log(err));
  };

  //   const AddToGroupCell = (props) => {
  //     const users_id = usersByGroup.map(el => el.id)
  //     //console.log(props)
  //     return (
  //       <td>
  //         {users_id?.includes(props.dataItem.id) ?<Button themeColor="error" onClick={() => removeFromGroup(props.dataItem.id)}>Удалить из группы</Button> :<Button onClick={() => addToGroup(props.dataItem.id)}>Добавить в группу</Button>}
  //       </td>
  //     );
  //   };

  //   const AddRightToGroupCell = (props) => {
  //     const rights_id = rightsByGroup.map(el => el.id)
  //     //console.log(props)
  //     return (
  //       <td>
  //         {rights_id?.includes(props.dataItem.id) ?<Button themeColor="error" onClick={() => removeRightFromGroup(props.dataItem.id)}>Удалить из группы</Button> :<Button onClick={() => addRightToGroup(props.dataItem.id)}>Добавить в группу</Button>}
  //       </td>
  //     );
  //   };

  // const [info, setInfo] = React.useState(users);
  // const info = useSelector((state) => state.user_group.users);
  //   const {}
  const [formData, setFormData] = React.useState({});
  const [idGroup, setIdGroup] = React.useState(null);
  //   const { data: users } = useGetAllUsersQuery();
  //   const { data: rights } = useGetAllRightsQuery();

  const addToGroup = async (id) => {
    // await addUserToGroup({GroupId: idGroup, UserId: id});
    // getUsersByGroup({id:idGroup})
    // .unwrap()
    // .then(payload =>{
    //   setUsersByGroup(payload);
    //   console.log(payload);
    // })
    // .catch(err => console.log(err));
  };

  const addRightToGroup = async (id) => {
    // await _addRightToGroup({GroupId: idGroup, RightId: id});
    // getRightsByGroup({id:idGroup})
    // .unwrap()
    // .then(payload =>{
    //   setRightsByGroup(payload);
    //   console.log(payload);
    // })
    // .catch(err => console.log(err));
  };

  // const removeRightToGroup = async (id) => {
  //   await _removeRightToGroup({GroupId: idGroup, RightId: id});
  //   getRightsByGroup({id:idGroup})
  //   .unwrap()
  //   .then(payload =>{
  //     setRightsByGroup(payload);
  //     console.log(payload);
  //   })
  //   .catch(err => console.log(err));
  // }

  const getById = (id) => {
    const element = data.find((el) => el.id === id);
    return element;
  };

  const openDialog = (id) => {
    console.log("Active");
    setVisible(1);
    setFormData({});
    setId(id);
    setFormData(getById(id));
  };

  const deleteVendor = (id) => {
    //const arr = info.filter(el => el.id !== id);
    if (window.confirm("Удалить поставщика?")) _deleteVendor(getById(id));
    // dispatch(removeUser(id));
    //setInfo(arr);
  };
  const clickGroup = (e) => {
    console.log("click row");
    console.log(e);
    const id_group = e.dataItem.id;
    showContact(id_group);
    // setIdGroup(id_group);
    // getUsersByGroup({id:id_group})
    // .unwrap()
    // .then(payload =>{
    //   setUsersByGroup(payload);
    //   console.log(payload);
    // })
    // .catch(err => console.log(err));

    // getRightsByGroup({id:id_group})
    // .unwrap()
    // .then(payload =>{
    //   setRightsByGroup(payload);
    //   console.log(payload);
    // })
    // .catch(err => console.log(err));
    // e.target.style.color = 'red';
  };
  const closeDialog = () => {
    setVisible(0);
    setId(null);
    setFormData({ id: "", name: "" });
  };

  // const getCodeById = id => {
  //   const element = data.find(el => el.id === id);
  //   return element.code;
  // };
  // const getSurnameById = id => {
  //   const element = data.find(el => el.id === id);
  //   return element.surname;
  // };
  const addVendor = () => {
    let found = data.find((vendor) => vendor.code === formData.code);
    if (found.id !== formData.id) {
      console.log(found, formData);
      alert("Поле код должно быть уникальным");
      return;
    }
    createVendor(formData);
    closeDialog();
  };
  const save = () => {
    let found = data.find((vendor) => vendor.code === formData.code);
    if (found.id !== formData.id) {
      console.log(found, formData);
      alert("Поле код должно быть уникальным");
      return;
    }
    if (formData.name && formData.code) {
      editVendor(formData);
      closeDialog();
    } else {
      alert("Введите все поля");
    }
    // const arr = info.map(el =>{
    //    if(el.id != id) return el;
    //    else return formData;
    // });
    //dispatch(editUser({id, formData}));
    // edit(formData)
    // .unwrap()
    // .then((payload) => {
    //   if(payload.message === "Server error"){
    //     setError(true);
    //     setTimeout(() =>{
    //       setError(false);
    //     },2000)
    //   }
    //   if(payload.message === "success"){
    //     setSuccess(true);
    //     setTimeout(() =>{
    //       setSuccess(false);
    //     },2000)
    //   }
    // })
    // .catch((error) => console.error('rejected', error))
    //setInfo(arr);
  };
  const addGroup1 = () => {
    setVisible(3);
    setFormData({ id: "", name: "", code: "" });
  };
  const add = () => {
    if (formData.name) {
      createVendor({ id: "", name: formData.name });
      //formData.id = uid();
      //setInfo([...info, formData]);
      // dispatch(addUser(formData));
      //   _addGroup(formData)
      //   .unwrap()
      //   .then((payload) => {
      //     if(payload.message === "Server error"){
      //       setError(true);
      //       setTimeout(() =>{
      //         setError(false);
      //       },2000)
      //     }
      //     if(payload.message === "success"){
      //       setSuccess(true);
      //       setTimeout(() =>{
      //         setSuccess(false);
      //       },2000)
      //     }
      //   })
      //   .catch((error) => {
      //     console.error('rejected', error)
      //     if(error.status === 401) navigate('/');
      //   })
      //   setFormData({name:'', login:'', email:'', password:''});
      //   setVisible(0);
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const getNameById = (id) => {
    return data.find((el) => el.id === id).name;
  };

  const saveChangesContact = () => {
    editContactVendor(editContactData);
  };

  const closeDialogContact = () => {
    setShowContactVisibility(0);
    setEditContactData({});
  };
  const closeEditDialog = () => {
    // setShowContactVisibility(0);
    setShowContactVisibility(0);
  };
  const saveEdit = () => {
    editContact(editContactData);
    closeEditDialog();
    showContact();
  };
  const saveContact = () => {
    addContact({ body: { ...editContactData, vendorId: idContact, id: "" } });
    setEditContactData({});
    closeEditDialog();
  };
  return (
    <div>
      <div className="add_user" style={{ marginTop: "100px" }}>
        <Button onClick={() => addGroup1()}>Добавить</Button>
      </div>

      <Grid
        data={data}
        className="grid"
        style={{
          height: "400px",
        }}
        onRowClick={clickGroup}
        // selectable={{
        //   enabled: true,
        //   // drag: dragEnabled,
        //   cell: false,
        //   // mode: selectionMode,
        // }}
      >
        <GridColumn field="name" title="Имя" />
        <GridColumn field="code" title="Код" />
        <GridColumn cell={EditCell} width="50px" />
        {/* <GridColumn cell={DeleteCell} width="50px" /> */}
        <GridColumn cell={ContactCell} width="50px" />
        <GridColumn cell={AddCell} width="50px" />
      </Grid>
      <div style={{ marginLeft: "50px", marginTop: "20px" }}>
        {idContact && (
          <div> Компания: {data?.find((el) => el.id === idContact).name}</div>
        )}
      </div>
      <Grid
        data={contacts}
        className="grid"
        style={{
          height: "200px",
        }}
        // onRowClick={clickGroup}
        // selectable={{
        //   enabled: true,
        //   // drag: dragEnabled,
        //   cell: false,
        //   // mode: selectionMode,
        // }}
      >
        <GridColumn field="name" title="Имя" />
        <GridColumn field="contact" title="Контакт" />
        <GridColumn field="type" title="Тип" />
        <GridColumn cell={EditContactCell} width="50px" />
        <GridColumn cell={DeleteContactCell} width="50px" />
      </Grid>
      <div className="tables"></div>
      <PopUpContactVendors
        showContactVisibility={showContactVisibility}
        closeEditDialog={closeEditDialog}
        idContact={idContact}
        contactType={contactType}
        initialValue={editContactData}
      />
      {!!visible && (
        <Window title={"Group"} onClose={closeDialog} initialHeight={350}>
          <form className="k-form">
            <fieldset>
              {visible === 1 || visible === 3 ? (
                <legend>Vendor Details</legend>
              ) : (
                <legend>Vendor Contact</legend>
              )}

              {/* {contacts.map()} */}
              {visible === 1 || visible === 3 ? (
                <>
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
                    <span>Code</span>
                    <input
                      className="k-input"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      placeholder="Code"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="k-form-field">
                    <span>Contact</span>
                    <input
                      className="k-input"
                      value={editContactData.contact}
                      onChange={(e) =>
                        setEditContactData({
                          ...editContactData,
                          contact: e.target.value,
                        })
                      }
                      placeholder="Name"
                    />
                  </label>
                </>
              )}
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
              {visible === 3 && (
                <button
                  type="button"
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                  onClick={addVendor}
                >
                  Submit
                </button>
              )}
              {visible === 1 && (
                <button
                  type="button"
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                  onClick={save}
                >
                  Submit
                </button>
              )}
              {visible === 2 && (
                <button
                  type="button"
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                  onClick={saveChangesContact}
                >
                  Submit
                </button>
              )}
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
export default UserGroup;
