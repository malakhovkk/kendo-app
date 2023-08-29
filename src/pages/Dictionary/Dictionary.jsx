import * as React from "react";
import * as ReactDOM from "react-dom";
import { useDeleteDictionaryMutation } from "../../features/apiSlice";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { useGetDictionaryQuery } from "../../features/apiSlice";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { Window } from "@progress/kendo-react-dialogs";
import { useEditDictionaryMutation } from "../../features/apiSlice";
import Select from "react-select";
const Dictionary = () => {
  const [deleteRecord] = useDeleteDictionaryMutation();
  const { data: dict } = useGetDictionaryQuery();
  const [selected, setSelected] = React.useState(1);
  const [options, setOptions] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [country, setCountry] = React.useState("");
  const [editDictionary] = useEditDictionaryMutation();
  React.useEffect(() => {
    if (dict === undefined) return;
    setOptions(
      dict
        ?.filter((record) => record.dictId == 1)
        .map((el) => ({ value: el.id, label: el.name }))
    );
    console.log(dict);
  }, [dict]);
  const handleSelect = (e) => {
    if (!visible) setSelected(e.selected);
  };
  const onSelectCountry = (select) => {
    setCountry(select.value);
  };
  const dictMap = {
    1: "страна",
    2: "регион",
    3: "класс",
    4: "производитель",
    5: "цвет",
    6: "тип",
  };
  let dictArr = [];
  for (let rec in dictMap) {
    dictArr.push(dictMap[rec]);
  }
  const getDictById = (id) => {
    return dict?.filter((record) => record.dictId === id);
  };
  const openDialog = (id) => {
    setFormData(dict?.find((record) => record.id === id));
    setVisible(true);
  };
  const deleteDict = (id, dictId) => {
    deleteRecord({ dictId, id, name: "", field: "" });
  };
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
          onClick={() => deleteDict(props.dataItem.id, props.dataItem.dictId)}
          src={require("../../assets/remove.png")}
          alt="Удалить"
        />
        {/* <Button themeColor="error" onClick={() => deleteUser(props.dataItem.id)}>Удалить</Button> */}
      </td>
    );
  };
  const closeDialog = () => {
    setVisible(false);
    setCountry("");
  };
  const save = (e) => {
    e.preventDefault();
    editDictionary({ ...formData, field: country });
    setVisible(false);
  };
  return (
    <TabStrip selected={selected} onSelect={handleSelect}>
      {dictArr.map((record, idx) => (
        <TabStripTab key={idx} title={record}>
          <div>
            <>
              <Grid
                data={getDictById(idx + 1)}
                className="grid"
                style={{
                  height: "400px",
                }}
              >
                <GridColumn field="name" title="Название" />
                <GridColumn cell={EditCell} width="50px" />
                <GridColumn cell={DeleteCell} width="50px" />
                {/* <GridColumn field="email" title="Email" />
                <GridColumn field="login" title="Login" /> */}
                {/* <GridColumn field="code" title="Code"  />
  <GridColumn field="surname" title="Surname" /> */}
                {/* <GridColumn cell={EditCell} width="50px" />
                <GridColumn cell={DeleteCell} width="50px" /> */}
              </Grid>
              {!!visible && (
                <Window
                  title={"User"}
                  onClose={closeDialog}
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
                        <span>Название</span>
                        <input
                          className="k-input"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Название"
                        />
                      </label>
                      {idx + 1 === 2 ? (
                        <>
                          Страна:
                          <Select
                            options={options}
                            onChange={onSelectCountry}
                            placeholder="Выбрать страну"
                          />
                        </>
                      ) : (
                        <></>
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

                      <button
                        type="button"
                        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                        onClick={(e) => save(e)}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </Window>
              )}
            </>
          </div>
        </TabStripTab>
      ))}
    </TabStrip>
  );
};
// return (
//   <>
//     <Grid
//       data={data}
//       className="grid"
//       style={{
//         height: "400px",
//       }}
//     >
//       <GridColumn field="name" title="Name" />
//       <GridColumn field="email" title="Email" />
//       <GridColumn field="login" title="Login" />
//       {/* <GridColumn field="code" title="Code"  />
//   <GridColumn field="surname" title="Surname" /> */}
//       <GridColumn cell={EditCell} width="50px" />
//       <GridColumn cell={DeleteCell} width="50px" />
//     </Grid>
//   </>
// );

export default Dictionary;
