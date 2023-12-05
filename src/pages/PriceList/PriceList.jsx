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
  Selection,
} from "devextreme-react/data-grid";

// import {
//   SelectionState,
//   IntegratedSelection,
// } from '@devexpress/dx-react-grid';

import { useGetDocumentMutation } from "../../features/apiSlice";

import { createStore } from "devextreme-aspnet-data-nojquery";
import { arrowDownIcon } from "@progress/kendo-svg-icons";

import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";

// import applyChanges from "devextreme/data/apply_changes";

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
    return d.filter((el) => !fields.includes(el));
  };

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
              caption={el.caption}
            />
          );
        }),
        <Column
          key={"orderQuant"}
          dataField={"orderQuant"}
          format={"right"}
          allowEditing={true}
          caption="Количество в заказе"
        />,
      ]
    : [];

  const onChangesChange = React.useCallback((changes) => {
    // setChanges(dispatch, changes);
    console.log(changes);
  }, []);

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

  return (
    <div style={{ marginTop: "100px" }}>
      <DataGrid
        dataSource={dataSource}
        allowColumnReordering={true}
        allowColumnResizing={true}
        height={800}
        columnResizingMode={"widget"}
        // columnMinWidth={150}
        columnAutoWidth={true}
        selectedRowKeys={selectedItemKeys}
        onSelectionChanged={selectionChanged}
      >
        <Selection mode="multiple" />

        {columns1}

        <Editing
          onChangesChange={onChangesChange}
          mode="row"
          allowUpdating={true}
        />

        <Scrolling columnRenderingMode="virtual" mode="infinite" />
        <FilterRow visible={true} />
        <SearchPanel visible={true} />
        <GroupPanel visible={true} />
      </DataGrid>
    </div>
  );
}

export default PriceList;
