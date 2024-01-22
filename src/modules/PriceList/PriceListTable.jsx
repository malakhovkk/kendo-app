export const PriceListTable = () => {
    return <>
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
    </>
}