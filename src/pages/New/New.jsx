import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { Input, Switch } from "@progress/kendo-react-inputs";
import { orderBy } from "@progress/kendo-data-query";
import { defaultHideSecondFilter } from "@progress/kendo-react-grid/dist/npm/filterCommon";
let numberOfColumns = 100;
let numberOfRows = 10000;
// let pagerSettings = {
//   info: true,
//   type: "input",
//   previousNext: true,
// };
const CellWithState = (props) => {
  console.log("CellWithState");
  const field = props.field || "";
  const [inEdit, setInEdit] = React.useState(false);
  const [value, setValue] = React.useState(props.dataItem[field]);
  const handleChange = (event) => {
    setValue(event.value);
  };
  const handleBlur = (e) => {
    setInEdit(false);
    if (props.onChange) {
      props.onChange({
        dataIndex: 0,
        dataItem: props.dataItem,
        field: props.field,
        syntheticEvent: e.syntheticEvent,
        value: value,
      });
    }
  };
  if (inEdit) {
    return (
      <td colSpan={props.colSpan} onClick={() => setInEdit(true)}>
        <Input
          value={value}
          style={{
            width: "100%",
          }}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </td>
    );
  }
  return (
    <td colSpan={props.colSpan} onClick={() => setInEdit(true)}>
      {props.dataItem[field]}
    </td>
  );
};
const getData = (skip, take) => {
  console.log("getData");
  const page = [];
  for (let r = skip + 1; r <= skip + take && r <= numberOfRows; r++) {
    const row = {
      id: r,
    };
    for (let c = 1; c <= numberOfColumns; c++) {
      row["Field-" + c] = "R" + r + ":C" + c;
    }
    page.push(row);
  }
  return page;
};
const columns = (() => {
  console.log("columns");
  const cols = [<GridColumn key={0} field={"id"} width={150} />];
  for (let c = 1; c <= numberOfColumns; c++) {
    cols.push(
      <GridColumn
        field={"Field-" + c.toString()}
        width={150}
        cell={CellWithState}
        key={"Field-" + c.toString()}
      />
    );
  }
  return cols;
})();
const allData = getData(0, numberOfRows);
const New = () => {
  const [data, setData] = React.useState([]);
  const [isPagingOn, setIsPagingOn] = React.useState(false);
  const [page, setPage] = React.useState({
    skip: 0,
    take: 15,
  });
  const [sort, setSort] = React.useState([]);
  const pageChange = (event) => {
    console.log("pageChange");
    console.log(event.page);
    setPage(event.page);
  };
  const sortChange = (event) => {
    const newData = orderBy(data, event.sort);
    setData(newData);
    setSort(event.sort);
  };
  const itemChange = (event) => {
    let newData = data.map((item) => {
      if (item.id === event.dataItem.id) {
        item[event.field || ""] = event.value;
      }
      return item;
    });
    setData(newData);
  };
  const handleSwitchChange = (e) => {
    setIsPagingOn(e.value);
  };
  const loadItems = () => {
    setData(allData);
  };
  return (
    <div className="container" style={{ marginTop: "200px" }}>
      <div className="row">
        <div className="col m-3">
          <Button onClick={loadItems}>Load 100 000 items</Button>
        </div>
      </div>
      <div className="row">
        <div className="col m-3">
          Virtual Scrolling{" "}
          <Switch onChange={handleSwitchChange} onLabel={""} offLabel={""} />{" "}
          Paging
        </div>
      </div>
      <div className="">
        <div className="">
          <Grid
            style={{
              width: "700px",
              height: "600px",
            }}
            columnVirtualization={true}
            scrollable={"virtual"}
            rowHeight={50}
            data={data}
            skip={page.skip}
            take={page.take}
            total={numberOfRows}
            onPageChange={(event) => setPage(event.page)}
            sortable={true}
            onSortChange={sortChange}
            sort={sort}
            onItemChange={itemChange}
            // dataItemKey={"id"}
            // pageable={false}
            // key={isPagingOn}
          >
            {columns}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default New;
