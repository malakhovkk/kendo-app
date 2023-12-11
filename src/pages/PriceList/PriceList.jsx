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
      orderId.current = state.idOrder;
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

  const dataSource = new DataSource({
    store: new ArrayStore({
      data: data,
      key: "id",
    }),
  });
  const selectionChanged = (data) => {
    // !!!!!!!!!
    console.log(data);
    setSelectedItemKeys({
      selectedItemKeys: data.selectedItemKeys,
    });
  };
  const [cart, setCart] = useState({});
  const orderId = useRef();
  function updateRow(e) {
    console.error(e);
    setCart({ ...cart, [e.key]: e.newData.orderQuant });
  }
  console.log(cart);
  async function sendRequest() {
    if (!orderId.current) {
      showError("Необходимо создать заказ!");
      return;
    }
    const toSend = [];
    for (var key in cart) {
      if (cart.hasOwnProperty(key)) {
        toSend.push({
          id: "",
          PriceRecordId: key,
          OrderId: orderId.current,
          Quant: cart[key],
        });
      }
    }
    try {
      await saveOrderReq({ body: toSend }).unwrap();
      showSuccess("Заказ успешно создан!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      showSuccess("Ошибка при создании заказа!");
    }
  }
  const [createOrderReq] = useCreateOrderMutation();
  async function createOrder() {
    try {
      const { id } = await createOrderReq(vendorId).unwrap();

      orderId.current = id;
      showSuccess("Заказ успешно создан!");
      console.log(id);
    } catch (e) {
      showError("Ошибка!");
    }
  }
  const simpleProductLabel = { "aria-label": "Simple Product" };
  const treeDataSource = [
    {
      ID: 1,
      name: "Stores",
      expanded: true,
    },
    {
      ID: "1_1",
      categoryId: 1,
      name: "Super Mart of the West",
      expanded: true,
    },
    {
      ID: "1_1_1",
      categoryId: "1_1",
      name: "Video Players",
    },
    {
      ID: "1_1_1_1",
      categoryId: "1_1_1",
      name: "HD Video Player",
      price: 220,
    },
    {
      ID: "1_1_1_2",
      categoryId: "1_1_1",
      name: "SuperHD Video Player",
      price: 270,
    },
    {
      ID: "1_1_2",
      categoryId: "1_1",
      name: "Televisions",
      expanded: true,
    },
    {
      ID: "1_1_2_1",
      categoryId: "1_1_2",
      name: "SuperLCD 42",
      price: 1200,
    },
    {
      ID: "1_1_2_2",
      categoryId: "1_1_2",
      name: "SuperLED 42",
      price: 1450,
    },
    {
      ID: "1_1_2_3",
      categoryId: "1_1_2",
      name: "SuperLED 50",
      price: 1600,
    },
    {
      ID: "1_1_2_4",
      categoryId: "1_1_2",
      name: "SuperLCD 55",
      price: 1750,
    },
    {
      ID: "1_1_2_5",
      categoryId: "1_1_2",
      name: "SuperLCD 70",
      price: 4000,
    },
    {
      ID: "1_1_3",
      categoryId: "1_1",
      name: "Monitors",
    },
    {
      ID: "1_1_3_1",
      categoryId: "1_1_3",
      name: '19"',
    },
    {
      ID: "1_1_3_1_1",
      categoryId: "1_1_3_1",
      name: "DesktopLCD 19",
      price: 160,
    },
    {
      ID: "1_1_4",
      categoryId: "1_1",
      name: "Projectors",
    },
    {
      ID: "1_1_4_1",
      categoryId: "1_1_4",
      name: "Projector Plus",
      price: 550,
    },
    {
      ID: "1_1_4_2",
      categoryId: "1_1_4",
      name: "Projector PlusHD",
      price: 750,
    },
  ];
  const [gridBoxValue, setGridBoxValue] = useState("");
  const gridDataSource = [
    {
      ID: 1,
      CompanyName: "Premier Buy",
      Address: "7601 Penn Avenue South",
      City: "Richfield",
      State: "Minnesota",
      Zipcode: 55423,
      Phone: "(612) 291-1000",
      Fax: "(612) 291-2001",
      Website: "http://www.nowebsitepremierbuy.com",
    },
    {
      ID: 2,
      CompanyName: "ElectrixMax",
      Address: "263 Shuman Blvd",
      City: "Naperville",
      State: "Illinois",
      Zipcode: 60563,
      Phone: "(630) 438-7800",
      Fax: "(630) 438-7801",
      Website: "http://www.nowebsiteelectrixmax.com",
    },
    {
      ID: 3,
      CompanyName: "Video Emporium",
      Address: "1201 Elm Street",
      City: "Dallas",
      State: "Texas",
      Zipcode: 75270,
      Phone: "(214) 854-3000",
      Fax: "(214) 854-3001",
      Website: "http://www.nowebsitevideoemporium.com",
    },
    {
      ID: 4,
      CompanyName: "Screen Shop",
      Address: "1000 Lowes Blvd",
      City: "Mooresville",
      State: "North Carolina",
      Zipcode: 28117,
      Phone: "(800) 445-6937",
      Fax: "(800) 445-6938",
      Website: "http://www.nowebsitescreenshop.com",
    },
    {
      ID: 5,
      CompanyName: "Braeburn",
      Address: "1 Infinite Loop",
      City: "Cupertino",
      State: "California",
      Zipcode: 95014,
      Phone: "(408) 996-1010",
      Fax: "(408) 996-1012",
      Website: "http://www.nowebsitebraeburn.com",
    },
    {
      ID: 6,
      CompanyName: "PriceCo",
      Address: "30 Hunter Lane",
      City: "Camp Hill",
      State: "Pennsylvania",
      Zipcode: 17011,
      Phone: "(717) 761-2633",
      Fax: "(717) 761-2334",
      Website: "http://www.nowebsitepriceco.com",
    },
    {
      ID: 7,
      CompanyName: "Ultimate Gadget",
      Address: "1557 Watson Blvd",
      City: "Warner Robbins",
      State: "Georgia",
      Zipcode: 31093,
      Phone: "(995) 623-6785",
      Fax: "(995) 623-6786",
      Website: "http://www.nowebsiteultimategadget.com",
    },
    {
      ID: 8,
      CompanyName: "EZ Stop",
      Address: "618 Michillinda Ave.",
      City: "Arcadia",
      State: "California",
      Zipcode: 91007,
      Phone: "(626) 265-8632",
      Fax: "(626) 265-8633",
      Website: "http://www.nowebsiteezstop.com",
    },
    {
      ID: 9,
      CompanyName: "Clicker",
      Address: "1100 W. Artesia Blvd.",
      City: "Compton",
      State: "California",
      Zipcode: 90220,
      Phone: "(310) 884-9000",
      Fax: "(310) 884-9001",
      Website: "http://www.nowebsiteclicker.com",
    },
    {
      ID: 10,
      CompanyName: "Store of America",
      Address: "2401 Utah Ave. South",
      City: "Seattle",
      State: "Washington",
      Zipcode: 98134,
      Phone: "(206) 447-1575",
      Fax: "(206) 447-1576",
      Website: "http://www.nowebsiteamerica.com",
    },
    {
      ID: 11,
      CompanyName: "Zone Toys",
      Address: "1945 S Cienega Boulevard",
      City: "Los Angeles",
      State: "California",
      Zipcode: 90034,
      Phone: "(310) 237-5642",
      Fax: "(310) 237-5643",
      Website: "http://www.nowebsitezonetoys.com",
    },
    {
      ID: 12,
      CompanyName: "ACME",
      Address: "2525 E El Segundo Blvd",
      City: "El Segundo",
      State: "California",
      Zipcode: 90245,
      Phone: "(310) 536-0611",
      Fax: "(310) 536-0612",
      Website: "http://www.nowebsiteacme.com",
    },
  ];
  // const [gridBox]
  function syncDataGridSelection(e) {
    setGridBoxValue(e.value || []);
  }
  function dataGridRender() {
    return (
      <DataGrid
        height={345}
        dataSource={gridDataSource}
        columns={["City"]}
        hoverStateEnabled={true}
        selectedRowKeys={gridBoxValue}
        onSelectionChanged={dataGridOnSelectionChanged}
      >
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        {/* <Paging enabled={true} pageSize={10} /> */}
        <FilterRow visible={true} />
      </DataGrid>
    );
  }

  function dataGridOnSelectionChanged(e) {
    setGridBoxValue((e.selectedRowKeys.length && e.selectedRowKeys) || []);
  }
  const [isGridBoxOpened, setIsGridBoxOpened] = useState("");
  function syncDataGridSelection(e) {
    setGridBoxValue(e.value);
  }
  function onGridBoxOpened(e) {
    if (e.name === "opened") {
      setIsGridBoxOpened(e.value);
    }
  }
  const [val, setVal] = useState("1_1");

  const fruits = ["Apples", "Oranges", "Lemons", "Pears", "Pineapples"];

  const selectVendor = (e) => {
    console.log(e.target.value);
    setVendorId(e.target.value);
  };

  return (
    <>
      <div style={{ marginTop: "100px", width: "1400px" }}>
        <select
          onChange={selectVendor}
          value={orderId.current}
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
          dataSource={dataSource}
          allowColumnReordering={true}
          allowColumnResizing={true}
          height={800}
          columnResizingMode={"widget"}
          // columnMinWidth={150}
          columnAutoWidth={true}
          onRowUpdating={updateRow}
        >
          <Editing
            onChangesChange={onChangesChange}
            mode="row"
            allowUpdating={true}
          />
          {columns1}

          <Scrolling columnRenderingMode="virtual" mode="infinite" />
          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          <GroupPanel visible={true} />
        </DataGrid>
      </div>
      <Button text="Отправить" onClick={sendRequest} />
      <Button text="Создать заказ" onClick={createOrder} />
    </>
  );
}

export default PriceList;
