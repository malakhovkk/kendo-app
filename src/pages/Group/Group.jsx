import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import users from "./Users.json";
import './Users.css';
import { Button } from "@progress/kendo-react-buttons";
import { Window } from "@progress/kendo-react-dialogs";
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


const Group = () => {
  const CommandCell = (props) => {
    //console.log(props)
    return (
      <td>
        <Button onClick={() => openDialog(props.dataItem.id)}>Изменить</Button>
      </td>
    );
  };
  
  const [visible, setVisible] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [info, setInfo] = React.useState(users);
  const [formData, setFormData] = React.useState({});
  const openDialog = id => {
    console.log("Active");
    setVisible(true);
    setId(id);
    setFormData({id, code: getCodeById(id), surname: getSurnameById(id)});
  };

  const closeDialog = () => {
    setVisible(false);
    setId(null);
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
    const arr = info.map(el =>{
       if(el.id != id) return el;
       else return formData;
    });
    setInfo(arr);
    closeDialog();
  }
  return (
    <div>
    <Grid
      data={info}
      className="grid"
      style={{
        height: "400px",
      }}
    >
      <GridColumn field="code" title="Code"  />
      <GridColumn field="surname" title="Surname" />
      <GridColumn cell={CommandCell}  width="200px" />
    </Grid>
     {visible && (
      <Window title={"User"} onClose={closeDialog} initialHeight={350}>
        <form className="k-form">
          <fieldset>
            <legend>User Details</legend>

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
            <button
              type="button"
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
              onClick={save}
            >
              Submit
            </button>
          </div>
        </form>
      </Window>
      )}
    </div>
  );
};
export default Group;