import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import {
  useGetOrdersMutation,
  useGetVendorsQuery,
} from "../../features/apiSlice";
import Select from "react-select";
const Orders = () => {
  const [getOrders] = useGetOrdersMutation();
  const [vendorId, setVendorId] = React.useState();
  const [optionsVendor, setOptionsVendor] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const { data: vendors } = useGetVendorsQuery();
  const onSelectVendor = (vendor) => {
    setVendorId(vendor.value);
  };
  React.useEffect(() => {
    console.log(vendors);
    if (vendors === undefined) return;
    setOptionsVendor(
      vendors.map((vendor) => ({ value: vendor.id, label: vendor.name }))
    );
  }, [vendors]);

  React.useEffect(() => {
    if (vendorId === undefined) return;
    getOrders(vendorId)
      .unwrap()
      .then((payload) => {
        console.log(payload);
        setOrders(
          payload.map((order) => ({
            ...order,
            dateCreate: new Date(order.dateCreate).toLocaleString("ru-Ru"),
            dateSend: new Date(order.dateSend).toLocaleString("ru-Ru"),
          }))
        );
        // if (payload.message === "Server error") {
        //     setError(true);
        //     setTimeout(() => {
        //         setError(false);
        //     }, 2000);
        // }
        // if (payload.message === "success") {
        //     setSuccess(true);
        //     setTimeout(() => {
        //         setSuccess(false);
        //     }, 2000);
        // }
      })
      .catch((error) => console.error("rejected", error));
  }, [vendorId]);
  return (
    <div style={{ marginLeft: "10px", marginTop: "80px" }}>
      {optionsVendor && (
        <div style={{ width: "300px", marginBottom: "10px" }}>
          <Select
            options={optionsVendor}
            onChange={onSelectVendor}
            placeholder="Выбрать поставщика"
          />
        </div>
      )}
      {orders && (
        <Grid data={orders} style={{ width: "450px" }}>
          <GridColumn field="dateCreate" width="150px" title="Дата создания" />
          <GridColumn field="dateSend" width="150px" title="Дата отправки" />
          <GridColumn field="eMailSend" width="150px" title="Почта" />
        </Grid>
      )}
    </div>
  );
};

export default Orders;
