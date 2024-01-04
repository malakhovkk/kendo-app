import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSaveOrderMutation } from "../../features/apiSlice";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";
import { useLocation } from "react-router-dom";
import { RowDblClickEvent } from "devextreme/ui/data_grid";
// import { Popup } from "devextreme-react";
import {
  DataGrid,
  GroupPanel,
  // ...
  FilterRow,
  SearchPanel,
  Scrolling,
  Column,
  Editing,
  Selection,
} from "devextreme-react/data-grid";

import { Popup } from "devextreme-react/popup";

import { Button } from "devextreme-react/button";
// import {
//   SelectionState,
//   IntegratedSelection,
// } from '@devexpress/dx-react-grid';

import { useGetDocumentMutation } from "../../features/apiSlice";

import { createStore } from "devextreme-aspnet-data-nojquery";
import { arrowDownIcon, listOrderedIcon } from "@progress/kendo-svg-icons";

import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";
import { useCreateOrderMutation } from "../../features/apiSlice";
// import applyChanges from "devextreme/data/apply_changes";
import { useGetVendorsQuery } from "../../features/apiSlice";
import SelectBox from "devextreme-react/select-box";
import DropDownBox from "devextreme-react/drop-down-box";

import { List } from "devextreme-react/list";
import { toast } from "react-toastify";
import { returnFalse } from "@progress/kendo-react-inputs/dist/npm/maskedtextbox/utils";
import {
  useGetOrderMutation,
  useSaveEditOrderMutation,
  useDeleteRecordOrderMutation,
} from "../../features/apiSlice";
import { today } from "@progress/kendo-react-dateinputs";
import WindowLink from "../../components/WindowLink";
import { dblClick } from "@testing-library/user-event/dist/click";
import { useOrderCommentMutation } from "../../features/apiSlice";
import axios from "axios";
import { combineReducers } from "@reduxjs/toolkit";
import TextArea from "devextreme-react/text-area";

const serviceUrl = "http://194.87.239.231:55555/api/";
const notesLabel = { "aria-label": "Комментарий" };

const remoteDataSource = createStore({
  key: "ID",
  loadUrl: serviceUrl + "/Document/8f645ced-737e-11eb-82a1-001d7dd64d88",
  insertUrl: serviceUrl + "/InsertAction",
  updateUrl: serviceUrl + "/UpdateAction",
  deleteUrl: serviceUrl + "/DeleteAction",
});

const CommentInput = ({ onChange }) => {
  const [comm, setComm] = useState("");
  return (
    <textarea
      name="comment"
      value={comm}
      onChange={(e) => {
        onChange(e);
        setComm(e.target.value);
      }}
    ></textarea>
  );
};

