import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSaveOrderMutation } from "../../features/apiSlice";
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";
import { useLocation } from "react-router-dom";

import {
  DataGrid,
  GroupPanel,
  FilterRow,
  SearchPanel,
  Scrolling,
  Column,
  Editing,
} from "devextreme-react/data-grid";

import { Popup } from "devextreme-react/popup";

import { Button } from "devextreme-react/button";
import { useGetDocumentMutation } from "../../features/apiSlice";

import { useCreateOrderMutation } from "../../features/apiSlice";

import { useGetVendorsQuery } from "../../features/apiSlice";

import { toast } from "react-toastify";

import {
  useGetOrderMutation,
  useSaveEditOrderMutation,
  useDeleteRecordOrderMutation,
} from "../../features/apiSlice";

import WindowLink from "../../components/WindowLink";

import axios from "axios";

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
  const [getDocument] = useGetDocumentMutation();
  const [dataCol, setDataCol] = React.useState([]);
  const [saveOrderReq] = useSaveOrderMutation();
  const [getOrderReq] = useGetOrderMutation();
  const [editOrderReq] = useSaveEditOrderMutation();
  const [deleteOrderReq] = useDeleteRecordOrderMutation();

  const { data: vendorsList } = useGetVendorsQuery();

  const [vendorId, setVendorId] = useState("");
  const { state } = useLocation();
  console.log(state);

  useEffect(() => {
    if (state) {
      setOrderId(state.idOrder);
      setVendorId(state.idVendor);
    }
  }, []);

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

  useEffect(() => {
    async function exec() {
      if (!vendorId) return;
      const res = await getDocument({
        id: vendorId,
      }).unwrap();
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

      setDataCol(dl.filter((el) => el !== undefined));

      let res222 = JSON.parse(JSON.stringify(res));
      res222[0].statistics.price = 6;
      res222[1].statistics.quant = -3;

      setData(
        res222.map((_el) => {
          return {
            "1C": _el.linkId ? "+" : "-",
            priceDelta:
              _el.statistics.price === 0
                ? ""
                : (_el.statistics.price > 0 ? "+" : "-") + _el.statistics.price,
            quantDelta:
              _el.statistics.quant === 0
                ? ""
                : (_el.statistics.quant > 0 ? "+" : "-") + _el.statistics.quant,
            linkId: _el.linkId,
            priceDelta: _el.statistics.price,
            quantDelta: _el.statistics.quant,
            name: _el.name,
            sku: _el.sku,
            linkId: _el.linkId,
            price: _el.price,
            quant: _el.quant,
            quantStock: _el.quantStock,
            id: _el.id,
            ..._el.meta,
            status: "new",
          };
        })
      );
      console.warn(res222);
    }
    exec();
  }, [vendorId]);

  const columnsFixed = [
    "sku",
    "name",
    "quant",
    "quant_stock",
    "priceDelta",
    "quantDelta",
  ];
  console.log(dataCol);
  let columns1 = [];
  if (dataCol.length)
    dataCol.forEach((el) => {
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

  const [array, setArray] = useState([]);
  const [cartMap, setCartMap] = useState({}); // {<"id"> : {}}

  useEffect(() => {
    if (data) setArray(data);
  }, [data]);

  useEffect(() => {
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
    let resCart = [...showCart.filter((el) => el.id !== id)];
    if (quant != "0") {
      console.log(quant);
      resCart.push({ id, name, quant });
    }
    setShowCart(resCart);
  }

  String.prototype.includesId = (array, id) => {
    array.forEach((el) => {
      if (el.PriceRecordId === id) return true;
    });
    return false;
  };

  function splitArr(arrayModified) {
    let arrPOST = [],
      arrPUT = [],
      arrDELETE = [];
    const toDelete = [];
    arrayModified.forEach((el) => {
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
      console.error(array.filter((el) => el.orderQuant != "0"));
    } catch (err) {
      console.log(err);
    }
    console.error(new_cart);
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

  const [showCart, setShowCart] = useState([]);
  const popupinfo = useRef("");

  const extraInfoPopUp = () => {
    return (
      <div>
        Номер заказа: {popUpInfo.number}
        <br />
        Дата создания: {popUpInfo.date}
        <br />
        <CommentInput onChange={(e) => (popupinfo.current = e.target.value)} />
        <br />
        <Button
          onClick={(e) => {
            const url = "http://194.87.239.231:55555/api/orderComment";

            const formData = new FormData();
            formData.append("OrderId", orderId);
            formData.append("Comment", popupinfo.current);

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
