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
import { Loader } from "@progress/kendo-react-indicators";
import { clearAllListeners } from "@reduxjs/toolkit";
import ContentLoader from 'react-content-loader'
// const removeFromOrder = (priceRecordId) => {
//   // setOrderArr(priceRecordId, null, "deleted");
// };
const MyCell = function (props) {
  // console.log(props);
  console.log("MyCell");
  // return <NumInput itemChange={itemChange} {...props} />;
  return (
    <td style={{ height: "80px" }} colSpan={props.colSpan}>
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
  // const [vendor, setVendor] = React.useState(null);
  const vendor = React.useRef(null);
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
  const [table, setTable] = React.useState();
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
  const [loading, setLoading] = React.useState(false);
  const [margin, setMargin] = React.useState(false);
  // setTimeout(() => setQuantOrderArr([]), 25000);

  // const [orderCommentReq] = useOrderCommentMutation();
  const dispatch = useDispatch();

  const DefaultCell = (props) => {
    const field = props.field || "";
    return (
      <td style={{ height: "150px" }} colSpan={props.colSpan}>
        {props.dataItem[field]}
      </td>
    );
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
  const [loadingDocument, setLoadingDocument] = React.useState(false);
  // React.useEffect(() => {
  //   setLoadingOrder(true);
  // }, [quantOrderArr]);

  React.useEffect(() => {
    if (!state) return;

    let idVendor = state.idVendor;
    let idOrder = state.idOrder;

    setComment(state.comment);
    //setVendor(idVendor);
    vendor.current = idVendor;
    setLoadingDocument(true);
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
      .catch((err) => console.log(err)).finally(() => setLoadingDocument(false));

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
    //setVendor(select.value);
    vendor.current = select.value;
    showPriceList();
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
    setLoadingDocument(true);
    getDocument({ id: docId })
      .unwrap()
      .then((payload) => {
        setDocument(payload);
        //console.log(payload);
      })
      .catch((err) => console.log(err)).finally(() => setLoadingDocument(false));
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
    console.log(mapDict, document);
    if (
      // (mapDict === undefined || !document === undefined || !document.length) &&
      (mapDict === undefined || !document === undefined) &&
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
              : `${_el.price} (${_el.statistics.price})`,
          quant:
            _el.statistics.quant === 0
              ? _el.quant
              : _el.statistics.quant > 0
              ? `${_el.quant} (+${_el.statistics.quant})`
              : `${_el.quant} (${_el.statistics.quant})`,
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
      setTable();
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
    formData.append("VendorId", vendor.current);
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
      {
      setLoadingDocument(true);
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            setDocument(payload);
            //console.log(payload);
            //console.log(2);
          })
          .catch((err) => console.log(err)).finally(() => setLoadingDocument(false))
        }
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
        setLoadingDocument(true);
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            setDocument(payload);
          })
          .catch((err) => console.log(err)).finally(() => setLoadingDocument(false));

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
        setLoadingDocument(true);
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            setDocument(payload);
          })
          .catch((err) => console.log(err)).finally(() => setLoadingDocument(false));
      });
  };
  const getVendorById = (id) => {
    if (!vendor.current || !options) return "Не выбрано";
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
        setLoadingDocument(true);
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            setDocument(payload);
          })
          .catch((err) => console.log(err)).finally(() => setLoadingDocument(false));
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
        setLoadingDocument(false);
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            setDocument(payload);
          })
          .catch((err) => console.log(err)).finally(() => setLoadingDocument(false));
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
        setLoadingDocument(true);
        getDocument({ id: docId })
          .unwrap()
          .then((payload) => {
            setDocument(payload);
          })
          .catch((err) => console.log(err)).finally(() => setLoadingDocument(false));
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
  const frozen = useSelector((state) => state.settings.frozen);
  const promise = React.useRef();
  const counter = React.useRef(0);
  const showPriceList = () => {
    if (frozen)
      if (
        !window.confirm(
          "Ваш заказ не будет сохранен, уверены, что хотите поменять поставщика?"
        )
      )
        return;
    dispatch(freeze(false));
    setQuantOrderArr([]);
    setTable();
    setDocument([]);
    setOrderId();
    //getDocument()?.abort();
    //alert(1);
    // dispatch(clearAllListeners());
    counter.current++;
    console.log("counter=", counter.current);
    promise.current?.abort();
    // if (counter.current !== 5) promise.current?.abort();
    promise.current = getDocument({ id: vendor.current });
    setLoadingDocument(true);
    promise.current
      .unwrap()
      .then((payload) => {
        setDocument(payload);

        // getDictionaryById({ id: 7 })
        //   .unwrap()
        //   .then((payload) => {})
        //   .catch((err) => console.error(err));

        //console.log(payload);
      })
      .catch((err) => console.log(err)).finally(() => setLoadingDocument(false));
  };
  // React.useEffect(() => {
  //   console.log("TABLE", table);
  // }, [table]);
  // React.useEffect(() => {
  //   console.log("DOCUMENT", document);
  // }, [document]);
  const createOrder = () => {
    _createOrder(vendor.current)
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
                quantOrderArr.filter((el) => el.status === "deleted")
              );
              deleteRecordOrder({
                body: quantOrderArr
                  .filter((el) => el.status === "deleted")
                  .map((row) => ({
                    id: row.id,
                    orderId,
                    priceRecordId: row.priceRecordId,
                  })),
              })
                .unwrap()
                .then((_) => {
                  getOrderRequest();
                })
                .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
        } else {
          console.log(quantOrderArr.filter((el) => el.status === "deleted"));
          deleteRecordOrder({
            body: quantOrderArr
              .filter((el) => el.status === "deleted")
              .map((row) => ({
                id: row.id,
                orderId,
                priceRecordId: row.priceRecordId,
              })),
          })
            .unwrap()
            .then((_) => {
              getOrderRequest();
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  };

  const reset = () => {
    setQuantOrderArr([]);
    setTable();
    setDocument([]);
    setOrderId();
    // setVendor();
    vendor.current = "";
    setComment("");
  };
  React.useEffect(() => {
    console.log("Changed result");
  }, [result]);
  const smartSlice = (info) => {
    if (withChanges) return info;
    return info.slice(page.skip, page.take + page.skip);
  };

  console.log("margin=", margin);
  return (
    <div
      style={{
        // width: "100%",
        minHeight: "500px",
        marginTop: "80px",
        marginLeft: "20px",
      }}
    >
      {loading && (
        <div
          style={{
            content: "",
            position: "absolute",
            top: "-179px",
            left: 0,
            background: "rgba(0,0,0,.5)",
            zIndex: "1000",
            height: "100vh",
            display: "flex",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader size="large" type="infinite-spinner" />{" "}
        </div>
      )}
      <div style={{ display: "flex" }}>
        <div>
          <div style={{ width: "500px", marginBottom: "10px" }}>
            <div style={{ marginBottom: "10px" }}>Поставщик:</div>
            <div>
              <Select
                // menuPlacement="top"
                // styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                options={options}
                onChange={(e) => {
                  onSelectVendor(e);
                  // setMargin(false);
                  //alert("onChange");
                  console.log("onChange");
                }}
                // onFocus={() => {
                //   setMargin(true);
                //   console.log(true);
                //   console.log("onFocus");
                //   //alert("onFocus");
                // }}
                // onBlur={() => {
                //   setMargin(false);
                //   //alert("onBlur");
                //   console.log("onBlur");
                // }}
                // styles={{
                //   control: (baseStyles, state) => ({
                //     ...baseStyles,
                //     zIndex: 10000,
                //   }),
                // }}
                placeholder="Выбрать поставщика"
              />
            </div>
            {/* <select class="select-css" style={{height:"100px"}}> 
<option>This is a native select element</option> 
<option>Apples</option> 
<option>Bananas</option> 
<option>Grapes</option> 
<option>Oranges</option>
<option>Apples</option> 
<option>Bananas</option> 
<option>Grapes</option> 
<option>Oranges</option> 
<option>Apples</option> 
<option>Bananas</option> 
<option>Grapes</option> 
<option>Oranges</option>  
</select> */}
          </div>

          <div style={{ marginBottom: "200px" }}>
            Выбрано: {getVendorById(vendor.current)}
          </div>
          {/* {vendor.current && !table?.length && (
            <Button style={{ marginRight: "10px" }} onClick={showPriceList}>
              Показать прайс-лист
            </Button>
          )} */}
          {!orderId && vendor.current && !!table?.length && (
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
              maxWidth: "500px",
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
      {loadingDocument && <>
      <ContentLoader
    width={1000}
    height={550}
    viewBox="0 0 1000 550"
    backgroundColor="#dee6e7"
    foregroundColor="#cfcece"
    speed={2}
  >
    <rect x="51" y="45" rx="3" ry="3" width="906" height="17" />
    <circle cx="879" cy="123" r="11" />
    <circle cx="914" cy="123" r="11" />
    <rect x="104" y="115" rx="3" ry="3" width="141" height="15" />
    <rect x="305" y="114" rx="3" ry="3" width="299" height="15" />
    <rect x="661" y="114" rx="3" ry="3" width="141" height="15" />
    <rect x="55" y="155" rx="3" ry="3" width="897" height="2" />
    <circle cx="880" cy="184" r="11" />
    <circle cx="915" cy="184" r="11" />
    <rect x="105" y="176" rx="3" ry="3" width="141" height="15" />
    <rect x="306" y="175" rx="3" ry="3" width="299" height="15" />
    <rect x="662" y="175" rx="3" ry="3" width="141" height="15" />
    <rect x="56" y="216" rx="3" ry="3" width="897" height="2" />
    <circle cx="881" cy="242" r="11" />
    <circle cx="916" cy="242" r="11" />
    <rect x="106" y="234" rx="3" ry="3" width="141" height="15" />
    <rect x="307" y="233" rx="3" ry="3" width="299" height="15" />
    <rect x="663" y="233" rx="3" ry="3" width="141" height="15" />
    <rect x="57" y="274" rx="3" ry="3" width="897" height="2" />
    <circle cx="882" cy="303" r="11" />
    <circle cx="917" cy="303" r="11" />
    <rect x="107" y="295" rx="3" ry="3" width="141" height="15" />
    <rect x="308" y="294" rx="3" ry="3" width="299" height="15" />
    <rect x="664" y="294" rx="3" ry="3" width="141" height="15" />
    <rect x="58" y="335" rx="3" ry="3" width="897" height="2" />
    <circle cx="881" cy="363" r="11" />
    <circle cx="916" cy="363" r="11" />
    <rect x="106" y="355" rx="3" ry="3" width="141" height="15" />
    <rect x="307" y="354" rx="3" ry="3" width="299" height="15" />
    <rect x="663" y="354" rx="3" ry="3" width="141" height="15" />
    <rect x="57" y="395" rx="3" ry="3" width="897" height="2" />
    <circle cx="882" cy="424" r="11" />
    <circle cx="917" cy="424" r="11" />
    <rect x="107" y="416" rx="3" ry="3" width="141" height="15" />
    <rect x="308" y="415" rx="3" ry="3" width="299" height="15" />
    <rect x="664" y="415" rx="3" ry="3" width="141" height="15" />
    <rect x="55" y="453" rx="3" ry="3" width="897" height="2" />
    <rect x="51" y="49" rx="3" ry="3" width="2" height="465" />
    <rect x="955" y="49" rx="3" ry="3" width="2" height="465" />
    <circle cx="882" cy="484" r="11" />
    <circle cx="917" cy="484" r="11" />
    <rect x="107" y="476" rx="3" ry="3" width="141" height="15" />
    <rect x="308" y="475" rx="3" ry="3" width="299" height="15" />
    <rect x="664" y="475" rx="3" ry="3" width="141" height="15" />
    <rect x="55" y="513" rx="3" ry="3" width="897" height="2" />
    <rect x="52" y="80" rx="3" ry="3" width="906" height="17" />
    <rect x="53" y="57" rx="3" ry="3" width="68" height="33" />
    <rect x="222" y="54" rx="3" ry="3" width="149" height="33" />
    <rect x="544" y="55" rx="3" ry="3" width="137" height="33" />
    <rect x="782" y="56" rx="3" ry="3" width="72" height="33" />
    <rect x="933" y="54" rx="3" ry="3" width="24" height="33" />
  </ContentLoader>
  </>
  }
      {table && result &&  !withChanges && (
       

        <Grid
          resizable={true}
          style={{
            height: "500px",
            marginTop: "10px",
          }}
          data={
            document === undefined || document.length === 0
              ? []
              : result.slice(page.skip, page.take + page.skip)
          }
          scrollable={"virtual"}
          skip={page.skip}
          take={page.take}
          rowHeight={166}
          total={result.length}
          onPageChange={(event) => {
            console.log(event.page);
            setPage(event.page);
          }}
          onItemChange={itemChange}
          dataItemKey={"id"}
        >
          {columns}
        </Grid>
      )}

      {table && result && withChanges && (
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
      {table && result && ( !withChanges ? (
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
      ))}
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
