import * as React from "react";
import * as ReactDOM from "react-dom";
import { Window } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import {
  useAddProfileMutation,
  useGetProfilesQuery,
} from "../../features/apiSlice";
import "./Profile.css";
import Select from "react-select";
import { useGetDictionaryQuery } from "../../features/apiSlice";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Input } from "@progress/kendo-react-inputs";
const abbreviations = {
  colCode: "Код",
  colName: "Название",
  colYear: "Год",
  colAlcohol: "Процент алкоголя",
  colValue: "Объём",
  colPrice: "Цена",
  colQuant: "Количество",
  colStructure: "Состав",
  colRating: "Рейтинг",
  colCountry: "Страна",
  colRegion: "Регион",
  colAlcClass: "Класс алкоголя",
  colManufacturer: "Производитель",
  colColor: "Цвет",
  colBarcode: "Штрих-код",
};

const Profile = () => {
  const [visible, setVisible] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");
  const { data: dict } = useGetDictionaryQuery();
  const emptyData = {
    // colCode: "0",
    // colName: "0",
    // colYear: "0",
    // colAlcohol: "0",
    // colValue: "0",
    // colPrice: "0",
    // colQuant: "0",
    // colStructure: "0",
    // colRating: "0",
    // colCountry: "0",
    // colRegion: "0",
    // colAlcClass: "0",
    // colManufacturer: "0",
    // colColor: "0",
    // colBarcode: "0",
    // name: "",
  };
  const [formData, setFormData] = React.useState(emptyData);
  const [_addProfile] = useAddProfileMutation();
  const { data } = useGetProfilesQuery();
  const [options, setOptions] = React.useState([]);
  const [profile, setProfile] = React.useState({});
  const [fields, setFields] = React.useState([]);
  const [optionsFields, setOptionsFields] = React.useState([]);
  const [selectedFields, setSelectedFields] = React.useState([]);
  const [selectedColNum, setSelectedColNum] = React.useState([]);
  const [colNum, setColNum] = React.useState("");
  const [field, setField] = React.useState("");
  const [name, setName] = React.useState();
  const [editField, setEditField] = React.useState("");
  const [editColNum, setEditColNum] = React.useState("");
  const [editName, setEditName] = React.useState("");
  const [table, setTable] = React.useState([]);
  const [profileName, setProfileName] = React.useState("");
  const [optionsColNum, setOptionsColNum] = React.useState(
    (() => {
      let res = [];
      for (let i = 1; i <= 50; i++) {
        res.push({ value: i, label: i });
      }
      return res;
    })()
  );
  // console.log(optionsColNum);
  React.useEffect(() => {
    console.error(dict);
    if (dict === undefined) return;
    setFields(
      dict
        .filter((el) => el.dictId === 7)
        .map((row) => ({ field: row.field, name: row.name }))
    );
  }, [dict]);
  React.useEffect(() => {
    setOptionsFields(
      fields.map((field) => ({ value: field.field, label: field.name }))
    );
  }, [fields]);
  React.useEffect(() => {
    if (data === undefined) return;
    console.log(data);
    setOptions(data?.map((el) => ({ value: el.id, label: el.name })));
    // setProfileFields(data.map((el) => ({id: el.id, columns})))
  }, [data]);
  const closeDialog = () => {
    setVisible(false);
    // setId(null);
    // setFormData(emptyData);
  };
  const add = () => {
    console.log(formData);
    if (formData.name) _addProfile({ ...formData, id: "" });
  };
  const save = () => {
    if (colNum === "" || field === "") return;
    setTable([
      ...table,
      {
        field,
        name,
        colNum,
      },
    ]);
    setSelectedColNum([...selectedColNum, colNum]);
    setSelectedFields([...selectedFields, field]);
    // setOptionsFields(optionsFields.filter((f) => f.value !== field));
    // setOptionsColNum(optionsColNum.filter((col) => col.value !== colNum));
    setField("");
    setColNum("");
  };
  const addProfile = () => {
    setShow(true);
  };
  // const optionsColNum = (() => {
  //   let res = [];
  //   for (let i = 1; i <= 50; i++) {
  //     res.push({ value: i, label: i });
  //   }
  //   return res;
  // })();
  const numbers = () => {
    const res = [];
    for (let i = 0; i < 51; i++) {
      res.push(i);
    }
    return res;
  };
  const close = () => {
    setShow(false);
  };
  const onSelectProfile = (select) => {
    console.log(select.value);
    console.log();
    setSelectedId(select.value);
    setProfile(data.find((el) => el.id === select.value).columns);
  };
  const deleteField = ({ field, colNum, name }) => {
    setTable(
      table.filter(
        (row) =>
          !(row.field === field && row.colNum === colNum && row.name === name)
      )
    );
    setSelectedColNum(selectedColNum.filter((col) => col !== colNum));
    setSelectedFields(selectedFields.filter((_field) => field !== _field));
  };
  const openDialog = ({ field, colNum, name }) => {
    setVisible(true);
    console.log(field, colNum, name);
    setEditField(field);
    setEditColNum(colNum);
    setEditName(name);
  };
  const EditCell = (props) => {
    //console.log(props)
    return (
      <td>
        <img
          onClick={() =>
            openDialog({
              field: props.dataItem.field,
              colNum: props.dataItem.colNum,
              name: props.dataItem.name,
            })
          }
          src={require("../../assets/edit.png")}
          alt="Изменить"
        />
        {/* <Button onClick={() => openDialog(props.dataItem.id)}>Изменить</Button> */}
      </td>
    );
  };
  const saveChanges = () => {
    _addProfile({
      id: "",
      name: profileName,
      columns: table.map((row) => ({
        code: row.field,
        name: row.name,
        position: row.colNum,
      })),
    });
  };
  const DeleteCell = (props) => {
    //console.log(props)
    return (
      <td>
        <img
          onClick={() =>
            deleteField({
              field: props.dataItem.field,
              colNum: props.dataItem.colNum,
              name: props.dataItem.name,
            })
          }
          src={require("../../assets/remove.png")}
          alt="Удалить"
        />
        {/* <Button themeColor="error" onClick={() => deleteUser(props.dataItem.id)}>Удалить</Button> */}
      </td>
    );
  };
  const saveEdit = () => {
    setTable(
      table.map((el) => {
        if (el.name === name && el.colNum === colNum && el.field === field) {
          el.name = editName;
          el.colNum = editColNum;
          el.field = editField;
        }
        return el;
      })
    );
    setVisible(false);
  };
  return (
    <div
      className="content"
      style={{
        width: "1000px",
        minHeight: "500px",
        marginTop: "80px",
        marginLeft: "20px",
      }}
    >
      {!show ? (
        <Button className="add" onClick={() => addProfile()}>
          Добавить
        </Button>
      ) : (
        <Button themeColor="error" onClick={() => close()}>
          Закрыть
        </Button>
      )}
      {!show && (
        <>
          <div
            style={{
              width: "300px",
            }}
          >
            <Select
              options={options}
              onChange={onSelectProfile}
              placeholder="Выбрать профиль"
            />
          </div>
          <div className="list">
            {selectedId &&
              profile?.map((el, idx) => (
                <div key={idx}>
                  <div className="name_field">{el.name}</div>
                  <div className="value">{el.position}</div>
                </div>
              ))}
          </div>
        </>
      )}
      {show && (
        <>
          {optionsFields && (
            <>
              <div
                style={{
                  marginTop: "15px",
                }}
              >
                Название профиля
              </div>
              <Input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                style={{
                  marginTop: "5px",
                  width: "200px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    marginTop: "30px",
                    width: "300px",
                  }}
                >
                  <Select
                    options={optionsFields.filter(
                      (el) => !selectedFields.includes(el.value)
                    )}
                    onChange={(e) => {
                      setField(e.value);
                      setName(e.label);
                      // onSelectFilter(e, idx);
                    }}
                    placeholder="Выбрать поле"
                  />
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    width: "300px",
                    marginLeft: "15px",
                  }}
                >
                  <Select
                    options={optionsColNum.filter(
                      (el) => !selectedColNum.includes(el.value)
                    )}
                    onChange={(e) => {
                      setColNum(e.value);
                      // onSelectFilter(e, idx);
                    }}
                    placeholder="Выбрать номер столбца"
                  />
                </div>
                <Button
                  style={{
                    marginTop: "5px",
                    marginLeft: "15px",
                  }}
                  onClick={save}
                >
                  Добавить
                </Button>
              </div>
              <Grid
                data={table}
                className="grid"
                style={{
                  height: "400px",
                  marginLeft: "0",
                }}
              >
                <GridColumn field="name" title="Название" />
                <GridColumn field="colNum" title="Номер столбца" />
                {/* <GridColumn field="code" title="Code"  />
      <GridColumn field="surname" title="Surname" /> */}
                <GridColumn cell={EditCell} width="50px" />
                <GridColumn cell={DeleteCell} width="50px" />
              </Grid>
              <Button onClick={saveChanges} style={{ marginTop: "15px" }}>
                Сохранить все изменения
              </Button>
            </>
          )}
        </>
      )}
      {!!visible && (
        <Window title={"Group"} onClose={closeDialog} initialHeight={350}>
          <form className="k-form">
            <fieldset>
              {visible === 1 ? (
                <legend>Поле</legend>
              ) : (
                <legend>Add Group</legend>
              )}
              <div
                style={{
                  marginTop: "30px",
                  width: "200px",
                }}
              >
                <Select
                  options={optionsFields.filter(
                    (el) =>
                      !selectedFields
                        .filter((_field) => _field !== field)
                        .includes(el.value)
                  )}
                  onChange={(e) => {
                    setEditField(e.value);
                    setEditName(e.label);
                  }}
                  placeholder="Выбрать поле"
                />
              </div>
              <div
                style={{
                  marginTop: "10px",
                  width: "200px",
                }}
              >
                <Select
                  options={optionsColNum.filter(
                    (el) =>
                      !selectedColNum
                        .filter((_colNum) => _colNum !== colNum)
                        .includes(el.value)
                  )}
                  onChange={(e) => {
                    setEditColNum(e.value);

                    // onSelectFilter(e, idx);
                  }}
                  placeholder="Выбрать номер столбца"
                />
              </div>

              {/* <label className="k-form-field">
              <span>Name</span>
              <input className="k-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Code" />
            </label> */}
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

              {visible === true ? (
                <button
                  type="button"
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                  onClick={saveEdit}
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
    </div>
  );
};
export default Profile;
