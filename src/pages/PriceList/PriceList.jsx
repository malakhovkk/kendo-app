import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button } from "@progress/kendo-react-buttons";
import {
  useAddToStockMutation,
  useCreateOrderMutation,
  useDeleteRecordOrderMutation,
  useDeleteRecordsMutation,
  useGetDictionaryByIdMutation,
  useGetDocumentMutation,
  useOrderCommentMutation,
  useSaveEditOrderMutation,
  useSaveOrderMutation,
  useUploadMutation,
} from "../../features/apiSlice";
import axios from "axios";
import Select from "react-select";
import {
  useGetVendorsQuery,
  useGetProfilesQuery,
  useGetDictionaryQuery,
  useEditRecordMutation,
  useGetOrderMutation,
} from "../../features/apiSlice";
import "./PriceList.css";
import { codeSnippetIcon } from "@progress/kendo-svg-icons";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Window } from "@progress/kendo-react-dialogs";
import { Checkbox } from "@progress/kendo-react-inputs";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@progress/kendo-react-inputs";
import { process } from "@progress/kendo-data-query";
import { ColumnMenu } from "../../components/columnMenu";
import { Popup } from "@progress/kendo-react-popup";
import { Popover } from "@progress/kendo-react-tooltip";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { default as NumInput } from "../../components/NumInput";
import { useSelector, useDispatch } from "react-redux";
import { freeze } from "../../features/settings.js";
import { load } from "@progress/kendo-react-intl";
import { TextArea } from "@progress/kendo-react-inputs";
import { sameCharsOnly } from "@progress/kendo-react-dropdowns/dist/npm/common/utils";

