import { createUser } from "../features/userDetailSlice";

export const priceListDataGrid = () => {
  let columns = [];

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
          columns = [
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
          columns = [
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
        columns.push(
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

  columns = [
    <Column
      key={"1C"}
      fixed={true}
      dataField={"1C"}
      allowEditing={false}
      caption={"1C"}
    />,
    ...columns,
  ];
  return (
    <>
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
        {orderId ? (
          <Editing
            onChangesChange={onChangesChange}
            mode="row"
            allowUpdating={true}
          />
        ) : null}
        {columns}

        <Scrolling columnRenderingMode="virtual" mode="infinite" />
        <FilterRow visible={true} />
        <SearchPanel visible={true} />
        <GroupPanel visible={true} />
      </DataGrid>
    </>
  );
};