function PriceList() {
  const [data, setData] = useState([]);
  const [orderId, setOrderId] = useState();
  // const { data, error: err, isLoading, refetch } = useGetVendorsQuery();
  const [getDocument] = useGetDocumentMutation();
  const [dataCol, setDataCol] = React.useState([]);
  const [saveOrderReq] = useSaveOrderMutation();
  const [getOrderReq] = useGetOrderMutation();
  const [editOrderReq] = useSaveEditOrderMutation();
  const [deleteOrderReq] = useDeleteRecordOrderMutation();
  // const [getV]
  const { data: vendorsList } = useGetVendorsQuery();
  console.error(vendorsList);
  const dataVendorsList = new ArrayStore({
    data: vendorsList,
    key: "ID",
  });
  const [vendorId, setVendorId] = useState("");
  const [listVendors, setListVendors] = useState([]);
  const { state } = useLocation();
  console.log(state);

  useEffect(() => {
    if (state) {
      //alert(1);
      setOrderId(state.idOrder);
      setVendorId(state.idVendor);
    }
  }, []);
  const ownerLabel = { "aria-label": "Owner" };

  const showSuccess = (msg) => {
    toast.success(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showError = (msg) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  //const []
  useEffect(() => {
    async function exec() {
      if (!vendorId) return;
      const res = await getDocument({
        id: vendorId,
      }).unwrap();
      //setData(test);
      let dl = [];
      console.log(res);
      if (!res[0]) {
        setData([]);
        return;
      }
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
      let res222 = JSON.parse(JSON.stringify(res));
      res222[0].statistics.price = 6;
      res222[1].statistics.quant = -3;

      setData(
        res222.map((_el, idx) => {
          return {
            "1C": _el.linkId ? "+" : "-",
            priceDelta:
              //  _el.price_delta,
              _el.statistics.price === 0
                ? ""
                : (_el.statistics.price > 0 ? "+" : "-") + _el.statistics.price,
            quantDelta:
              //  _el.quant_delta,
              _el.statistics.quant === 0
                ? ""
                : (_el.statistics.quant > 0 ? "+" : "-") + _el.statistics.quant,
            linkId: _el.linkId,
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
      console.warn(res222);
    }
    async function getListVendors() {
      // const listVendors = await getVendorsQueryReq().unwrap();

      console.log(listVendors);
    }
    exec();
  }, [vendorId]);
  // let fields = [
  //   {
  //     name: "price",
  //     alignment: "right"
  //   }
  // ]

  function getFormat(field) {
    let curencyFields = ["price"];
    let intFields = ["quant", "quant_stock", "orderQuant"];

    let res = { mask: "", alignment: "left" };

    if (curencyFields.includes(field)) {
      res.mask = "##0.00";
      res.alignment = "right";
    } else {
      if (intFields.includes(field)) res.alignment = "right";
    }

    return res;
  }
  // const vendorsListToDisplay = vendorsList.map((el) => {
  //   return {};
  // });
  const ignore = (d, fields) => {
    return d.filter((el) => !fields.includes(el));
  };
  const columnsFixed = [
    "sku",
    "name",
    "quant",
    "quant_stock",
    "priceDelta",
    "quantDelta",
  ];
  console.log(dataCol);
  let isNext = false;
  let columns1 = [];
  if (dataCol.length)
    dataCol.forEach((el) => {
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
      if (el.name === "quant_stock") {
        if (orderId)
          columns1 = [
            ...columns1,
            <Column
              key={"orderQuant"}
              dataField={"orderQuant"}
              format={"right"}
              allowEditing={true}
              caption="Кол-во в заказе"
              fixed={true}
            />,
            <Column
              key={el.name}
              dataField={el.name}
              format={el.format}
              alignment={alignment}
              allowEditing={false}
              caption={el.caption}
              fixed={columnsFixed.includes(el.name)}
            />,
          ];
        else
          columns1 = [
            ...columns1,

            <Column
              key={el.name}
              dataField={el.name}
              format={el.format}
              alignment={alignment}
              allowEditing={false}
              caption={el.caption}
              fixed={columnsFixed.includes(el.name)}
            />,
          ];
      } else
        columns1.push(
          <Column
            key={el.name}
            dataField={el.name}
            format={el.format}
            alignment={alignment}
            allowEditing={false}
            caption={el.caption}
            fixed={columnsFixed.includes(el.name)}
          />
        );
    });
  columns1 = [
    <Column
      key={"1C"}
      fixed={true}
      dataField={"1C"}
      allowEditing={false}
      caption={"1C"}
    />,
    ...columns1,
  ];
  console.log(columns1);
  const onChangesChange = (changes) => {
    // setChanges(dispatch, changes);
    console.warn(changes);
  };

  function onSelectionChanged(data) {
    console.log(data);
  }
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);
  const [selection, setSelection] = useState([]);
  const [array, setArray] = useState([]);
  const [cartMap, setCartMap] = useState({}); // {<"id"> : {}}

  useEffect(() => {
    if (data) setArray(data);
  }, [data]);

  // store: new ArrayStore({
  //   data: data,
  //   key: "id",
  // }),

  const selectionChanged = (data) => {
    // !!!!!!!!!
    console.log(data);
    setSelectedItemKeys({
      selectedItemKeys: data.selectedItemKeys,
    });
  };
  const [cart, setCart] = useState([]);

  useEffect(() => {
    console.log(array);

    //dataSource = [{ orderQuant: 5 }];
    console.log(array, array.length);
    // if (array && array.length) alert(array[0].orderQuant);
    setArray(
      array.map((el) => {
        if (el.orderQuant == "0") {
          console.log(el);
          return { ...el, orderQuant: "" };
        }
        return el;
      })
    );
    console.log(array);
    JSON.parse(JSON.stringify(array));
  }, []);

  function isNumber(str) {
    return !isNaN(str);
  }
  const updateRef = useRef(false);
  function updateRow(e) {
    let sh = [];
    console.log(array);
    console.log(sh);
    console.error(e);
    console.log(cart);
    const id = e.oldData.id;
    const quant = e.newData.orderQuant;
    const maxQuant = e.oldData.quant;
    const name = e.oldData.name;
    if (!isNumber(quant)) {
      alert("Введите число");
      setArray([...array.filter((el) => el.id !== id)]);
      return;
    }
    console.log(Number(maxQuant) < Number(quant));
    console.log(maxQuant, quant);
    if (Number(maxQuant) < Number(quant)) {
      alert("Введенное число больше максимального");
      setArray([...array.filter((el) => el.id !== id)]);
      return;
    }
    console.log({ quant, name });
    let cm = { ...cartMap };
    cm[id] = quant;
    //if (quant == 0) return;
    let resCart = [...showCart.filter((el) => el.id !== id)];
    if (quant != "0") {
      console.log(quant);
      resCart.push({ id, name, quant });
    }
    setShowCart(resCart);
    // updateRef.current = true;
  }

  useEffect(() => {
    let sh = [];
    setInterval(() => {
      //alert();
    }, 3000);
  }, []);

  console.log(cart);

  String.prototype.includesId = (array, id) => {
    array.forEach((el) => {
      if (el.PriceRecordId === id) return true;
    });
    return false;
  };
  const onCellDblClick = function (e) {
    if (e.data) {
      //alert('onCellDblClick');
      // selected = e.data;
      // popup.show();
    }
  };
  function splitArr(arrayModified) {
    let arrPOST = [],
      arrPUT = [],
      arrDELETE = [];
    const toDelete = [];
    arrayModified.forEach((el) => {
      //let id = cartMap[el.priceRecordId]?.id;
      let id = "";
      let q;
      let pid = "";
      //consolee;
      for (let key in cartMap) {
        if (cartMap[key].priceRecordId === el.priceRecordId) {
          id = key;
          pid = el.priceRecordId;
          q = cartMap[key].quant;
          break;
        }
      }
      if (el.quant == "0") toDelete.push(pid);
      console.error(q);
      el.id = id;
      if (el.id !== "" && el.quant == "0") {
        arrDELETE = [...arrDELETE, { ...el, id }];
        if (el.quant == "0") {
          delete cartMap[id];
        }
        // let new_cart = cartMap;
        // delete cartMap[el.priceRecordId];
        // setCartMap(el.priceRecordId);
      } else {
        if (el.id === "" && el.quant != "0") {
          arrPOST = [...arrPOST, { ...el, id }];
        } else if (q != el.quant && el.quant != "0") {
          arrPUT = [...arrPUT, { ...el, id }];
        } else {
          delete cartMap[id];
          setArray(array.filter((el) => el.id !== id));
        }
      }
    });
    setArray(array.filter((el) => !toDelete.includes(el.id)));
    return [arrPOST, arrPUT, arrDELETE];
    //if(    )
  }
  async function saveRequest() {
    if (!orderId) {
      showError("Необходимо создать заказ!");
      return;
    }
    console.log(Object.keys(cartMap).length);
    const [arrPOST, arrPUT, arrDELETE] = splitArr(
      array
        .filter((el) => el?.orderQuant)
        .map((el) => {
          return {
            id: "",
            orderId,
            priceRecordId: el.id,
            quant: el.orderQuant,
          };
        })
    );
    try {
      if (arrPOST.length) await saveOrderReq({ body: arrPOST }).unwrap();
    } catch (e) {
      return;
    }

    try {
      if (arrPUT.length) await editOrderReq({ body: arrPUT }).unwrap();
    } catch (e) {
      return;
    }

    try {
      if (arrDELETE.length) await deleteOrderReq({ body: arrDELETE }).unwrap();
    } catch (e) {
      return;
    }
    let new_cart = {};
    try {
      (await getOrderReq(orderId).unwrap()).forEach((el) => {
        new_cart[el.id] = el;
      });
      setArray(array.filter((el) => el.orderQuant != "0"));
    } catch (err) {
      console.log(err);
    }
    console.log(new_cart);
    setCartMap(new_cart);
    showSuccess("Успешно!");
  }

  const [createOrderReq] = useCreateOrderMutation();
  const [dateInfo, setDateInfo] = useState("");
  async function createOrder() {
    try {
      const { id, dateCreate, number, comment } = await createOrderReq(
        vendorId
      ).unwrap();
      setOrderId(id);
      console.log(dateCreate);
      console.log(number);
      var date = new Date(dateCreate);

      var options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
        timezone: "UTC",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };

      setDateInfo(
        "Заказ № " + number + " от " + date.toLocaleString("ru", options)
      );
      setPopUpInfo({
        number,
        date: date.toLocaleString("ru", options),
        comment,
      });
      console.log(
        "Заказ с номером " + number + ", " + date.toLocaleString("ru", options)
      );
      showSuccess("Заказ успешно создан!");
      console.log(id);
    } catch (e) {
      showError("Ошибка!");
    }
  }

  const selectVendor = (e) => {
    console.log(e.target.value);
    setVendorId(e.target.value);
  };
  const sendRequest = (e) => {};
  useEffect(() => {
    console.log(orderId);
  }, [orderId]);

  const [linkPriceRecordId, setLinkPriceRecordId] = useState("");
  const [linkName, setLinkName] = useState("");

  const snglClick = (e) => {
    console.log(e);
    setLinkPriceRecordId(e.data.id);
    setLinkName(e.data.name);
  };

  const isPopUp = () => {
    setLinkPriceRecordId("");
    setLinkName("");
  };

  const [popUpInfo, setPopUpInfo] = useState({ comment: "" });
  const [visiblePopUpInfo, setVisiblePopUpInfo] = useState(false);

  const [showPopUp, setShowPopUp] = useState(true);

  const [orderInfo, setOrderInfo] = useState({});
  const [shopInfo, setShopInfo] = useState({});

  const dblClick = (e) => {
    console.log(e);
    if (e.column.dataField === "1C") {
      setLinkPriceRecordId(e.data.id);
      setLinkName(e.data.name);

      return;
    }
    if (e.column.dataField === "name") {
      setShopInfo({ name: "12", address: "Садовая улица 17/2" });
      setShopInfoPopUp(true);
      setLinkPriceRecordId();
      setLinkName();
    }
  };

  const renderContent = () => {
    let res = [];
    let popUpInfo;
    for (let key in shopInfo) {
      res.push(
        <div>
          {" "}
          {key}: {shopInfo[key]}
        </div>
      );
    }

    return <>{res}</>;
  };
  console.log(cart);
  const [showCart, setShowCart] = useState([]);
  const [extraInfo, setExtraInfo] = useState({});
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [orderCommentReq] = useOrderCommentMutation();
  // useEffect(() => {
  //   let sh = [];
  //   alert(1);
  //   if (!array) return;

  // }, [array]);

  const clickExtraInfo = () => {
    setShowExtraInfo(true);
  };

  const comm = useRef("");
  const popupinfo = useRef("");
  const [commArea, setCommArea] = useState("");

  const extraInfoPopUp = () => {
    //console.log("extraInfo ", extraInfo);
    return (
      <div>
        Номер заказа: {popUpInfo.number}
        <br />
        Дата создания: {popUpInfo.date}
        <br />
        {/* <TextArea
            height={90}
            value={commArea}
            // readOnly={true}
            inputAttr={notesLabel}
            valueChangeEvent={eventValue}
          /> */}
        {/* <TextArea className="dx-field-value" inputAttr={notesLabel} height={80} defaultValue="" /> */}
        <CommentInput onChange={(e) => (popupinfo.current = e.target.value)} />
        {/* {popUpInfo.comment} */}
        <br />
        <Button
          onClick={(e) => {
            //alert();
            const url = "http://194.87.239.231:55555/api/orderComment";

            const formData = new FormData();
            formData.append("OrderId", orderId);
            formData.append("Comment", popupinfo.current);

            // formData.append('fileName', file.name);
            const config = {
              headers: {
                "content-type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                User: `${localStorage.getItem("login")}`,
              },
            };
            try {
              axios.put(url, formData, config);
            } catch (e) {
              console.log(e);
            }
          }}
        >
          Сохранить комментарий
        </Button>
        <br />
      </div>
    );
  };

  const [shopInfoPopUp, setShopInfoPopUp] = useState("");
  return (
    <>
      {visiblePopUpInfo && (
        <Popup
          visible={true}
          onHiding={() => setVisiblePopUpInfo(false)}
          hideOnOutsideClick={true}
          closeOnClick={() => setVisiblePopUpInfo(false)}
          contentRender={extraInfoPopUp}
          width={500}
          height={400}
        />
      )}
      {shopInfoPopUp ? (
        <Popup
          visible={true}
          onHiding={() => setShopInfoPopUp(false)}
          hideOnOutsideClick={true}
          closeOnClick={() => setShopInfoPopUp(false)}
          contentRender={renderContent}
          width={500}
          height={400}
        />
      ) : null}

      {/* {Object.keys(popUpInfo).length !== 0 ? (
        <Popup
          visible={true}
          onHiding={() => setPopUpInfo(false)}
          hideOnOutsideClick={true}
          closeOnClick={() => setPopUpInfo(false)}
          contentRender={renderContent}
          width={500}
          height={400}
        />
      ) : null}
      {showPopUp && (
        <Popup
          visible={true}
          onHiding={() => setShowPopUp(false)}
          hideOnOutsideClick={true}
          closeOnClick={() => setShowPopUp(false)}
          contentRender={extraInfoPopUp}
          width={500}
          height={400}
        />
      )} */}
      {/* <Popup visible={true} contentRender={renderContent} /> */}
      <div style={{ marginTop: "100px", width: "1400px" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {orderId && (
            <Button
              style={{ marginRight: "20px" }}
              onClick={() => setVisiblePopUpInfo(true)}
            >
              Информация о заказе
            </Button>
          )}
          <div>{dateInfo}</div>
        </div>
        <br />
        <select
          onChange={selectVendor}
          // value={orderId.current}
          name="pets"
          id="pet-select"
        >
          {/* <option value="">Выберите поставщика</option> */}
          {vendorsList &&
            vendorsList.map((vendor) => (
              <option value={vendor.id}>{vendor.name}</option>
            ))}
        </select>
        {linkPriceRecordId ? (
          <WindowLink
            closeDialog={isPopUp}
            priceRecordId={linkPriceRecordId}
            title={linkName}
          />
        ) : null}
        <DataGrid
          dataSource={array}
          allowColumnReordering={true}
          allowColumnResizing={true}
          height={800}
          columnResizingMode={"widget"}
          columnAutoWidth={true}
          onRowUpdating={updateRow}
          onCellClick={dblClick}
          hoverStateEnabled={true}
          selection={{ mode: "single" }}
        >
          {console.log(orderId)}
          {orderId ? (
            <Editing
              onChangesChange={onChangesChange}
              mode="row"
              allowUpdating={true}
            />
          ) : null}
          {columns1}

          <Scrolling columnRenderingMode="virtual" mode="infinite" />
          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          <GroupPanel visible={true} />
        </DataGrid>
      </div>
      {!orderId ? <Button text="Создать заказ" onClick={createOrder} /> : null}
      {orderId ? (
        <>
          <Button text="Сохранить" onClick={saveRequest} />
          <Button text="Отправить" onClick={sendRequest} />
        </>
      ) : null}
      <br />
      <br />
      <div>Состав заказа:</div>
      <DataGrid dataSource={showCart}>
        <Column
          key={"name"}
          dataField={"name"}
          format={"right"}
          allowEditing={true}
          caption="Название"
          fixed={true}
        />
        <Column
          key={"quant"}
          dataField={"quant"}
          allowEditing={true}
          caption="Кол-во в заказе"
          fixed={true}
        />
      </DataGrid>
    </>
  );
}

export default PriceList;
