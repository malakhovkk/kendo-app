import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSaveOrderMutation } from "../../features/apiSlice";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";
import { useLocation } from "react-router-dom";
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
  const columnsFixed = ["sku", "name", "quant", "quant_stock"];
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
          <Column
            key={"orderQuant"}
            dataField={"orderQuant"}
            format={"right"}
            allowEditing={true}
            caption="Кол-во в заказе"
            fixed={true}
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

  function updateRow(e) {
    console.error(e);
    console.log(cart);
    setCart([
      ...cart.filter((el) => el.PriceRecordId !== e.oldData.id),
      {
        id: "",
        PriceRecordId: e.oldData.id,
        OrderId: orderId,
        Quant: parseInt(e.newData.orderQuant),
      },
    ]);
    console.log(array);
    if (e.newData.orderQuant == "0")
      setArray([
        ...array.filter((el) => el.id !== e.oldData.id),
        array.map((el) => {
          if (el.orderQuant == "0" && el.PriceRecordId === e.oldData.id) {
            console.log(el);
            return { ...el, orderQuant: "" };
          }
          return el;
        }),
      ]);

    //setCart([ ...cart, {[e.key]: e.newData.orderQuant,} ]);
  }
  console.log(cart);
  async function saveRequest() {
    if (!orderId) {
      showError("Необходимо создать заказ!");
      return;
    }
    const toSend = [];
    // for (var key in cart) {
    //   if (cart.hasOwnProperty(key)) {
    //     toSend.push({
    //       id: "",
    //       PriceRecordId: key,
    //       OrderId: orderId.current,
    //       Quant: cart[key],
    //     });
    //   }
    // }
    try {
      // await saveOrderReq({ body: toSend }).unwrap();
      console.log(cart);
      await saveOrderReq({ body: cart }).unwrap();
      showSuccess("Заказ успешно создан!");
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
    } catch (err) {
      showError("Ошибка при создании заказа!");
    }
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

  const [isGridBoxOpened, setIsGridBoxOpened] = useState("");

  const [val, setVal] = useState("1_1");

  const fruits = ["Apples", "Oranges", "Lemons", "Pears", "Pineapples"];

  const selectVendor = (e) => {
    console.log(e.target.value);
    setVendorId(e.target.value);
  };
  const sendRequest = (e) => {};
  useEffect(() => {
    console.log(orderId);
  }, [orderId]);

  return (
    <>
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

        <DataGrid
          dataSource={array}
          allowColumnReordering={true}
          allowColumnResizing={true}
          height={800}
          columnResizingMode={"widget"}
          // columnMinWidth={150}
          columnAutoWidth={true}
          onRowUpdating={updateRow}
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
      <Button text="Создать заказ" onClick={createOrder} />
      <Button text="Сохранить" onClick={saveRequest} />
      <Button text="Отправить" onClick={sendRequest} />
    </>
  );
}

export default PriceList;
