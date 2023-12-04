import React, { useEffect, useState } from "react";
import { useGetVendorsQuery } from "../../features/apiSlice";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";

import {
  DataGrid,
  GroupPanel,
  // ...
  FilterRow,
  SearchPanel,
  Scrolling,
  Column,
  Editing,
} from "devextreme-react/data-grid";

import { useGetDocumentMutation } from "../../features/apiSlice";

import { createStore } from "devextreme-aspnet-data-nojquery";
import { arrowDownIcon } from "@progress/kendo-svg-icons";

import applyChanges from "devextreme/data/apply_changes";

const serviceUrl = "http://194.87.239.231:55555/api/";

const remoteDataSource = createStore({
  key: "ID",
  loadUrl: serviceUrl + "/Document/8f645ced-737e-11eb-82a1-001d7dd64d88",
  insertUrl: serviceUrl + "/InsertAction",
  updateUrl: serviceUrl + "/UpdateAction",
  deleteUrl: serviceUrl + "/DeleteAction",
});

function PriceList() {
  const [data, setData] = useState([]);
  // const { data, error: err, isLoading, refetch } = useGetVendorsQuery();
  const [getDocument] = useGetDocumentMutation();
  const [dataCol, setDataCol] = React.useState([]);
  useEffect(() => {
    async function exec() {
      const res = await getDocument({
        id: "8f645ced-737e-11eb-82a1-001d7dd64d88",
      }).unwrap();
      //setData(test);
      let dl = [];
      console.log(res);

      res[0].fieldsList.columns.forEach((element) => {
        dl[element.index] = {
          name: element.name,
          caption: element.caption,
          alignment: element.alignment,
          format: element.format,
        };
      });
      console.log(dl.filter((el) => el !== undefined));
      // setDataCol(res.filter(el => el  ));
      setDataCol(dl.filter((el) => el !== undefined));
      //  arr = [ 1 2 3 ]
      // arr.map((el) => {
      //   return el *2
      // })
      // [2 4 6 ]
      setData(
        res.map((_el, idx) => {
          return {
            priceDelta: _el.statistics.price,
            quantDelta: _el.statistics.quant,
            name: _el.name,
            sku: _el.sku,
            linkId: _el.linkId,
            // orderQuant:
            //   quantOrderArr.length === 0 ? 0 : obj[_el.id] ? obj[_el.id] : 0,
            price: _el.price,
            quant: _el.quant,
            //stats: _el.statistics.quant,
            quantStock: _el.quantStock,
            id: _el.id,
            ..._el.meta,
            status: "new",
          };
          // for (let row in _el.meta) {
          //   el[row] = _el.meta[row];
          // }
          // res.push(el);
        })
      );
    }
    exec();
  }, []);
  // let fields = [
  //   {
  //     name: "price",
  //     alignment: "right"
  //   }
  // ]

  function getFormat(field) {
    let curencyFields = ["price"];
    let intFields = ["quant", "quantStock", "orderQuant"];

    let res = { mask: "", alignment: "left" };

    if (curencyFields.includes(field)) {
      res.mask = "##0.00";
      res.alignment = "right";
    } else {
      if (intFields.includes(field)) res.alignment = "right";
    }

    return res;
  }
  const ignore = (d, fields) => {
    // console.log(
    //   "!!!!!",
    //   d.filter((el) => !fields.includes(el))
    // );
    return d.filter((el) => !fields.includes(el));
  };
  //console.log( Object.keys(data[0].meta));
  // const all_fields = data.length
  //   ? [
  //       "name",
  //       "sku",
  //       "price",
  //       "quant",
  //       "quantStock",
  //       "barcode",
  //       ...ignore(
  //         Object.keys(data[0].meta),
  //         "name",
  //         "sku",
  //         "price",
  //         "quant",
  //         "quantStock",
  //         "barcode"
  //       ),
  //     ]
  //   : [];
  // console.log("9999", all_fields);
  // const columns = all_fields.map((el) => {
  //   let f = getFormat(el);
  //   return <Column dataField={el} format={f.mask} alignment={f.alignment} />;
  // });
  // console.log(dataCol);
  //console.log(dataCol[0]);
  //console.log(dataCol[0].fieldsList);
  //console.log(dataCol[0].fieldsList.columns);
  //dataCol[0].fieldsList.columns

  // const dataCol1 = [
  //   {
  //     id: "8fb5b92e-e361-4df7-8068-cfe51b092260",
  //     name: "1,0 Царская Золотая (Moscow Edition) в тубе (ГЛ)",
  //     uidRef: "",
  //     uidOwner: "8f645ced-737e-11eb-82a1-001d7dd64d88",
  //     meta: {
  //       sku: "УТ000006559",
  //       name: "1,0 Царская Золотая (Moscow Edition) в тубе (ГЛ)",
  //       images: [],
  //       barcode: "4603514011799",
  //       column3: "1.1. 1. Царские водки",
  //       column5: "РОССИЯ",
  //       column6: "",
  //       column7: "",
  //       column8: "",
  //       column9: "2022",
  //       column10: "1",
  //       column11: "6",
  //     },
  //     sku: "УТ000006559",
  //     status: 1,
  //     type: 1,
  //     docId: "f0eab818-8482-437a-aa1b-a84efbd7fe7f",
  //     skuKey: "УТ000006559#1",
  //     quant: 553,
  //     price: 999,
  //     statistics: {
  //       price: 0,
  //       quant: 0,
  //     },
  //     images: [],
  //     quantStock: 0,
  //     linkId: "",
  //     stockInfo: null,
  //     fieldsList: {
  //       maxIndex: 15,
  //       columns: [
  //         {
  //           name: "sku",
  //           caption: "СКУ",
  //           index: 0,
  //           alignment: "L",
  //           format: "",
  //         },
  //         {
  //           name: "name",
  //           caption: "Наименование",
  //           index: 1,
  //           alignment: "L",
  //           format: "",
  //         },
  //         {
  //           name: "quant",
  //           caption: "Количество",
  //           index: 2,
  //           alignment: "R",
  //           format: "",
  //         },
  //         {
  //           name: "price",
  //           caption: "Цена",
  //           index: 4,
  //           alignment: "R",
  //           format: "##0.00",
  //         },
  //         {
  //           name: "quant_stock",
  //           caption: "Количество на складе",
  //           index: 3,
  //           alignment: "R",
  //           format: "",
  //         },
  //         {
  //           name: "images",
  //           caption: "images",
  //           index: 5,
  //           alignment: "L",
  //           format: "",
  //         },
  //         {
  //           name: "barcode",
  //           caption: "Штрих-код",
  //           index: 7,
  //           alignment: "L",
  //           format: "",
  //         },
  //         {
  //           name: "column3",
  //           caption: "column3",
  //           index: 8,
  //           alignment: "L",
  //           format: "",
  //         },
  //         {
  //           name: "column5",
  //           caption: "column5",
  //           index: 9,
  //           alignment: "L",
  //           format: "",
  //         },
  //         {
  //           name: "column6",
  //           caption: "column6",
  //           index: 10,
  //           alignment: "L",
  //           format: "",
  //         },
  //         {
  //           name: "column7",
  //           caption: "column7",
  //           index: 11,
  //           alignment: "L",
  //           format: "",
  //         },
  //         {
  //           name: "column8",
  //           caption: "column8",
  //           index: 12,
  //           alignment: "L",
  //           format: "",
  //         },
  //         {
  //           name: "column9",
  //           caption: "column9",
  //           index: 13,
  //           alignment: "L",
  //           format: "",
  //         },
  //         {
  //           name: "column10",
  //           caption: "column10",
  //           index: 14,
  //           alignment: "L",
  //           format: "",
  //         },
  //         {
  //           name: "column11",
  //           caption: "column11",
  //           index: 15,
  //           alignment: "L",
  //           format: "",
  //         },
  //       ],
  //     },
  //   },
  // ];
  const columns1 = dataCol.length
    ? [
        ...dataCol.map((el) => {
          //const el = element.fieldsList.columns;
          let alignment;
          switch (el.alignment) {
            case "C":
              alignment = "center";
              break;
            case "L":
              alignment = "left";
              break;
            case "R":
              alignment = "right";
              break;
            default:
              alignment = "left";
              break;
          }
          console.log(alignment);
          return (
            <Column
              key={el.name}
              dataField={el.name}
              format={el.format}
              alignment={alignment}
              allowEditing={false}
            />
          );
        }),
        <Column
          key={"orderQuant"}
          dataField={"orderQuant"}
          format={"right"}
          allowEditing={true}
        />,
      ]
    : [];
  //const columns = [];
  console.log(data, columns1);

  // data.length && columns.length &&
  // const getRowId = (row) => row.id;
  // const [editingStateColumnExtensions] = useState([
  //   { columnName: "name", editingEnabled: false },
  // ]);

  const URL = "https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi";

  const FETCH_PENDING = "FETCH_PENDING";
  const FETCH_SUCCESS = "FETCH_SUCCESS";
  const FETCH_ERROR = "FETCH_ERROR";
  const SAVING_PENDING = "SAVING_PENDING";
  const SAVING_SUCCESS = "SAVING_SUCCESS";
  const SAVING_ERROR = "SAVING_ERROR";
  const SAVING_CANCEL = "SAVING_CANCEL";
  const SET_CHANGES = "SET_CHANGES";
  const SET_EDIT_ROW_KEY = "SET_EDIT_ROW_KEY";

  async function loadOrders(dispatch) {
    dispatch({ type: FETCH_PENDING });

    try {
      // const { data } = await sendRequest(`${URL}/Orders?skip=700`);

      dispatch({
        type: FETCH_SUCCESS,
        payload: {
          data,
        },
      });
    } catch (err) {
      dispatch({ type: FETCH_ERROR });
      throw err;
    }
  }

  async function saveChange(dispatch2, change) {
    if (change && change.type) {
      let data;

      dispatch2({ type: SAVING_PENDING });

    //   try {
    //     data = await sendChange(URL, change);

    //     change.data = data;
    //     dispatch({
    //       type: SAVING_SUCCESS,
    //       payload: {
    //         change,
    //       },
    //     });

    //     return data;
    //   } catch (err) {
    //     dispatch({ type: SAVING_ERROR });
    //     throw err;
    //   }
    // } else {
    //   dispatch({ type: SAVING_CANCEL });
    //   return null;
    // }
  }

  // async function sendChange(url, change) {
  //   switch (change.type) {
  //     case "insert":
  //       return sendRequest(`${url}/InsertOrder`, "POST", {
  //         values: JSON.stringify(change.data),
  //       });
  //     case "update":
  //       return sendRequest(`${url}/UpdateOrder`, "PUT", {
  //         key: change.key,
  //         values: JSON.stringify(change.data),
  //       });
  //     case "remove":
  //       return sendRequest(`${url}/DeleteOrder`, "DELETE", { key: change.key });
  //     default:
  //       return null;
  //   }
  // }

  function setChanges(dispatch, changes) {
    dispatch({
      type: SET_CHANGES,
      payload: changes,
    });
  }

  function setEditRowKey(dispatch, editRowKey) {
    dispatch({
      type: SET_EDIT_ROW_KEY,
      payload: editRowKey,
    });
  }

  const initialState = {
    data: [],
    changes: [],
    editRowKey: null,
    isLoading: false,
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);

  function reducer(state, { type, payload }) {
    let newData;

    switch (type) {
      case SAVING_SUCCESS:
        newData = applyChanges(state.data, [payload.change], {
          keyExpr: "OrderID",
        });

        return {
          ...state,
          data: newData,
          changes: [],
          editRowKey: null,
          isLoading: false,
        };
      case SAVING_CANCEL:
        return {
          ...state,
          changes: [],
          editRowKey: null,
        };
      case SET_CHANGES:
        return {
          ...state,
          changes: payload,
        };
      default:
        return state;
    }
  }

  const onChangesChange = React.useCallback((changes) => {
    setChanges(dispatch, changes);
  }, []);
  return (
    <div style={{ marginTop: "100px" }}>
      <DataGrid
        dataSource={data}
        allowColumnReordering={true}
        allowColumnResizing={true}
        height={800}
        columnResizingMode={"widget"}
        // columnMinWidth={150}
        columnAutoWidth={true}
      >
        {/* <Column dataField="name" dataType="string" /> */}
        {columns1}
        {/* <Column dataField="name" dataType="string" />
        <Column dataField="price" dataType="string" />
        <Column dataField="sku" dataType="string" /> */}
        <Editing
          //defaultEditingRowIds={[0]}
          changes={state.changes}
          onChangesChange={onChangesChange}
          mode="row"
          allowUpdating={true}
          editingStateColumnExtensions={editingStateColumnExtensions}
          // allowAdding={true}
          // allowDeleting={true}
        />

        <Scrolling columnRenderingMode="virtual" mode="infinite" />
        <FilterRow visible={true} />
        <SearchPanel visible={true} />
        <GroupPanel visible={true} />

        {/* <Column dataField="Channel" dataType="string" />
        <Column dataField="Customer" dataType="string" width={150} /> */}
      </DataGrid>
    </div>
  );
}

export default PriceList;

// import * as React from "react";
// import * as ReactDOM from "react-dom";
// import { Button } from "@progress/kendo-react-buttons";
// import {
//   useAddToStockMutation,
//   useCreateOrderMutation,
//   useDeleteRecordOrderMutation,
//   useDeleteRecordsMutation,
//   useGetDictionaryByIdMutation,
//   useGetDocumentMutation,
//   useOrderCommentMutation,
//   useSaveEditOrderMutation,
//   useSaveOrderMutation,
//   useUploadMutation,
// } from "../../features/apiSlice";
// import axios from "axios";
// import Select from "react-select";
// import {
//   useGetVendorsQuery,
//   useGetProfilesQuery,
//   useGetDictionaryQuery,
//   useEditRecordMutation,
//   useGetOrderMutation,
// } from "../../features/apiSlice";
// import "./PriceList.css";
// import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import { Window } from "@progress/kendo-react-dialogs";
// import { useLocation } from "react-router-dom";
// import { default as NumInput } from "../../components/NumInput";
// import { useSelector, useDispatch } from "react-redux";
// import { freeze } from "../../features/settings.js";
// import { Loader } from "@progress/kendo-react-indicators";
// import TableSkeleton from "../../components/TableSkeleton";
// import { Checkbox } from "@progress/kendo-react-inputs";
// import WindowLink from "../../components/WindowLink";
// import Selectrix from "react-selectrix";
// import { process } from "@progress/kendo-data-query";

// const MyCell = function (props) {
//   return (
//     <td style={{ height: "40px" }} colSpan={props.colSpan}>
//       <NumInput {...props} />
//     </td>
//   );
// };
// const PriceList = (props) => {
//   // const DeleteCell = (props) => {

//   //   if (props.rowType === "groupHeader") {
//   //     return null;
//   //   }
//   //   return (
//   //     <td colSpan={props.colSpan} style={{ overflow: "visible" }}>
//   //       <img
//   //         onClick={() => removeFromOrder(props.dataItem.id)}
//   //         src={require("../../assets/remove.png")}
//   //         alt="Удалить"
//   //       />
//   //     </td>
//   //   );
//   // };

//   const abbreviations = {
//     code: "Код",
//     name: "Название",
//     year: "Год",
//     alcohol: "Процент алкоголя",
//     value: "Объём",
//     price: "Цена",
//     quant: "Количество",
//     structure: "Состав",
//     rating: "Рейтинг",
//     country: "Страна",
//     region: "Регион",
//     alcClass: "Класс алкоголя",
//     manufacturer: "Производитель",
//     color: "Цвет",
//     barcode: "Штрих-код",
//     type: "Тип",
//   };
//   const dictionaryAll = {
//     1: "Страна",
//     2: "Регион",
//     3: "Класс",
//     4: "Производитель",
//     5: "Цвет",
//     6: "Тип",
//   };
//   const fieldNameDictionary = {
//     1: "country",
//     2: "region",
//     3: "alcClass",
//     4: "manufacturer",
//     5: "color",
//     6: "type",
//   };

//   const [options, setOptions] = React.useState([]);
//   const vendor = React.useRef(null);
//   const [docId, setDocId] = React.useState();
//   const [document, setDocument] = React.useState([]);
//   const [upload] = useUploadMutation();
//   const { data, error: err, isLoading, refetch } = useGetVendorsQuery();
//   const { data: dataProfiles } = useGetProfilesQuery();
//   const { data: dict } = useGetDictionaryQuery();
//   const [mapDict, setMapDict] = React.useState({});
//   const [table, setTable] = React.useState();
//   const [getDocument] = useGetDocumentMutation();
//   const [visible, setVisible] = React.useState(false);
//   const [editRecord] = useEditRecordMutation();
//   const [dictionary, setDictionary] = React.useState([]);
//   const [checkedRow, setCheckedRow] = React.useState({});
//   const [fields, setFields] = React.useState([]);
//   const [metaId, setMetaId] = React.useState(null);
//   const [getDictionaryById] = useGetDictionaryByIdMutation();
//   const [_createOrder] = useCreateOrderMutation();
//   const [quantOrderArr, setQuantOrderArr] = React.useState([]);
//   const [orderId, setOrderId] = React.useState();
//   const [getOrder] = useGetOrderMutation();
//   const [comment, setComment] = React.useState("");
//   const [loading, setLoading] = React.useState(false);

//   // const [orderCommentReq] = useOrderCommentMutation();
//   const dispatch = useDispatch();

//   const DefaultCell = (props) => {
//     const field = props.field || "";
//     return (
//       <td style={{ height: "40px" }} colSpan={props.colSpan}>
//         {props.dataItem[field]}
//       </td>
//     );
//   };
//   const LinkCell = (props) => {
//     return (
//       <td style={{ height: "40px" }}>
//         {props.dataItem.linkId ? (
//           <img
//             style={{ width: "20px", height: "20px", cursor: "pointer" }}
//             onClick={() => {
//               reset2();
//               setLink(props.dataItem.id);
//             }}
//             src={require("../../assets/grc.png")}
//           />
//         ) : (
//           <img
//             style={{ width: "20p x", height: "20px", cursor: "pointer" }}
//             onClick={() => {
//               reset2();
//               setLink(props.dataItem.id);
//             }}
//             src={require("../../assets/redc.png")}
//           />
//         )}
//       </td>
//     );
//   };
//   const func_fields = (fields) => {
//     if (!fields) return;
//     let new_fields;
//     let idx = fields.findIndex((el) => el === "quant");
//     if (orderId)
//       new_fields = [
//         ...fields.slice(0, idx + 1),
//         "orderQuant",
//         ...fields.slice(idx + 1, fields.length),
//       ];
//     else new_fields = [...fields];
//     new_fields = ["link", ...new_fields];

//     let cols = new_fields?.map((field, idx) => {
//       if (field === "quantDelta" || field === "priceDelta") return;
//       let w = 100;
//       if (field === "name") w = 400;
//       if (field === "link") {
//         return <GridColumn cell={LinkCell} width="50px" />;
//       }
//       if (field === "orderQuant" && orderId) {
//         return (
//           <GridColumn
//             cell={MyCell}
//             field="orderQuant"
//             title="Order"
//             width={w}
//             key={field}
//           />
//         );
//       }

//       return (
//         <GridColumn
//           key={field}
//           field={field}
//           width={w}
//           cell={DefaultCell}
//           title={field}
//         />
//       );
//     });
//     return cols;
//   };

//   const columns = func_fields(fields);

//   React.useEffect(() => {
//     if (orderId) {
//       dispatch(freeze(true));
//     }
//   }, [orderId]);

//   const allFields = [
//     "code",
//     "name",
//     "year",
//     "alcohol",
//     "value",
//     "price",
//     "quant",
//     "quantStock",
//     "structure",
//     "rating",
//     "barcode",
//     "country",
//     "region",
//     "alcClass",
//     "manufacturer",
//     "color",
//     "type",
//   ];

//   const match = {
//     country: 0,
//     region: 1,
//     alcClass: 2,
//     manufacturer: 3,
//     color: 4,
//     type: 5,
//   };

//   const emptyObject = () => {
//     let res = {};
//     for (let field of allFields) {
//       res[field] = "";
//     }
//     return res;
//   };
//   const [formData, setFormData] = React.useState(emptyObject());
//   const [addToStock] = useAddToStockMutation();
//   const { state } = useLocation();
//   const [loadingOrder, setLoadingOrder] = React.useState(0);
//   const [loadingDocument, setLoadingDocument] = React.useState(false);

//   React.useEffect(() => {
//     let idVendor = state?.idVendor;
//     if (!state || !idVendor) return;

//     let idOrder = state.idOrder;

//     setComment(state.comment);
//     vendor.current = idVendor;
//     setLoadingDocument(true);
//     getDocument({ id: idVendor })
//       .unwrap()
//       .then((payload) => {
//         setDocument(payload);
//         getDictionaryById({ id: 7 })
//           .unwrap()
//           .then((payload) => {})
//           .catch((err) => console.error(err));
//       })
//       .catch((err) => console.log(err))
//       .finally(() => setLoadingDocument(false));

//     getOrder(idOrder)
//       .unwrap()
//       .then((payload) => {
//         setOrderId(idOrder);

//         let obj = {};
//         payload.forEach((el) => {
//           obj[el.priceRecordId] = el.quant;
//         });
//         if (!(payload?.length !== 0)) setLoadingOrder(3);
//         setQuantOrderArr(
//           payload.map((el) => ({
//             id: el.id,
//             priceRecordId: el.priceRecordId,
//             quant: obj[el.priceRecordId],
//             status: "toEdit",
//           }))
//         );
//         setTable(
//           table.slice(0, 10).map((row) => ({ ...row, orderQuant: obj[row.id] }))
//         );
//       })
//       .catch((err) => console.error(err));
//   }, [state]);

//   const onSelectVendor = (select) => {
//     vendor.current = select.value;
//     showPriceList();
//   };

//   React.useEffect(() => {
//     setOptions(data?.map((el) => ({ value: el.id, label: el.name })));
//   }, [data]);

//   React.useEffect(() => {
//     if (docId === undefined) return;
//     setLoadingDocument(true);
//     getDocument({ id: docId })
//       .unwrap()
//       .then((payload) => {
//         setDocument(payload);
//       })
//       .catch((err) => console.log(err))
//       .finally(() => setLoadingDocument(false));
//   }, [docId]);

//   React.useEffect(() => {
//     if (dict === undefined) return;
//     let res = {};
//     dict.forEach((el) => {
//       res[el.id] = {
//         name: el.name,
//         field: el.field,
//       };
//     });
//     setMapDict(res);
//   }, [dict]);
//   React.useEffect(() => {
//     if (table === undefined || dict === undefined) return;
//     let res = [[], [], [], [], [], [], [], []];
//     for (let i = 0; i < 6; i++) {
//       res[i].push({
//         id: "",
//         name: "Не выбрана",
//       });
//     }
//     for (const el of dict) {
//       res[el.dictId - 1].push({
//         id: el.id,
//         name: el.name,
//         field: el.field,
//       });
//     }
//     let initialState = createDataState();
//     // dataState || {
//     //   take: 8,
//     //   skip: 0,
//     // }

//     // setResult(initialState.result);
//     // setDataState(initialState.dataState);

//     setDictionary(res);
//   }, [table]);

//   React.useEffect(() => {
//     if (!document || document.length === 0) return;
//     let meta = [];
//     for (let k in document[0].meta) {
//       if (!["name", "sku", "price", "quant", "quantStock"].includes(k))
//         meta.push(k);
//     }
//     setFields(["name", "sku", "price", "quant", "quantStock", ...meta]);
//   }, [document]);

//   React.useEffect(() => {
//     if (
//       (mapDict === undefined || !document === undefined) &&
//       loadingOrder !== 3
//     )
//       return;
//     if (!document?.length) return;
//     let res = [];

//     try {
//       let obj = {};
//       quantOrderArr.forEach((el) => {
//         obj[el.priceRecordId] = el.quant;
//       });

//       document.forEach((_el, idx) => {
//         let el = {
//           priceDelta: _el.statistics.price,
//           quantDelta: _el.statistics.quant,
//           name: _el.name,
//           sku: _el.sku,
//           linkId: _el.linkId,
//           orderQuant:
//             quantOrderArr.length === 0 ? 0 : obj[_el.id] ? obj[_el.id] : 0,
//           price:
//             _el.statistics.price === 0
//               ? _el.price
//               : _el.statistics.price > 0
//               ? `${_el.price} (+${_el.statistics.price})`
//               : `${_el.price} (${_el.statistics.price})`,
//           quant:
//             _el.statistics.quant === 0
//               ? _el.quant
//               : _el.statistics.quant > 0
//               ? `${_el.quant} (+${_el.statistics.quant})`
//               : `${_el.quant} (${_el.statistics.quant})`,
//           quantStock: _el.quantStock,
//           id: _el.id,
//           status: "new",
//         };
//         for (let row in _el.meta) {
//           el[row] = _el.meta[row];
//         }
//         res.push(el);
//       });

//       setTable(res);
//       setLoadingOrder(0);
//     } catch (err) {
//       setTable();
//     }
//   }, [mapDict, document, loadingOrder]);

//   const getById = (id) => {
//     const element = table.find((el) => el.id === id);
//     return element;
//   };

//   const closeDialog = () => {
//     setLink(false);
//   };
//   const modifyToSend = (obj) => {
//     let res = [];
//     for (let key in obj) {
//       if (
//         key !== "name" &&
//         key !== "id" &&
//         key !== "code" &&
//         key !== "code" &&
//         key !== "doc_id"
//       ) {
//         res.push({ key, value: obj[key] });
//       }
//     }
//     return res;
//   };

//   const getVendorById = (id) => {
//     if (!vendor.current || !options) return "Не выбрано";
//     let res = options.find((option) => option.value === id)?.label;
//     return res ?? "Не выбрано";
//   };

//   const [editValue, setEditValue] = React.useState({});

//   const createDataState = (dataState) => {
//     return {
//       // result: process(table.slice(0), dataState),
//       result: table.slice(0),
//       // dataState: dataState,
//     };
//   };
//   const [result, setResult] = React.useState();
//   const [dataState, setDataState] = React.useState();
//   const [withChanges, setWithChanges] = React.useState(false);
//   const rowRender = (trElement, props) => {
//     const blue = { backgroundColor: "#d9d9e3" };
//     const red = {};
//     const trProps = {
//       style: active === props.dataItem.id ? blue : red,
//     };
//     return React.cloneElement(
//       trElement,
//       {
//         ...trProps,
//       },
//       trElement.props.children
//     );
//   };

//   const setOrderArr = (priceRecordId, value, status, id) => {
//     if (value !== 0)
//       setQuantOrderArr([
//         ...quantOrderArr.filter(
//           (order) => order.priceRecordId !== priceRecordId
//         ),
//         {
//           id: id ?? "",
//           priceRecordId,
//           quant: value ?? 0,
//           status,
//         },
//       ]);
//     else
//       setQuantOrderArr([
//         ...quantOrderArr.filter(
//           (order) => order.priceRecordId !== priceRecordId
//         ),
//         {
//           id: id ?? "",
//           priceRecordId,
//           quant: value ?? 0,
//           status: "deleted",
//         },
//       ]);
//   };

//   function itemChange(event) {
//     let value = event.value;
//     const name = event.dataItem.field;
//     let obj = quantOrderArr.find(
//       (el) => el.priceRecordId === event.dataItem.id
//     );

//     let status;
//     if (obj) {
//       status = obj.status;
//       if (status === "toEdit") {
//         status = "edited";
//       }
//     } else {
//       status = "new";
//     }
//     setOrderArr(event.dataItem.id, value, status, obj?.id);
//     const state = {
//       result: table.map((item) => {
//         if (item.id === event.dataItem.id) {
//           item[event.field || ""] = event.value;
//         }
//         return item;
//       }),
//       dataState,
//     };
//     setResult(state.result);
//   }

//   const [page, setPage] = React.useState({
//     skip: 0,
//     take: 30,
//   });

//   const frozen = useSelector((state) => state.settings.frozen);
//   const promise = React.useRef();
//   const counter = React.useRef(0);
//   const showPriceList = () => {
//     if (!vendor.current) return;
//     if (frozen)
//       if (
//         !window.confirm(
//           "Ваш заказ не будет сохранен, уверены, что хотите поменять поставщика?"
//         )
//       )
//         return;
//     dispatch(freeze(false));
//     setQuantOrderArr([]);
//     setTable();
//     setDocument([]);
//     setOrderId();
//     counter.current++;
//     promise.current?.abort();
//     promise.current = getDocument({ id: vendor.current });
//     setLoadingDocument(true);
//     promise.current
//       .unwrap()
//       .then((payload) => {
//         setDocument(payload);
//       })
//       .catch((err) => console.log(err))
//       .finally(() => setLoadingDocument(false));
//   };
//   const createOrder = () => {
//     _createOrder(vendor.current)
//       .unwrap()
//       .then((payload) => {
//         setOrderId(payload.id);
//       })
//       .catch((err) => console.error(err));
//   };

//   const [saveOrderReq] = useSaveOrderMutation();
//   const [saveEditOrderReq] = useSaveEditOrderMutation();
//   const getOrderRequest = async () => {
//     let payload = await getOrder(orderId).unwrap();
//     setQuantOrderArr(
//       quantOrderArr
//         .filter((item) => item.status !== "deleted")
//         .map((item) => ({
//           ...item,
//           status: "toEdit",
//           id: payload.find((el) => el.priceRecordId === item.priceRecordId).id,
//         }))
//     );
//   };
//   const [deleteRecordOrder] = useDeleteRecordOrderMutation();
//   const orderContentMutationArray = (status) => {
//     return quantOrderArr
//       .filter((el) => el.status === status)
//       .map((el) => ({
//         id: el.id,
//         priceRecordId: el.priceRecordId,
//         quant: el.quant,
//         orderId: orderId,
//       }));
//   };
//   const orderContentDeleteArray = () => {
//     return quantOrderArr
//       .filter((el) => el.status === "deleted")
//       .map((row) => ({
//         id: row.id,
//         orderId,
//         priceRecordId: row.priceRecordId,
//       }));
//   };

//   const saveOrder = async () => {
//     if (comment) {
//       const url = "http://194.87.239.231:55555/api/ordercomment";
//       const formData = new FormData();
//       formData.append("comment", comment);
//       formData.append("orderid", orderId);

//       const config = {
//         headers: {
//           "content-type": "multipart/form-data",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           User: `${localStorage.getItem("login")}`,
//         },
//       };
//       axios.put(url, formData, config).catch((err) => console.error(err));
//     }
//     try {
//       await saveOrderReq({ body: orderContentMutationArray("new") }).unwrap();
//       if (quantOrderArr.filter((el) => el.status === "edited").length)
//         await saveEditOrderReq({
//           body: orderContentMutationArray("edited"),
//         }).unwrap();
//       await deleteRecordOrder({ body: orderContentDeleteArray() }).unwrap();
//       await getOrderRequest();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const reset = () => {
//     setQuantOrderArr([]);
//     setTable();
//     setDocument([]);
//     setOrderId();
//     vendor.current = "";
//     setComment("");
//     dispatch(freeze(false));
//   };
//   const reset2 = () => {
//     setQuantOrderArr([]);
//     setOrderId();
//     setComment("");
//     dispatch(freeze(false));
//   };

//   const [active, setActive] = React.useState();
//   const clickVendor = (e) => {
//     const id_vendor = e.dataItem.id;
//     setActive(id_vendor);
//   };
//   const [link, setLink] = React.useState();
//   const [dataResult, setDataResult] = React.useState([]);
//   React.useEffect(() => {
//     if (!link) showPriceList();
//   }, [link]);
//   // const handleGridDataStateChange = (event) => {
//   //   setDateState(event.dataState);
//   // };
//   function pickVendor() {}
//   React.useEffect(() => {

//     if(document === undefined || document.length === 0  || !table || !result) return;
//     setDataResult(result.slice(page.skip, page.take + page.skip))
//   }, [table, result])
//   // const d = document === undefined || document.length === 0  || !table || !result
//   // ? []
//   // : result.slice(page.skip, page.take + page.skip)

//                 const dataStateChange = (event) => {
//                   setDataResult(process(dataResult, event.dataState));
//                   setDataState(event.dataState);
//                 };
//   return (
//     <div
//       style={{
//         minHeight: "500px",
//         marginTop: "80px",
//         marginLeft: "20px",
//       }}
//     >
//       {loadingDocument && (
//         <>
//           <TableSkeleton />
//         </>
//       )}
//       {table && result && !withChanges && (
//         <div className="wrap">
//           <Grid
//             resizable={true}
//             style={{
//               height: "500px",
//               marginTop: "10px",
//             }}
//             rowRender={rowRender}
//             onRowClick={clickVendor}
//             // data={
//             //   document === undefined || document.length === 0
//             //     ? []
//             //     : result.slice(page.skip, page.take + page.skip)
//             // }
//             scrollable={"virtual"}
//             skip={page.skip}
//             take={page.take}
//             rowHeight={56}
//             total={result.length}
//             onPageChange={(event) => {
//               setPage(event.page);
//             }}
//             onItemChange={itemChange}
//             dataItemKey={"id"}
//             data={
//               dataResult
//             }
//             {...dataState}

//             onDataStateChange={dataStateChange}
//             groupable={true}
//             sortable={true}
//           >
//             {columns}
//           </Grid>
//         </div>
//       )}

//       {/* {table && result && withChanges && (
//         <div className="wrap">
//           <Grid
//             rowRender={rowRender}
//             resizable={true}
//             style={{
//               width: "100%",
//               height: "500px",
//               marginTop: "10px",
//             }}
//             onRowClick={clickVendor}
//             data={result.filter(
//               (row) => row.quantDelta !== 0 || row.priceDelta !== 0
//             )}
//             onItemChange={itemChange}
//             dataItemKey={"id"}
//           >
//             {columns}
//           </Grid>
//         </div>
//       )} */}
//       {table &&
//         result &&
//         (!withChanges ? (
//           <Button
//             style={{
//               marginTop: "10px",
//             }}
//             onClick={() => {
//               setWithChanges(true);
//             }}
//           >
//             Показать изменения
//           </Button>
//         ) : (
//           <Button
//             style={{
//               marginTop: "10px",
//             }}
//             onClick={() => {
//               setWithChanges(false);
//             }}
//           >
//             Показать всю таблицу
//           </Button>
//         ))}
//       {link && (
//         <WindowLink
//           title={document?.find((row) => row.id === link)?.name}
//           priceRecordId={link}
//           closeDialog={closeDialog}
//         />
//       )}
//       {loading && (
//         <div
//           style={{
//             content: "",
//             position: "absolute",
//             top: "-179px",
//             left: 0,
//             background: "rgba(0,0,0,.5)",
//             zIndex: "1000",
//             height: "100vh",
//             display: "flex",
//             width: "100%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Loader size="large" type="infinite-spinner" />{" "}
//         </div>
//       )}
//       <div style={{ display: "flex" }}>
//         <div>
//           <div style={{ width: "500px", marginBottom: "10px" }}>
//             <div style={{ marginBottom: "10px" }}>Поставщик:</div>
//             <div>

//               <Selectrix
//                 multiple={false}
//                 materialize={true}
//                 options={options?.map((el) => ({ ...el, key: el.value }))}
//                 onChange={(e) => {
//                   onSelectVendor(e);
//                 }}
//               />
//             </div>
//             {/* <Button onClick={pickVendor}>Выбрать поставщика</Button> */}
//           </div>

//           <div>Выбрано: {getVendorById(vendor.current)}</div>
//           {!orderId && vendor.current && !!table?.length && (
//             <>
//               <Button onClick={createOrder}>Создать заказ</Button>
//             </>
//           )}
//           {orderId && (
//             <>
//               <Button onClick={saveOrder} style={{ marginRight: "10px" }}>
//                 Сохранить заказ
//               </Button>
//               <Button onClick={reset}>Новый заказ</Button>
//             </>
//           )}
//         </div>
//         <div
//           style={{
//             marginTop: "5px",
//             marginLeft: "20px",
//           }}
//         >
//           <textarea
//             style={{
//               maxHeight: "100px",
//               maxWidth: "500px",
//               minHeight: "40px",
//               minWidth: "120px",
//               padding: "5px",
//               border: "1px solid grey",
//             }}
//             placeholder="Комментарий"
//             value={comment}
//             onChange={(e) => {
//               setComment(e.target.value);
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PriceList;