// const removeFromOrder = (priceRecordId) => {
//   // setOrderArr(priceRecordId, null, "deleted");
// };
const MyCell = function (props) {
  // console.log(props);
  console.log("MyCell");
  // return <NumInput itemChange={itemChange} {...props} />;
  return (
    <td style={{height: "150px"}} colSpan={props.colSpan}>
      <NumInput {...props} />{" "}
    </td>
  );
};
const PriceList = (props) => {
  React.useEffect(() => {
    console.log("PriceList");
  }, []);

  const DeleteCell = (props) => {
    console.log("DeleteCell");

    if (props.rowType === "groupHeader") {
      console.error(props);
      // alert(1);
      return null;
    }
    return (
      <td colSpan={props.colSpan} style={{ overflow: "visible" }}>
        <img
          onClick={() => removeFromOrder(props.dataItem.id)}
          src={require("../../assets/remove.png")}
          alt="Удалить"
        />
      </td>
    );
  };

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
  const [orderId, setOrderId] = React.useState();
  const [getOrder] = useGetOrderMutation();
  const [comment, setComment] = React.useState("");

  // setTimeout(() => setQuantOrderArr([]), 25000);

  // const [orderCommentReq] = useOrderCommentMutation();
  const dispatch = useDispatch();

  const DefaultCell = (props) => {
    const field = props.field || "";
    return <td style={{height: "150px"}} colSpan={props.colSpan}>{props.dataItem[field]}</td>;
  };

  const func_fields = (fields) => {
    if (!fields) return;
    console.time("FUNC_FIELDS");

    console.log("Render columns");
    let new_fields;
    let idx = fields.findIndex((el) => el === "quant");
    if (orderId)
      new_fields = [
        ...fields.slice(0, idx + 1),
        "orderQuant",
        ...fields.slice(idx + 1, fields.length),
      ];
    else new_fields = fields;
    console.error(new_fields);
    let cols = new_fields?.map((field, idx) => {
      console.log(field);
      if (field === "quantDelta" || field === "priceDelta") return;
      if (field === "orderQuant" && orderId) {
        return (
          <GridColumn
            cell={MyCell}
            field="orderQuant"
            title="Order"
            width={100}
            key={field}
          />
        );
      }

      return (
        <GridColumn
          // columnMenu={ColumnMenu}
          key={field}
          field={field}
          width={100}
          cell={DefaultCell}
          title={field}
        />
      );
    });
    //if (orderId) <GridColumn cell={DeleteCell} width="50px" />;
    console.timeEnd("FUNC_FIELDS");
    console.log(cols);
    return cols;
  };
  // const columns = React.useCallback(
  //   () => func_fields(fields),
  //   [fields, orderId]
  // );
  const columns = func_fields(fields);

  React.useEffect(() => {
    if (orderId) {
      dispatch(freeze(true));
      //alert(1);
    }
  }, [orderId]);

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
  const [loadingOrder, setLoadingOrder] = React.useState(0);

  // React.useEffect(() => {
  //   setLoadingOrder(true);
  // }, [quantOrderArr]);

  React.useEffect(() => {
    if (!state) return;

    let idVendor = state.idVendor;
    let idOrder = state.idOrder;
    setComment(state.comment);
    setVendor(idVendor);
    getDocument({ id: idVendor })
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

    getOrder(idOrder)
      .unwrap()
      .then((payload) => {
        console.log(payload);
        setOrderId(idOrder);

        let obj = {};
        payload.forEach((el) => {
          obj[el.priceRecordId] = el.quant;
        });
        if (!(payload?.length !== 0)) setLoadingOrder(3);
        setQuantOrderArr(
          payload.map((el) => ({
            id: el.id,
            priceRecordId: el.priceRecordId,
            quant: obj[el.priceRecordId],
            status: "toEdit",
          }))
        );
        console.error(
          table.map((row) => ({ ...row, orderQuant: obj[row.id] }))
        );
        // let obj = {};
        //loadingTable
        setTable(
          table.slice(0, 10).map((row) => ({ ...row, orderQuant: obj[row.id] }))
        );
      })
      .catch((err) => console.error(err));

    // const { profileId, vendorId, docId: doc_id, fileName } = state;
    // setProfile(profileId);
    // setVendor(vendorId);
    // setDocId(doc_id);
    // setFileN(fileName);
    // console.log(profileId, vendorId);
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
    let initialState = createDataState();
    // dataState || {
    //   take: 8,
    //   skip: 0,
    // }
    setResult(initialState.result);
    setDataState(initialState.dataState);
    //console.log(res);
    setDictionary(res);
    console.log(res);
  }, [table]);

  React.useEffect(() => {
    if (!document || document.length === 0) return;
    console.log(document);
    let meta = [];
    for (let k in document[0].meta) {
      if (!["name", "sku", "price", "quant"].includes(k)) meta.push(k);
    }
    setFields(["name", "sku", "price", "quant", ...meta]);
  }, [document]);

  React.useEffect(() => {
    // alert(loadingOrder);

    if (
      (mapDict === undefined || !document === undefined || !document.length) &&
      loadingOrder !== 3
    )
      return;
    if (!document?.length) return;
    let res = [];
    console.log(mapDict === undefined || document === undefined);

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

      // let meta = [];
      // for (let k in document[0].meta) {
      //   if (!["name", "sku", "price", "quant"].includes(k)) meta.push(k);
      // }
      // setFields(["name", "sku", "price", "quant", ...meta]);

      let obj = {};
      quantOrderArr.forEach((el) => {
        obj[el.priceRecordId] = el.quant;
      });

      document.forEach((_el, idx) => {
        // console.log(_el);
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
          orderQuant:
            quantOrderArr.length === 0 ? 0 : obj[_el.id] ? obj[_el.id] : 0,
          price:
            _el.statistics.price === 0
              ? _el.price
              : _el.statistics.price > 0
              ? `${_el.price} (+${_el.statistics.price})`
              : `${_el.price} (-${_el.statistics.price})`,
          quant:
            _el.statistics.quant === 0
              ? _el.quant
              : _el.statistics.quant > 0
              ? `${_el.quant} (+${_el.statistics.quant})`
              : `${_el.quant} (-${_el.statistics.quant})`,
          id: _el.id,
          // ..._el.meta,
          // orderQuant: 0,
          status: "new",
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

      setTable(res);
      setLoadingOrder(0);
    } catch (err) {
      console.log(err);
      setTable([]);
      // alert("Произошла ошибка");
    }
    //console.log("BBB");

    //console.log(res);
    //console.log(abbreviations);
  }, [mapDict, document, loadingOrder]);
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
      <td colSpan={props.colSpan}>
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
      <td colSpan={props.colSpan}>
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
  const navigate = useNavigate();
  const save = (e) => {
    console.log(file);
    setFileN(file.name);
    const url = "http://194.87.239.231:55555/api/file";

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
        if (err.response.status === 401) navigate("/");
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
            setDocument(payload);
          })
          .catch((err) => console.log(err));

        console.log(1, idx);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteRows = () => {
    let res = JSON.parse(JSON.stringify(document));

    let request = [];
    res = res.forEach((row) => {
      if (checkedRow[row.id]) {
        request.push(row);
      }
    });
    deleteRecords(request)
      .unwrap()
      .then((_) => {
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            setDocument(payload);
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

    let request = [];

    if (Number.parseInt(year) != year) {
      alert("Введите целое число");
      return;
    }
    res.forEach((row) => {
      //console.log(row);
      if (checkedRow[row.id]) {
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
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changePercent = () => {
    let res = JSON.parse(JSON.stringify(document));

    let request = [];

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
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeVolume = () => {
    let res = JSON.parse(JSON.stringify(document));

    let request = [];

    if (isNaN(percent)) {
      alert("Введите число");
      return;
    }
    res.forEach((row) => {
      if (checkedRow[row.id]) {
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
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dataStateChange = (event) => {
    let updatedState = createDataState(event.dataState);
    setResult(updatedState.result);

    setDataState(updatedState.dataState);
  };
  const createDataState = (dataState) => {
    return {
      // result: process(table.slice(0), dataState),
      result: table.slice(0),
      // dataState: dataState,
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
    // const trProps = {
    //   style: available <= 1 || available === undefined ? green : red,
    // };
    const trProps = {
      style:
        quantOrderArr.find((item) => item.priceRecordId === props.dataItem.id)
          ?.status !== "deleted"
          ? green
          : red,
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
    //console.log(props.dataItem.priceDelta);
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
    //console.log(props.dataItem.quantDelta);
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

  const setOrderArr = (priceRecordId, value, status, id) => {
    console.log(id, value);
    if (value !== 0)
      setQuantOrderArr([
        ...quantOrderArr.filter(
          (order) => order.priceRecordId !== priceRecordId
        ),
        {
          // ...quantOrderArr.find((order) => order.priceRecordId === id),
          // id:
          //   id ??
          //   quantOrderArr.find((order) => order.priceRecordId === priceRecordId)
          //     .id,
          id: id ?? "",
          priceRecordId,
          quant: value ?? 0,
          status,
        },
      ]);
    else
      setQuantOrderArr([
        ...quantOrderArr.filter(
          (order) => order.priceRecordId !== priceRecordId
        ),
        {
          // ...quantOrderArr.find((order) => order.priceRecordId === id),
          // id:
          //   id ??
          //   quantOrderArr.find((order) => order.priceRecordId === priceRecordId)
          //     .id,
          id: id ?? "",
          priceRecordId,
          quant: value ?? 0,
          status: "deleted",
        },
      ]);
  };

  const removeFromOrder = (priceRecordId) => {
    if (
      quantOrderArr.find((el) => el.priceRecordId === priceRecordId)?.status !==
      "new"
    )
      setOrderArr(priceRecordId, null, "deleted", null);
    else {
      setQuantOrderArr(
        quantOrderArr.filter((item) => item.priceRecordId !== priceRecordId)
      );
    }
  };

  React.useEffect(() => {
    console.log(quantOrderArr);
  }, [quantOrderArr]);

  const [val, setVal] = React.useState("");

  const saveChanges = (data) => {
    console.log("saveChanges");
    console.log(quantOrderArr);
    setTable(
      table.map((row) =>
        row.id !== data.dataItem.id
          ? row
          : { ...row, orderQuant: data.orderQuant }
      )
    );
    setOrderArr(data.dataItem.id, data.orderQuant);
  };
  // console.log(quantOrderArr);
  // const OrderCell = (props) => {
  //   console.log("UPDATE2");

  //   return (
  //     <td>
  //       <NumericTextBox
  //         // type="text"
  //         value={val}
  //         onChange={(e) => setVal(e.target.value)}
  //       />
  //     </td>
  //   );
  // };

  // const OrderCell = React.memo((props) => {
  //   console.log("UPDATE");
  //   console.log(
  //     quantOrderArr.find((item) => item.priceRecordId === props.dataItem.id)
  //       ?.quant
  //   );
  //   return (
  //     <td>
  //       <Input
  //         type="text"
  //         value={
  //           quantOrderArr.find(
  //             (item) => item.priceRecordId === props.dataItem.id
  //           )?.quant ?? 0
  //         }
  //         onChange={(e) => setOrderArr(props.dataItem.id, e.target.value)}
  //       />
  //     </td>
  //   );
  // });

  React.useEffect(() => {
    console.log(fields);
  }, [fields]);

  const showMeta = (id) => {
    if (metaId !== id) setMetaId(id);
    else setMetaId(null);
  };

  const MetaCell = (props) => {
    //console.log(props)
    //console.log(props);

    const row = document && document.find((row) => row.id === metaId)?.meta;
    //console.log(row);
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
              Object.keys(row).map((k, idx) => (
                <div key={idx}>
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

  function itemChange(event) {
    console.log(event);
    let value = event.value;
    const name = event.dataItem.field;
    // if (event.quant < value) value = event.dataItem.quant;
    let obj = quantOrderArr.find(
      (el) => el.priceRecordId === event.dataItem.id
    );

    let status;
    if (obj) {
      status = obj.status;
      if (status === "toEdit") {
        status = "edited";
      }
    } else {
      status = "new";
      console.log(quantOrderArr);
      console.log("status = new");
    }
    console.log("VALUE=", value);
    console.log(event.dataItem.id, value, status, obj?.id);
    setOrderArr(event.dataItem.id, value, status, obj?.id);
    console.log(event.dataItem.id, event.value);
    const state = {
      result: table.map((item) => {
        if (item.id === event.dataItem.id) {
          item[event.field || ""] = event.value;
        }
        return item;
      }),
      dataState,
      // { ...dataState, skip: 0 }

      // dataState: { ...dataState, skip: 0 },
    };
    setResult(state.result);
    // setDataState(state.dataState);
  }

  React.useEffect(() => {
    console.log(quantOrderArr);
  }, [quantOrderArr]);
  const [page, setPage] = React.useState({
    skip: 0,
    take: 15,
  });
  let pagerSettings = {
    info: true,
    type: "input",
    previousNext: true,
  };

  // }, [
  //   table,
  //   checkedRow,
  //   fields,
  //   result,
  //   dataState,
  //   withChanges,
  //   metaId,
  //   quantOrderArr,
  // ]);

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
  // React.useEffect(() => {
  //   console.log("TABLE", table);
  // }, [table]);
  // React.useEffect(() => {
  //   console.log("DOCUMENT", document);
  // }, [document]);
  const createOrder = () => {
    _createOrder(vendor)
      .unwrap()
      .then((payload) => {
        setOrderId(payload.id);
      })
      .catch((err) => console.error(err));
  };

  const [_saveOrder] = useSaveOrderMutation();
  const [_saveEditOrder] = useSaveEditOrderMutation();
  // React.useEffect(() => {
  //   console.log(vendors);
  //   if (vendors === undefined) return;
  //   setOptionsVendor(
  //     vendors.map((vendor) => ({ value: vendor.id, label: vendor.name }))
  //   );
  // }, [vendors]);
  const getOrderRequest = () => {
    getOrder(orderId)
      .unwrap()
      .then((payload) => {
        console.log(payload);
        setQuantOrderArr(
          quantOrderArr.map((item) => ({
            ...item,
            status: "toEdit",
            id: payload.find((el) => el.priceRecordId === item.priceRecordId)
              .id,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const [deleteRecordOrder] = useDeleteRecordOrderMutation();
  const saveOrder = () => {
    console.log(comment);
    const url = "http://194.87.239.231:55555/api/ordercomment";
    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("orderid", orderId);

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
    axios.put(url, formData, config).catch((err) => console.error(err));
    console.log(
      quantOrderArr
        .filter((el) => el.status === "deleted")
        .map((row) => ({ id: row.id }))
    );

    _saveOrder({
      // vendorId: vendor,
      body: quantOrderArr
        .filter((el) => el.status === "new")
        .map((el) => ({
          id: "",
          priceRecordId: el.priceRecordId,
          quant: el.quant,
          orderId: orderId,
        })),
    })
      .unwrap()
      .then((_) => {
        console.log(quantOrderArr);
        if (quantOrderArr.filter((el) => el.status === "edited").length) {
          _saveEditOrder({
            // vendorId: vendor,
            body: quantOrderArr
              .filter((el) => el.status === "edited")
              .map((el) => ({
                id: el.id,
                priceRecordId: el.priceRecordId,
                quant: el.quant,
                orderId: orderId,
              })),
          })
            .unwrap()
            .then((_) => {
              console.log(
                quantOrderArr
                  .filter((el) => el.status === "deleted")
                  
              );
              deleteRecordOrder({
                body: quantOrderArr
                  .filter((el) => el.status === "deleted")
                  .map((row) => ({ id: row.id, orderId, priceRecordId: row.priceRecordId })),
              })
                .unwrap()
                .then((_) => {
                  getOrderRequest();
                }).catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
        } else {
          console.log(
            quantOrderArr
              .filter((el) => el.status === "deleted")
              
          );
          deleteRecordOrder({
            body: quantOrderArr
              .filter((el) => el.status === "deleted")
              .map((row) => ({ id: row.id, orderId, priceRecordId: row.priceRecordId })),
          })
            .unwrap()
            .then((_) => {
              getOrderRequest();
            }).catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  };

  const reset = () => {
    setQuantOrderArr([]);
    setTable([]);
    setDocument([]);
    setOrderId();
    setVendor();
    setComment("");
  };
  React.useEffect(() => {
    console.log("Changed result");
  }, [result]);
  const smartSlice = (info) => {
    if (withChanges) return info;
    return info.slice(page.skip, page.take + page.skip);
  };
  return (
    <div
      style={{
        // width: "100%",
        minHeight: "500px",
        marginTop: "80px",
        marginLeft: "20px",
      }}
    >
      <div style={{ display: "flex" }}>
        <div>
          <div style={{ width: "500px", marginBottom: "10px" }}>
            <div style={{ marginBottom: "10px" }}>Поставщик:</div>

            <Select
              options={options}
              onChange={onSelectVendor}
              placeholder="Выбрать поставщика"
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            Выбрано: {getVendorById(vendor)}
          </div>
          {vendor && !table?.length && (
            <Button style={{ marginRight: "10px" }} onClick={showPriceList}>
              Показать прайс-лист
            </Button>
          )}
          {!orderId && vendor && !!table?.length && (
            <>
              <Button onClick={createOrder}>Создать заказ</Button>
            </>
          )}
          {orderId && (
            <>
              <Button onClick={saveOrder} style={{ marginRight: "10px" }}>
                Сохранить заказ
              </Button>
              <Button onClick={reset}>Новый заказ</Button>
            </>
          )}
        </div>
        <div
          style={{
            marginTop: "5px",
            marginLeft: "20px",
          }}
        >
          <textarea
            style={{
              maxHeight: "100px",
              maxWidth: "200px",
              minHeight: "40px",
              minWidth: "120px",
              padding: "5px",
              border: "1px solid grey",
            }}
            placeholder="Комментарий"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
        </div>
      </div>

      {result && !withChanges && (
        <Grid
          resizable={true}
          style={{
            height: "500px",
            marginTop: "10px",
          }}
          data={result.slice(page.skip, page.take + page.skip)}
          scrollable={"virtual"}
          skip={page.skip}
          take={page.take}
          rowHeight={166}
          total={result.length}
          onPageChange={(event) => { console.log(event.page); setPage(event.page)}}
          onItemChange={itemChange}
          dataItemKey={"id"}
        >
          {columns}
        </Grid>
      )}

      {result && withChanges && (
        <Grid
          resizable={true}
          style={{
            width: "100%",
            height: "500px",
            marginTop: "10px",
          }}
          data={result.filter(
            (row) => row.quantDelta !== 0 || row.priceDelta !== 0
          )}
          onItemChange={itemChange}
        >
          {columns}
        </Grid>
      )}
      {!withChanges ? (
        <Button
          style={{
            marginTop: "10px",
          }}
          onClick={() => {
            setWithChanges(true);
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
