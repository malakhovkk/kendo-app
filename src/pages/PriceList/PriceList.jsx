import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button } from "@progress/kendo-react-buttons";
import {
  useAddToStockMutation,
  useCreateOrderMutation,
  useDeleteRecordsMutation,
  useGetDictionaryByIdMutation,
  useGetDocumentMutation,
  useUploadMutation,
} from "../../features/apiSlice";
import axios from "axios";
import Select from "react-select";
import {
  useGetVendorsQuery,
  useGetProfilesQuery,
  useGetDictionaryQuery,
  useEditRecordMutation,
} from "../../features/apiSlice";
import "./PriceList.css";
import { codeSnippetIcon } from "@progress/kendo-svg-icons";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Window } from "@progress/kendo-react-dialogs";
import { Checkbox } from "@progress/kendo-react-inputs";
import { useLocation } from "react-router-dom";
import { Input } from "@progress/kendo-react-inputs";
import { process } from "@progress/kendo-data-query";
import { ColumnMenu } from "../../components/columnMenu";
import { Popup } from "@progress/kendo-react-popup";
import { Popover } from "@progress/kendo-react-tooltip";

const PriceList = (props) => {
  const abbreviations = {
    code: "Код",
    name: "Название",
    year: "Год",
    alcohol: "Процент алкоголя",
    value: "Объём",
    price: "Цена",
    quant: "Количество",
    structure: "Состав",
    rating: "Рейтинг",
    country: "Страна",
    region: "Регион",
    alcClass: "Класс алкоголя",
    manufacturer: "Производитель",
    color: "Цвет",
    barcode: "Штрих-код",
    type: "Тип",
  };
  const dictionaryAll = {
    1: "Страна",
    2: "Регион",
    3: "Класс",
    4: "Производитель",
    5: "Цвет",
    6: "Тип",
  };
  const fieldNameDictionary = {
    1: "country",
    2: "region",
    3: "alcClass",
    4: "manufacturer",
    5: "color",
    6: "type",
  };

  const [file, setFile] = React.useState();
  const [options, setOptions] = React.useState([]);
  const [optionsProfile, setOptionsProfile] = React.useState([]);
  const [vendor, setVendor] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [fileN, setFileN] = React.useState(null);
  const [showTable, setShowTable] = React.useState(false);
  const [id, setId] = React.useState();
  const [docId, setDocId] = React.useState();
  const [document, setDocument] = React.useState([]);
  const [upload] = useUploadMutation();
  const { data, error: err, isLoading, refetch } = useGetVendorsQuery();
  const { data: dataProfiles } = useGetProfilesQuery();
  const { data: dict } = useGetDictionaryQuery();
  const [mapDict, setMapDict] = React.useState({});
  const [table, setTable] = React.useState([]);
  const [getDocument] = useGetDocumentMutation();
  const [visible, setVisible] = React.useState(false);
  const [editRecord] = useEditRecordMutation();
  const [dictionary, setDictionary] = React.useState([]);
  const [filters, setFilters] = React.useState([]);
  const [filterValue, setFilterValue] = React.useState([]);
  const [checkedRow, setCheckedRow] = React.useState({});
  const [deleteRecords] = useDeleteRecordsMutation();
  const [year, setYear] = React.useState("");
  const [volume, setVolume] = React.useState("");
  const [percent, setPercent] = React.useState("");
  const [fields, setFields] = React.useState([]);
  const [metaId, setMetaId] = React.useState(null);
  const [getDictionaryById] = useGetDictionaryByIdMutation();
  const [_createOrder] = useCreateOrderMutation();
  const [quantOrderArr, setQuantOrderArr] = React.useState([]);
  const allFields = [
    "code",
    "name",
    "year",
    "alcohol",
    "value",
    "price",
    "quant",
    "structure",
    "rating",
    "barcode",
    "country",
    "region",
    "alcClass",
    "manufacturer",
    "color",
    "type",
  ];

  const match = {
    country: 0,
    region: 1,
    alcClass: 2,
    manufacturer: 3,
    color: 4,
    type: 5,
  };

  const conf = [
    {
      disabled: true,
    },
    {
      type: "string",
      disabled: false,
    },
    {
      type: "int",
      disabled: false,
    },
    {
      type: "double",
      disabled: false,
    },
    {
      type: "double",
      disabled: false,
    },
    {
      type: "double",
      disabled: false,
    },
    {
      type: "int",
      disabled: false,
    },
    {
      type: "string",
      disabled: false,
    },
    {
      type: "string",
      disabled: false,
    },
    {
      type: "string",
      disabled: false,
    },
    {
      type: "string",
      disabled: false,
      select: "country",
    },
    {
      type: "string",
      disabled: false,
      select: "region",
    },
    {
      type: "string",
      disabled: false,
      select: "alcClass",
    },
    {
      type: "string",
      disabled: false,
      select: "manufacturer",
    },
    {
      type: "string",
      disabled: false,
      select: "color",
    },
    {
      type: "string",
      disabled: false,
      select: "type",
    },
  ];
  const emptyObject = () => {
    let res = {};
    for (let field of allFields) {
      res[field] = "";
    }
    return res;
  };
  const [formData, setFormData] = React.useState(emptyObject());
  const [addToStock] = useAddToStockMutation();
  const { state } = useLocation();

  React.useEffect(() => {
    if (!state) return;
    const { profileId, vendorId, docId: doc_id, fileName } = state;
    setProfile(profileId);
    setVendor(vendorId);
    setDocId(doc_id);
    setFileN(fileName);
    console.log(profileId, vendorId);
  }, [state]);
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };
  const onSelectVendor = (select) => {
    //console.log(select.value);
    setVendor(select.value);
  };
  const onSelectProfile = (select) => {
    //console.log(select.value);
    setProfile(select.value);
  };
  //console.log(table);
  React.useEffect(() => {
    //console.log(data);
    setOptions(data?.map((el) => ({ value: el.id, label: el.name })));
  }, [data]);

  React.useEffect(() => {
    //console.log(dataProfiles);
    setOptionsProfile(
      dataProfiles?.map((el) => ({ value: el.id, label: el.name }))
    );
  }, [dataProfiles]);

  React.useEffect(() => {
    if (docId === undefined) return;
    getDocument({ id: docId })
      .unwrap()
      .then((payload) => {
        setDocument(payload);
        //console.log(payload);
      })
      .catch((err) => console.log(err));
  }, [docId]);

  React.useEffect(() => {
    if (dict === undefined) return;
    let res = {};
    dict.forEach((el) => {
      res[el.id] = {
        name: el.name,
        field: el.field,
      };
    });
    //console.log(res);
    setMapDict(res);
  }, [dict]);
  React.useEffect(() => {
    if (table === undefined || dict === undefined) return;
    let res = [[], [], [], [], [], [], [], []];
    for (let i = 0; i < 6; i++) {
      res[i].push({
        id: "",
        name: "Не выбрана",
      });
    }
    for (const el of dict) {
      res[el.dictId - 1].push({
        id: el.id,
        name: el.name,
        field: el.field,
      });
    }
    let initialState = createDataState({
      take: 8,
      skip: 0,
    });
    setResult(initialState.result);
    setDataState(initialState.dataState);
    //console.log(res);
    setDictionary(res);
  }, [table]);
  React.useEffect(() => {
    if (mapDict === undefined || !document === undefined || !document.length)
      return;
    let res = [];
    console.log(mapDict === undefined || document === undefined);
    console.log(document);
    console.log(mapDict);
    try {
      // console.log([
      //   "name",
      //   "code",
      //   // ...document[0].values.map((row) => row.key),
      //   ...Object.keys(document[0].jsonValues),
      // ]);

      // setFields([
      //   "name",
      //   "code",
      //   "price",
      //   "quant",
      //   "keyCount",
      //   ...Object.keys(document[0].jsonValues),
      //   "priceDelta",
      //   "quantDelta",
      // ]);

      setFields(["name", "sku", "price", "quant"]);
      document.forEach((_el, idx) => {
        console.log(_el);
        let el = {
          // name: _el.name,
          // code: _el.code,
          // price: _el.price,
          // quant: _el.quant,
          // id: _el.id,
          // doc_id: _el.doc_id,
          // keyCount: _el.keyCount,
          priceDelta: _el.statistics.price,
          quantDelta: _el.statistics.quant,
          name: _el.name,
          sku: _el.sku,
          price: _el.price,
          quant: _el.quant,
          id: _el.id,
        };
        for (let row in _el.meta) {
          el[row] = _el.meta[row];
        }
        // console.log(mapDict[el.country]);
        // console.log(el.country, idx, mapDict[el.country2]);
        //if (el.country && !mapDict[el.country]) el.country = "UNDEFINED";
        //else
        // el.country = el.country ? mapDict[el.country].name : "";

        // el.region = el.region ? mapDict[el.region].name : "";
        // el.alcClass = el.alcClass ? mapDict[el.alcClass].name : "";
        // el.manufacturer = el.manufacturer ? mapDict[el.manufacturer].name : "";
        // el.color = el.color ? mapDict[el.color].name : "";
        // el.type = el.type ? mapDict[el.type].name : "";
        //console.log(el);
        res.push(el);
        //console.log(el.alcClass);
      });
      console.error(res);
      setTable(res);
    } catch (err) {
      console.log(err);
      setTable([]);
      alert("Произошла ошибка");
    }
    //console.log("BBB");

    //console.log(res);
    //console.log(abbreviations);
  }, [mapDict, document]);
  React.useEffect(() => {
    if (dictionary === undefined) return;
    let f = [];
    // alert(20);
    dictionary.forEach((record) => {
      f.push(record.map((el) => ({ value: el.id, label: el.name })));
    });
    //console.log(dictionary);
    //f.push()
    console.warn(f);
    // alert(1);
    setFilters(f);
  }, [dictionary]);
  const EditCell = (props) => {
    console.log(props);
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

  const CheckCell = (props) => {
    return (
      <td>
        <Checkbox
          checked={checkedRow[props.dataItem.id]}
          onClick={(e) => checked(e, props.dataItem.id)}
        />
      </td>
    );
  };

  const checked = (e, id) => {
    //console.log(e, id);
    console.log("0", checkedRow);
    const res = { ...checkedRow };
    res[id] = e.target.checked;
    console.log("START", res);
    //console.log(res);
    if (!res[id]) delete res[id];
    console.log("END", res);
    setCheckedRow(res);
  };

  const openDialog = (id) => {
    //console.log("Active");
    setVisible(1);
    // setFormData(emptyObject);
    setId(id);
    //setDocId(getDocIdById(id));
    setFormData(getById(id));
    console.log(document.find((el) => el.id === id).values);
    console.log({
      ...document
        .find((el) => el.id === id)
        .values.reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {}),
      name: document.find((el) => el.id === id).name,
      code: document.find((el) => el.id === id).code,
    });
    let rec = document.find((el) => el.id === id);
    setEditValue({
      ...rec.values.reduce(
        (acc, cur) => ({ ...acc, [cur.key]: cur.value }),
        {}
      ),
      name: rec.name,
      code: rec.code,
      id: rec.id,
      doc_id: rec.doc_id,
    });
  };

  const getById = (id) => {
    const element = table.find((el) => el.id === id);
    return element;
  };

  const getDocIdById = (id) => {
    const element = table.find((el) => el.id === id);
    return element.doc_id;
  };

  const save = (e) => {
    console.log(file);
    setFileN(file.name);
    const url = "http://192.168.20.30:55555/api/file";
    const formData = new FormData();
    formData.append("Document", file);
    formData.append("ProfileId", profile);
    formData.append("UserLogin", localStorage.getItem("login"));
    formData.append("VendorId", vendor);
    // formData.append('fileName', file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        User: `${localStorage.getItem("login")}`,
      },
    };
    // {
    //     Document: formData,
    //     Description:'',
    //     UserLogin: localStorage.getItem('login'),
    //     VendorId: 'Поставщик 1'
    // }
    axios
      .post(url, formData, config)
      .then((response) => {
        //console.log(response.data);
        setShowTable(true);
        const doc_id = response.data.result;
        //setId("0bc3bc0c-7233-4fea-a647-11956fccb5cf");
        //setDocId("0bc3bc0c-7233-4fea-a647-11956fccb5cf");
        setDocId(doc_id);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message === "Records not found")
          alert("Профиль не соотвествует файлу");
      });
    //     upload({
    //     Document: file,
    //     Description:'',
    //     UserLogin: localStorage.getItem('login'),
    //     VendorId: 'Поставщик 1'
    // })
  };
  const closeDialog = () => {
    setVisible(0);
    setId(undefined);
    setFormData(emptyObject);
  };
  const modifyToSend = (obj) => {
    let res = [];
    for (let key in obj) {
      if (
        key !== "name" &&
        key !== "id" &&
        key !== "code" &&
        key !== "code" &&
        key !== "doc_id"
      ) {
        res.push({ key, value: obj[key] });
      }
    }
    return res;
  };
  const edit = () => {
    console.log(editValue);
    let body = {
      name: editValue.name,
      id: editValue.id,
      doc_id: editValue.doc_id,
      code: editValue.code,
      values: modifyToSend(editValue),
    };
    // if (
    //   isNaN(editValue.alcohol) ||
    //   isNaN(editValue.value) ||
    //   isNaN(editValue.price) ||
    //   Number.parseInt(editValue.quant) != editValue.quant ||
    //   Number.parseInt(editValue.year) != editValue.year
    // )
    //   alert("Необходимо ввести валидное число");
    // else
    editRecord([body])
      .unwrap()
      .then(() =>
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            setDocument(payload);
            //console.log(payload);
            //console.log(2);
          })
          .catch((err) => console.log(err))
      )
      .catch((err) => console.log);
  };
  const onSelectFilter = (e, idx) => {
    let res = [...filterValue];
    res[idx] = e.value;
    //console.log(fieldNameDictionary[idx + 1], e.value);
    setFilterValue(res);
  };
  const applyChanges = (idx) => {
    //console.log(idx);
    let res = JSON.parse(JSON.stringify(document));
    //console.log(res);
    //console.log(checkedRow);
    const fieldName = fieldNameDictionary[idx + 1];
    let request = [];
    res = res.forEach((row) => {
      //console.log(row);
      if (checkedRow[row.id]) {
        //console.log(row);
        row[fieldName] = filterValue[idx];
        console.warn(idx, filterValue[idx]);
        request.push(row);
      }
    });
    let num = 0;
    console.warn(res);
    // res.forEach((row, idx) => {
    // editRecord(row)
    editRecord(request)
      .unwrap()
      .then((_) => {
        //num++;
        //if (num === res.length)
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            console.log("1");
            setDocument(payload);
            //console.log(payload);
            //console.log(2);
          })
          .catch((err) => console.log(err));

        console.log(1, idx);
      })
      .catch((err) => {
        console.log(err);
      });
    // });

    // getDocument({ id: docId })
    //   .unwrap()
    //   .then((payload) => {
    //     setDocument(payload);
    //     console.log(payload);
    //     console.log(2);
    //   })
    //   .catch((err) => console.log(err));

    //console.log(res);
    //console.log(filterValue);
    //console.log(checkedRow);
  };

  const deleteRows = () => {
    let res = JSON.parse(JSON.stringify(document));
    //console.log(res);
    //console.log(checkedRow);
    // const fieldName = fieldNameDictionary[idx + 1];
    let request = [];
    res = res.forEach((row) => {
      //console.log(row);
      if (checkedRow[row.id]) {
        //console.log(row);
        // row[fieldName] = filterValue[idx];
        // console.warn(idx, filterValue[idx]);
        request.push(row);
      }
    });
    deleteRecords(request)
      .unwrap()
      .then((_) => {
        //num++;
        //if (num === res.length)
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            setDocument(payload);
            //console.log(payload);
            //console.log(2);
          })
          .catch((err) => console.log(err));
      });
  };
  const getVendorById = (id) => {
    if (!vendor || !options) return "Не выбрано";
    let res = options.find((option) => option.value === id)?.label;
    return res ?? "Не выбрано";
  };
  const getProfileById = (id) => {
    if (!profile || !optionsProfile) return "Не выбрано";
    let res = optionsProfile.find((option) => option.value === id)?.label;
    return res ?? "Не выбрано";
  };
  const [editValue, setEditValue] = React.useState({});
  const getFieldByConf = (conf, idx) => {
    if (conf.select) {
      //console.log(mapDict);
      return (
        <>
          <Select
            options={filters[match[conf.select]]}
            onChange={(e) => {
              console.log(e.value);
              // onSelectFilter(e, idx);
              setEditValue({ ...editValue, [allFields[idx]]: e.value });
            }}
            placeholder={dictionaryAll[idx - 9]}
          />
          {mapDict[editValue[allFields[idx]]]?.name}
        </>
      );
    }
    if (conf.disabled) {
      return (
        <input
          disabled={true}
          className="k-input"
          value={editValue[fields[idx]]}
          placeholder={[idx]}
        />
      );
    }
    return (
      <input
        className="k-input"
        value={editValue[fields[idx]]}
        onChange={(e) =>
          setEditValue({ ...editValue, [fields[idx]]: e.target.value })
        }
        placeholder={fields[idx]}
      />
    );
  };
  const changeYear = () => {
    let res = JSON.parse(JSON.stringify(document));
    //console.log(res);
    //console.log(checkedRow);
    let request = [];
    // console.error(isNaN(year));
    // console.error(Number.parseInt(year) == year);
    if (Number.parseInt(year) != year) {
      alert("Введите целое число");
      return;
    }
    res.forEach((row) => {
      //console.log(row);
      if (checkedRow[row.id]) {
        //console.log(row);
        row.year = year;
        request.push(row);
      }
    });
    let num = 0;

    // res.forEach((row, idx) => {
    // editRecord(row)
    editRecord(request)
      .unwrap()
      .then((_) => {
        //num++;
        //if (num === res.length)
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            setDocument(payload);
            //console.log(payload);
            //console.log(2);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changePercent = () => {
    let res = JSON.parse(JSON.stringify(document));
    //console.log(res);
    //console.log(checkedRow);
    let request = [];
    // console.error(isNaN(year));
    // console.error(Number.parseInt(year) == year);
    if (isNaN(percent)) {
      alert("Введите число");
      return;
    }
    res.forEach((row) => {
      //console.log(row);
      if (checkedRow[row.id]) {
        //console.log(row);
        row.alcohol = percent;
        request.push(row);
      }
    });
    let num = 0;

    // res.forEach((row, idx) => {
    // editRecord(row)
    editRecord(request)
      .unwrap()
      .then((_) => {
        //num++;
        //if (num === res.length)
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            setDocument(payload);
            //console.log(payload);
            //console.log(2);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeVolume = () => {
    let res = JSON.parse(JSON.stringify(document));
    //console.log(res);
    //console.log(checkedRow);
    let request = [];
    // console.error(isNaN(year));
    // console.error(Number.parseInt(year) == year);
    if (isNaN(percent)) {
      alert("Введите число");
      return;
    }
    res.forEach((row) => {
      //console.log(row);
      if (checkedRow[row.id]) {
        //console.log(row);
        row.value = volume;
        request.push(row);
      }
    });
    let num = 0;

    // res.forEach((row, idx) => {
    // editRecord(row)
    editRecord(request)
      .unwrap()
      .then((_) => {
        //num++;
        //if (num === res.length)
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            setDocument(payload);
            //console.log(payload);
            //console.log(2);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dataStateChange = (event) => {
    console.error(event.dataState);
    let updatedState = createDataState(event.dataState);
    setResult(updatedState.result);
    console.warn(updatedState.result);
    setDataState(updatedState.dataState);
  };
  const createDataState = (dataState) => {
    return {
      result: process(table.slice(0), dataState),
      dataState: dataState,
    };
  };
  // let initialState = createDataState({
  //   take: 8,
  //   skip: 0,
  // });
  const [result, setResult] = React.useState();
  const [dataState, setDataState] = React.useState();
  const [withChanges, setWithChanges] = React.useState(false);
  const rowRender = (trElement, props) => {
    const available = props.dataItem.keyCount;
    // if (available === undefined) return;
    const green = {};
    const red = {
      backgroundColor: "rgb(243, 23, 0, 0.32)",
    };
    // alert(available);
    const trProps = {
      style: available <= 1 || available === undefined ? green : red,
    };
    return React.cloneElement(
      trElement,
      {
        ...trProps,
      },
      trElement.props.children
    );
  };

  const CustomCell = (props) => {
    return (
      <td
        {...props.tdProps}
        colSpan={1}
        style={{
          color: props.color,
        }}
      >
        {props.children}
      </td>
    );
  };

  const ArrowPriceCell = (props) => {
    console.log(props.dataItem.priceDelta);
    return (
      <td>
        {props.dataItem.priceDelta != 0 && props.dataItem.priceDelta ? (
          <img
            // onClick={() => openDialog(props.dataItem.id)}
            style={{ width: "20px" }}
            src={
              props.dataItem.priceDelta > 0
                ? require("../../assets/arrows/arrow-up.png")
                : require("../../assets/arrows/arrow-down.png")
            }
            alt="Дельта цены"
          />
        ) : (
          <></>
        )}
        {props.dataItem.priceDelta}
        {/* <Button onClick={() => openDialog(props.dataItem.id)}>Изменить</Button> */}
      </td>
    );
  };

  const ArrowQuantCell = (props) => {
    console.log(props.dataItem.quantDelta);
    return (
      <td>
        {props.dataItem.quantDelta != 0 &&
        props.dataItem.quantDelta !== undefined ? (
          <img
            // onClick={() => openDialog(props.dataItem.id)}
            style={{ width: "20px" }}
            src={
              props.dataItem.quantDelta > 0
                ? require("../../assets/arrows/arrow-up.png")
                : require("../../assets/arrows/arrow-down.png")
            }
            alt="Дельта количества"
          />
        ) : (
          <></>
        )}
        {props.dataItem.quantDelta}
        {/* <Button onClick={() => openDialog(props.dataItem.id)}>Изменить</Button> */}
      </td>
    );
  };

  const setOrderArr = (id, value) => {
    setQuantOrderArr([
      ...quantOrderArr.filter((order) => order.priceRecordId !== id),
      {
        // ...quantOrderArr.find((order) => order.priceRecordId === id),
        id: "",
        priceRecordId: id,
        quant: value,
      },
    ]);
  };
  React.useEffect(() => {
    console.log(quantOrderArr);
  }, [quantOrderArr]);

  const OrderCell = (props) => {
    console.log(
      quantOrderArr.find((item) => item.priceRecordId === props.dataItem.id)
        ?.quant
    );
    return (
      <td>
        <Input
          type="text"
          value={
            quantOrderArr.find(
              (item) => item.priceRecordId === props.dataItem.id
            )?.quant ?? 0
          }
          onChange={(e) => setOrderArr(props.dataItem.id, e.target.value)}
        />
      </td>
    );
  };

  React.useEffect(() => {
    console.log(fields);
  }, [fields]);

  const showMeta = (id) => {
    if (metaId !== id) setMetaId(id);
    else setMetaId(null);
  };

  const MetaCell = (props) => {
    //console.log(props)
    console.log(props);
    const row = document && document.find((row) => row.id === metaId)?.meta;
    console.log(row);
    return (
      <td style={{ overflow: "visible" }}>
        {/* <img
          onClick={() => showMeta(props.dataItem.id)}
          src={require("../../assets/edit.png")}
          alt="Изменить"
        /> */}
        <Button
          style={{ position: "relative" }}
          onClick={() => showMeta(props.dataItem.id)}
        >
          Доп. информация
        </Button>
        {metaId === props.dataItem.id && (
          <div
            style={{
              position: "absolute",
              zIndex: "1000",
              padding: "10px 20px",
              backgroundColor: "white",
              marginTop: "20px",
            }}
            className="popover"
          >
            {row &&
              Object.keys(row).map((k) => (
                <div>
                  {k}: {row[k]}{" "}
                </div>
              ))}
          </div>
        )}
      </td>
    );
  };
  // const formatOptions = {
  //   style: "currency",
  //   currency: "RUB",
  //   currencyDisplay: "name",
  // };
  const smartTable = React.useMemo(() => {
    return (
      <Grid
        // data={(function () {
        //   console.log(table);
        //   return table;
        // })()}
        className="grid"
        rowRender={rowRender}
        style={{
          height: "700px",
          marginLeft: "0",
          width: `${(fields.length + 4) * 150}px`,
        }}
        data={result}
        {...dataState}
        onDataStateChange={dataStateChange}
        sortable={true}
        pageable={true}
        pageSize={8}
        // sortable={true}
        // filterable={true}
        // groupable={true}
        // reorderable={true}
        // pageSize={8}
        // {...dataState}
        // onDataStateChange={dataStateChange}
      >
        {/* <GridColumn cell={CheckCell} width="50px" /> */}
        {/*         
          // [
          //   "code",
          //   "name",
          //   "year",
          //   "alcohol",
          //   "value",
          //   "price",
          //   "quant",
          //   "structure",
          //   "rating",
          //   "barcode",
          // ] */}
        {/* <GridColumn field="abv" title="abv" width="100px" />
        <GridColumn field="code" title="code" width="100px" />
        <GridColumn field="country" title="country" width="100px" />
        <GridColumn field="grape" title="grape" width="100px" />
        <GridColumn field="name" title="name" width="100px" />
        <GridColumn field="price" title="price" width="100px" />
        <GridColumn field="quant" title="quant" width="100px" />
        <GridColumn field="rating" title="rating" width="100px" />
        <GridColumn field="volume" title="volume" width="100px" /> */}
        {console.log(fields)}
        {fields?.map((field, idx) => {
          console.log(field);
          if (field === "quantDelta" || field === "priceDelta") return;
          return (
            <GridColumn
              columnMenu={ColumnMenu}
              // key={field}
              field={field}
              width="150px"
              title={field}
            />
          );
        })}
        <GridColumn cell={ArrowPriceCell} field="priceDelta" width="150px" />
        <GridColumn cell={ArrowQuantCell} field="quantDelta" width="150px" />
        <GridColumn cell={MetaCell} width="150px" />
        <GridColumn cell={OrderCell} width="150px" title="Order" />
        {/* <GridColumn
          field="priceDelta"
          cells={{
            data: ArrowCell,
          }}
          title="priceDelta"
          width="150px"
        />
        <GridColumn
          field="quantDelta"
          cells={{
            data: ArrowCell,
          }}
          title="quantDelta"
          width="150px"
        /> */}
        {/* {["country", "region", "alcClass", "manufacturer", "color", "type"].map(
          (field, idx) => {
            return (
              <GridColumn
                key={idx}
                field={field}
                title={abbreviations[field]}
              />
            );
          }
        )} */}
        {/* <GridColumn cell={EditCell} width="50px" /> */}

        {/* <GridColumn field="name" title="Name"  />
            <GridColumn field="code" title="Code"  />
            <GridColumn field="login" title="Login"  /> */}
        {/* <GridColumn field="code" title="Code"  />
            <GridColumn field="surname" title="Surname" /> */}
        {/* <GridColumn cell={EditCell}  width="50px" />
            <GridColumn cell={DeleteCell}  width="50px" /> */}
      </Grid>
    );
  }, [
    table,
    checkedRow,
    fields,
    result,
    dataState,
    withChanges,
    metaId,
    quantOrderArr,
  ]);

  const showPriceList = () => {
    getDocument({ id: vendor })
      .unwrap()
      .then((payload) => {
        setDocument(payload);
        getDictionaryById({ id: 7 })
          .unwrap()
          .then((payload) => {})
          .catch((err) => console.error(err));
        //console.log(payload);
      })
      .catch((err) => console.log(err));
  };

  const createOrder = () => {
    _createOrder(vendor);
  };

  return (
    <div
      style={{
        width: "500px",
        minHeight: "500px",
        marginTop: "20px",
        marginLeft: "20px",
      }}
    >
      Поставщик:
      <Select
        options={options}
        onChange={onSelectVendor}
        placeholder="Выбрать поставщика"
      />
      <div>Выбрано: {getVendorById(vendor)}</div>
      <Button onClick={showPriceList}>Показать прайс-лист</Button>
      <Button onClick={createOrder}>Создать заказ</Button>
      {/* Профиль:
      <Select
        options={optionsProfile}
        onChange={onSelectProfile}
        placeholder="Выбрать профиль"
      />
      <div>Выбрано: {getProfileById(profile)}</div>
      <input type="file" onChange={handleFileChange} />
      <Button onClick={save}>Загрузить</Button>
      <div>Выбрано: {fileN}</div> */}
      <br />
      {/* Фильтры:
      <br />
      {filters.map((filter, idx) => (
        <div key={idx}>
          {dictionaryAll[idx + 1]}
          <Select
            options={filter}
            onChange={(e) => {
              onSelectFilter(e, idx);
            }}
            placeholder={dictionaryAll[idx + 1]}
          />
          <Button
            onClick={() => {
              applyChanges(idx);
            }}
          >
            Применить
          </Button>
        </div>
      ))} */}
      {/* <div>
        <div>Год</div>
        <Input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <Button
          onClick={() => {
            changeYear();
          }}
        >
          Применить
        </Button>
      </div>
      <div>
        <div>Процент</div>
        <Input
          type="text"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
        />
        <Button
          onClick={() => {
            changePercent();
          }}
        >
          Применить
        </Button>
      </div>
      <div>
        <div>Объём</div>
        <Input
          type="text"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        />
        <Button
          onClick={() => {
            changeVolume();
          }}
        >
          Применить
        </Button>
      </div>
      <Button onClick={deleteRows} style={{ marginTop: "20px" }}>
        Удалить выделенные записи
      </Button> */}
      {smartTable}
      {!withChanges ? (
        <Button
          style={{
            marginTop: "10px",
          }}
          onClick={() => {
            setWithChanges(true);
            // setResult(updatedState.result);
            // // console.warn(updatedState.result);
            // setDataState(updatedState.dataState);

            const state = {
              result: process(
                table.filter(
                  (row) => row.quantDelta !== 0 || row.priceDelta !== 0
                ),
                { ...dataState, skip: 0 }
              ),
              dataState: { ...dataState, skip: 0 },
            };
            setResult(state.result);
            setDataState(state.dataState);
            // addToStock("174fdd5b-74ad-3340-b230-836b3e4cdf12");
          }}
        >
          Показать изменения
        </Button>
      ) : (
        <Button
          style={{
            marginTop: "10px",
          }}
          onClick={() => {
            setWithChanges(false);

            const state = {
              result: process(table.slice(0), dataState),
              dataState: dataState,
            };
            setResult(state.result);
            setDataState(state.dataState);
            // addToStock("174fdd5b-74ad-3340-b230-836b3e4cdf12");
          }}
        >
          Показать всю таблицу
        </Button>
      )}
      {!!visible && (
        <Window
          title={"Document record"}
          onClose={closeDialog}
          initialHeight={350}
        >
          <form className="k-form">
            <fieldset>
              {visible === 1 ? (
                <legend>Document Details</legend>
              ) : (
                <legend>Add User</legend>
              )}
              {fields?.map((field, idx) => {
                console.log(editValue);
                return (
                  <label key={idx} className="k-form-field">
                    <span>{field}</span>
                    {/* {getFieldByConf(conf[idx], idx)} */}
                    <input
                      className="k-input"
                      value={editValue[field]}
                      onChange={(e) =>
                        setEditValue({
                          ...editValue,
                          [field]: e.target.value,
                        })
                      }
                      placeholder={field}
                    />
                  </label>
                );
              })}
              {/* <label className="k-form-field">
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
                  placeholder="Email"
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
              </label> */}
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
                  onClick={edit}
                >
                  Submit
                </button>
              ) : (
                <button
                  type="button"
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                  //   onClick={add}
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

export default PriceList;
