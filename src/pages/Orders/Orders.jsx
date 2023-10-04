import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import {
  useDeleteAllZerosMutation,
  useDeleteOrderMutation,
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
import { Navigate, useNavigate } from "react-router-dom";
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
  const [deleteAllZerosReq] = useDeleteAllZerosMutation();
  const [deleteOrderReq] = useDeleteOrderMutation();
  const navigate = useNavigate();
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
        getContactsAndOrders();
      })
      .catch((err) => {
        if (err.response.status === 401) navigate("/");
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

  const getContactsAndOrders = () => {
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
      })
      .catch((error) => console.error("rejected", error));
  };

  React.useEffect(() => {
    if (vendorId === undefined) return;
    getContactsAndOrders();
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
  const deleteAllZeros = () => {
    if (
      window.confirm(
        "Вы уверены, что хотите удалить все заказы у всех поставщиков, где количество позиций равно 0?"
      )
    ) {
      deleteAllZerosReq()
        .unwrap()
        .then((_) => {
          getContactsAndOrders();
        });
    }
  };
  const deleteOrder = (id, date) => {
    if (window.confirm("Вы уверены, что хотите удалить данный заказ?"))
      deleteOrderReq(id)
        .unwrap()
        .then((_) => {
          getContactsAndOrders();
        })
        .catch((err) => console.error(err));
  };
  const DeleteCell = (props) => {
    //console.log(props)
    return (
      <td>
        {!props.dataItem.dateSend && (
          <img
            onClick={() =>
              deleteOrder(props.dataItem.id, props.dataItem.dateSend)
            }
            src={require("../../assets/remove.png")}
            alt="Удалить"
          />
        )}
        {/* <Button themeColor="error" onClick={() => deleteRight(props.dataItem.id)}>Удалить</Button> */}
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
      <Button style={{ marginBottom: "10px" }} onClick={deleteAllZeros}>
        Удалить пустые заказы у всех поставщиков
      </Button>
      {orders && (
        <>
          <Grid data={orders} style={{ height: "600px" }}>
            <GridColumn field="number" width="150px" title="Номер" />
            <GridColumn
              field="dateCreate"
              width="150px"
              title="Дата создания"
            />
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
            <GridColumn cell={DeleteCell} width="50px" />
          </Grid>
        </>
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
