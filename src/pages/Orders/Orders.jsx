import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import {
  useGetOrdersMutation,
  useGetVendorContactsMutation,
  useGetVendorsQuery,
  useSendOrderMutation,
} from "../../features/apiSlice";
import Select from "react-select";
import { Window } from "@progress/kendo-react-dialogs";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import axios from "axios";
import { Navigate } from "react-router-dom";
const Orders = () => {
  const [getOrders] = useGetOrdersMutation();
  const [vendorId, setVendorId] = React.useState();
  const [optionsVendor, setOptionsVendor] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [orderId, setOrderId] = React.useState();
  const { data: vendors } = useGetVendorsQuery();
  const [getContacts] = useGetVendorContactsMutation();
  const [contacts, setContacts] = React.useState([]);
  const [checkedRow, setCheckedRow] = React.useState({});
  const [ToChange, setToChange] = React.useState();
  // const [sendOrder] = useSendOrderMutation();
  const sendOrder = (body) => {
    const url = "http://194.87.239.231:55555/api/order";

    const formData = new FormData();
    for (let k in body) {
      formData.append(k, body[k]);
    }
    // formData.append("Document", file);
    // formData.append("ProfileId", profile);
    // formData.append("UserLogin", localStorage.getItem("login"));
    // formData.append("VendorId", vendor);
    // formData.append('fileName', file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        User: `${localStorage.getItem("login")}`,
      },
    };
    // {
    //     Document: formData,
    //     Description:'',
    //     UserLogin: localStorage.getItem('login'),
    //     VendorId: 'Поставщик 1'
    // }
    axios
      .put(url, formData, config)
      .then((response) => {
        //console.log(response.data);
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
  };
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
    getContacts({ id: vendorId })
      .unwrap()
      .then((payload) => {
        setContacts(payload.filter((contact) => contact.type === 1));
      })
      .catch((error) => console.error(error));
    getOrders(vendorId)
      .unwrap()
      .then((payload) => {
        console.log(payload);
        setOrders(
          payload
            .map((order) => ({
              ...order,
              timeCreate: new Date(order.dateCreate).getTime(),
              timeSend: new Date(order.dateSend).getTime(),
              dateCreate: new Date(order.dateCreate).toLocaleString("ru-Ru"),
              dateSend:
                new Date(order.dateSend).getTime() <= 0
                  ? ""
                  : new Date(order.dateSend).toLocaleString("ru-Ru"),
            }))
            .sort((date1, date2) => -date1.timeCreate + date2.timeCreate)
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

  const pickContacts = (id) => {
    setOrderId(id);
  };

  const ContactCell = (props) => {
    //console.log(props)
    // console.log(props);

    //console.log(row);

    return (
      <td style={{ overflow: "visible" }}>
        <img
          style={{ width: "20px", height: "20px" }}
          onClick={() => pickContacts(props.dataItem.id)}
          src={require("../../assets/mail.png")}
          alt="Удалить"
        />
      </td>
    );
  };

  const CommentCell = (props) => {
    //console.log(props)
    // console.log(props);

    //console.log(row);

    return (
      <td>
        <p style={{ whiteSpace: "pre-wrap" }}>{props.dataItem.comment}</p>
      </td>
    );
  };

  const edit = (idVendor, idOrder, comment) => {
    setToChange({ idVendor, idOrder, comment });
  };

  const EditCell = (props) => {
    //console.log(props)
    // console.log(props);

    //console.log(row);

    return (
      <td style={{ overflow: "visible" }}>
        <img
          style={{ width: "20px", height: "20px" }}
          onClick={() =>
            edit(
              props.dataItem.vendorId,
              props.dataItem.id,
              props.dataItem.comment
            )
          }
          src={require("../../assets/edit.png")}
          alt="Редактировать"
        />
      </td>
    );
  };

  const closeDialog = () => {
    setOrderId(null);
    setCheckedRow({});
  };
  const checked = (e, id) => {
    const val = e.target.checked;
    const res = { ...checkedRow };
    res[id] = val;
    if (!res[id]) delete res[id];
    setCheckedRow(res);
  };
  const CheckCell = (props) => {
    return (
      <td>
        <Checkbox
          checked={checkedRow[props.dataItem.id]}
          onClick={(e) => checked(e, props.dataItem.id)}
        />
      </td>
    );
  };

  const send = () => {
    if (!orderId || !vendorId) {
      alert("Произошла ошибка");
      return;
    }
    console.log(contacts.filter((contact) => checkedRow[contact.id]));
    sendOrder({
      orderId,
      eMailList: contacts
        .filter((contact) => checkedRow[contact.id])
        .map((c) => c.contact)
        .join(","),
    });
  };
  console.log(orders);
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
        <Grid data={orders} style={{ height: "600px" }}>
          <GridColumn field="number" width="150px" title="Номер" />
          <GridColumn field="dateCreate" width="150px" title="Дата создания" />
          <GridColumn field="dateSend" width="150px" title="Дата отправки" />
          <GridColumn field="eMailSend" width="150px" title="Почта" />
          <GridColumn
            field="orderPositions"
            width="150px"
            title="Количество позиций"
          />
          <GridColumn cell={CommentCell} title="Комментарий" width="500px" />
          {/* <GridColumn field="comment" width="150px" title="Комментарий" /> */}
          <GridColumn cell={ContactCell} width="50px" />
          <GridColumn cell={EditCell} width="50px" />
        </Grid>
      )}

      {orderId && (
        <Window
          title={"Contacts"}
          onClose={closeDialog}
          initialHeight={350}
          initialWidth={450}
        >
          <Grid data={contacts} style={{}}>
            <GridColumn cell={CheckCell} width="50px" />
            {/* <GridColumn field="comment" width="150px" title="Комментарий" /> */}
            <GridColumn field="name" width="150px" title="Имя" />
            <GridColumn field="contact" width="150px" title="Почта" />
          </Grid>
          <Button onClick={send}>Отправить</Button>
        </Window>
      )}
      {ToChange && (
        <Navigate to="/home/pricelist" state={ToChange} replace={true} />
      )}
    </div>
  );
};

export default Orders;
