import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSaveOrderMutation } from "../../features/apiSlice";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";
import { useLocation } from "react-router-dom";
import { RowDblClickEvent } from "devextreme/ui/data_grid";
import { Popup } from "devextreme-react";
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

  function updateRow(e) {
    console.error(e);
    console.log(cart);
    const id = e.oldData.id;
    const quant = e.newData.orderQuant;
    let cm = { ...cartMap };
    cm[id] = quant;
  }
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
    alert(1);
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
        if (el.id === "") {
          arrPOST = [...arrPOST, { ...el, id }];
        } else if (q != el.quant) {
          arrPUT = [...arrPUT, { ...el, id }];
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
    } catch (err) {
      console.log(err);
    }
    console.log(new_cart);
    setCartMap(new_cart);
    showSuccess("Успешно!");
  }

  const [createOrderReq] = useCreateOrderMutation();
  async function createOrder() {
    try {
      const { id } = await createOrderReq(vendorId).unwrap();
      setOrderId(id);
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

  const [showPopUp, setShowPopUp] = useState(true);
  return (
    <>
      {/* <Popup visible={true} contentRender={renderContent} /> */}
      <div style={{ marginTop: "100px", width: "1400px" }}>
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
          //onCellDblClick={dblClick}
          onCellClick={snglClick}
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
    </>
  );
}

export default PriceList;
