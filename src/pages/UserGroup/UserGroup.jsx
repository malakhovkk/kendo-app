import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import users from "./UserGroup.json";
import "./UserGroup.css";
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
  useGetUsersByGroupMutation,
  useGetAllUsersQuery,
  useGetAllGroupsQuery,
  useEditGroupMutation,
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useAddUserToGroupMutation,
  useRemoveUserFromGroupMutation,
  useRemoveRightFromGroupMutation,
  useGetRightsByGroupMutation,
  useAddRightToGroupMutation,
  useGetAllRightsQuery,
} from "../../features/apiSlice";
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

const UserGroup = () => {
  const { data, error: err, isLoading, refetch } = useGetAllGroupsQuery();
  const [edit] = useEditGroupMutation();
  const [addGroupReq] = useCreateGroupMutation();
  const [_deleteGroup] = useDeleteGroupMutation();
  const [addUserToGroup] = useAddUserToGroupMutation();
  const [getUsersByGroup] = useGetUsersByGroupMutation();
  const [removeUserFromGroup] = useRemoveUserFromGroupMutation();
  const [_addRightToGroup] = useAddRightToGroupMutation();
  const [getRightsByGroup] = useGetRightsByGroupMutation();
  const [_removeRightFromGroup] = useRemoveRightFromGroupMutation();
  const [visible, setVisible] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [usersByGroup, setUsersByGroup] = React.useState([]);
  const [rightsByGroup, setRightsByGroup] = React.useState([]);
  console.log("error: ", err);

  const navigate = useNavigate();
  // if(err?.status === 401) navigate('/');
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
          onClick={() => deleteUser(props.dataItem.id)}
          src={require("../../assets/remove.png")}
          alt="Удалить"
        />
        {/* <Button themeColor="error" onClick={() => deleteUser(props.dataItem.id)}>Удалить</Button> */}
      </td>
    );
  };

  const removeFromGroup = async (id) => {
    await removeUserFromGroup({ GroupId: idGroup, UserId: id });
    getUsersByGroup({ id: idGroup })
      .unwrap()
      .then((payload) => {
        setUsersByGroup(payload);
        console.log(payload);
      })
      .catch((err) => console.log(err));
  };
  const removeRightFromGroup = async (id) => {
    await _removeRightFromGroup({ GroupId: idGroup, RightId: id });
    getRightsByGroup({ id: idGroup })
      .unwrap()
      .then((payload) => {
        setRightsByGroup(payload);
        console.log(payload);
      })
      .catch((err) => console.log(err));
  };

  const AddToGroupCell = (props) => {
    const users_id = usersByGroup.map((el) => el.id);
    //console.log(props)
    return (
      <td>
        {users_id?.includes(props.dataItem.id) ? (
          <Button
            themeColor="error"
            onClick={() => removeFromGroup(props.dataItem.id)}
          >
            Удалить из группы
          </Button>
        ) : (
          <Button onClick={() => addToGroup(props.dataItem.id)}>
            Добавить в группу
          </Button>
        )}
      </td>
    );
  };

  const AddRightToGroupCell = (props) => {
    const rights_id = rightsByGroup.map((el) => el.id);
    //console.log(props)
    return (
      <td>
        {rights_id?.includes(props.dataItem.id) ? (
          <Button
            themeColor="error"
            onClick={() => removeRightFromGroup(props.dataItem.id)}
          >
            Удалить из группы
          </Button>
        ) : (
          <Button onClick={() => addRightToGroup(props.dataItem.id)}>
            Добавить в группу
          </Button>
        )}
      </td>
    );
  };

  // const [info, setInfo] = React.useState(users);
  // const info = useSelector((state) => state.user_group.users);
  const [formData, setFormData] = React.useState({});
  const [idGroup, setIdGroup] = React.useState(null);
  const { data: users } = useGetAllUsersQuery();
  const { data: rights } = useGetAllRightsQuery();

  const addToGroup = async (id) => {
    await addUserToGroup({ GroupId: idGroup, UserId: id });
    getUsersByGroup({ id: idGroup })
      .unwrap()
      .then((payload) => {
        setUsersByGroup(payload);
        console.log(payload);
      })
      .catch((err) => console.log(err));
  };

  const addRightToGroup = async (id) => {
    await _addRightToGroup({ GroupId: idGroup, RightId: id });
    getRightsByGroup({ id: idGroup })
      .unwrap()
      .then((payload) => {
        setRightsByGroup(payload);
        console.log(payload);
      })
      .catch((err) => console.log(err));
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

  const [active, setActive] = React.useState("");
  const click = (e) => {
    const id = e.dataItem.id;
    setActive(id);
  };

  const rowRender = (trElement, props) => {
    const blue = { backgroundColor: "#d9d9e3" };
    const red = {};
    // console.log(active, "  ", props.dataItem.id);
    const trProps = {
      style: active === props.dataItem.id ? blue : red,
    };
    return React.cloneElement(
      trElement,
      {
        ...trProps,
      },
      trElement.props.children
    );
  };

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

  const deleteUser = (id) => {
    //const arr = info.filter(el => el.id !== id);
    if (window.confirm("Удалить группу?")) _deleteGroup(getById(id));
    // dispatch(removeUser(id));
    //setInfo(arr);
  };
  const clickGroup = (e) => {
    const id = e.dataItem.id;
    setActive(id);
    console.log("click row");
    console.log(e);
    const id_group = e.dataItem.id;
    setIdGroup(id_group);
    getUsersByGroup({ id: id_group })
      .unwrap()
      .then((payload) => {
        setUsersByGroup(payload);
        console.log(payload);
      })
      .catch((err) => console.log(err));

    getRightsByGroup({ id: id_group })
      .unwrap()
      .then((payload) => {
        setRightsByGroup(payload);
        console.log(payload);
      })
      .catch((err) => console.log(err));
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
  const save = () => {
    // const arr = info.map(el =>{
    //    if(el.id != id) return el;
    //    else return formData;
    // });
    //dispatch(editUser({id, formData}));
    edit(formData)
      .unwrap()
      .then((payload) => {
        if (payload.message === "Server error") {
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 2000);
        }
        if (payload.message === "success") {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 2000);
        }
      })
      .catch((error) => console.error("rejected", error));
    //setInfo(arr);
    closeDialog();
  };
  const addGroup = () => {
    setVisible(2);
    setFormData({ id: "", name: "" });
  };
  const add = () => {
    if (formData.name) {
      //formData.id = uid();
      //setInfo([...info, formData]);
      // dispatch(addUser(formData));
      addGroupReq(formData)
        .unwrap()
        .then((payload) => {
          if (payload.message === "Server error") {
            setError(true);
            setTimeout(() => {
              setError(false);
            }, 2000);
          }
          if (payload.message === "success") {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 2000);
          }
        })
        .catch((error) => {
          console.error("rejected", error);
          if (error.status === 401) navigate("/");
        });
      setFormData({ name: "", login: "", email: "", password: "" });
      setVisible(0);
    }
  };

  const getNameById = (id) => {
    return data.find((el) => el.id === id).name;
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <div
        className="add_group"
        style={{
          marginTop: "10px",
          width: "35px",
          textAlign: "right",
          width: "100%",
        }}
      >
        <img
          style={{
            marginTop: "10px",
            width: "35px",
            textAlign: "right",
            marginRight: "50px",
          }}
          onClick={addGroup}
          src={require("../../assets/add_btn.png")}
        />
      </div>

      <Grid
        data={data}
        className="grid"
        style={{
          height: "400px",
        }}
        rowRender={rowRender}
        onRowClick={clickGroup}
        // selectable={{
        //   enabled: true,
        //   // drag: dragEnabled,
        //   cell: false,
        //   // mode: selectionMode,
        // }}
      >
        <GridColumn field="name" title="Name" />
        <GridColumn cell={EditCell} width="50px" />
        <GridColumn cell={DeleteCell} width="50px" />
      </Grid>
      <div className="tables">
        {idGroup ? (
          <div>
            <div className="add_to_group">
              Добавить пользователей в группу под названием{" "}
              {getNameById(idGroup)}
            </div>
            <Grid
              data={users}
              className="grid"
              style={{
                height: "400px",
              }}
            >
              <GridColumn field="name" title="Name" />
              {/* <GridColumn field="email" title="Email"  />
      <GridColumn field="login" title="Login"  /> */}
              {/* <GridColumn field="code" title="Code"  />
      <GridColumn field="surname" title="Surname" /> */}
              <GridColumn cell={AddToGroupCell} width="200px" />
            </Grid>
          </div>
        ) : (
          <></>
        )}
        {idGroup ? (
          <div>
            <div className="add_to_group">
              Добавить права в группу под названием {getNameById(idGroup)}
            </div>
            <Grid
              data={rights}
              className="grid"
              style={{
                height: "400px",
              }}
            >
              <GridColumn field="name" title="Name" />
              {/* <GridColumn field="email" title="Email"  />
      <GridColumn field="login" title="Login"  /> */}
              {/* <GridColumn field="code" title="Code"  />
      <GridColumn field="surname" title="Surname" /> */}
              <GridColumn cell={AddRightToGroupCell} width="200px" />
            </Grid>
          </div>
        ) : (
          <></>
        )}
      </div>
      {!!visible && (
        <Window title={"Group"} onClose={closeDialog} initialHeight={350}>
          <form className="k-form">
            <fieldset>
              {visible === 1 ? (
                <legend>Group Details</legend>
              ) : (
                <legend>Add Group</legend>
              )}

              <label className="k-form-field">
                <span>Name</span>
                <input
                  className="k-input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Code"
                />
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

              {visible === 1 ? (
                <button
                  type="button"
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                  onClick={save}
                >
                  Submit
                </button>
              ) : (
                <button
                  type="button"
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                  onClick={add}
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
