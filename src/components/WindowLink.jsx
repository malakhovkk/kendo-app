import React from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Window } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Input } from "@progress/kendo-react-inputs";
import {
  useDeleteMultipleMutation,
  useDeleteSingleMutation,
  useGetLinksMutation,
  useSetLinkMutation,
} from "../features/apiSlice";
import CheckInput from "./CheckInput";
import { link } from "@progress/kendo-editor-common";

const CheckCell = (props) => {
  return (
    <td>
      <CheckInput {...props} />
    </td>
  );
};

const WindowLink = ({ closeDialog, priceRecordId }) => {
  const [checkedRow, setCheckedRow] = React.useState([]);
  const [searchWord, setSearchWord] = React.useState("");
  const [oldSearchWord, setOldSearchWord] = React.useState("");
  const [removeSingleReq] = useDeleteSingleMutation();
  const [removeMultipleReq] = useDeleteMultipleMutation();
  const [setLinksReq] = useSetLinkMutation();
  const [queryInfo, setQueryInfo] = React.useState({});
  const [linksArr, setLinksArr] = React.useState([]);
  const isFetching = React.useRef(false);
  // const [isFetching, setIsFetching] = React.useState(false);
  // const []
  // { data: linksArr, isFetching }
  const [getLinksQueryReq] = useGetLinksMutation();
  async function exec() {
    isFetching.current = true;
    console.log({
      priceRecordId,
      searchWord: searchWord ? searchWord : "getAll",
    });
    let res = await getLinksQueryReq({
      priceRecordId,
      searchWord: searchWord ? searchWord : "getAll",
    }).unwrap();
    isFetching.current = false;
    console.log(res.map((item) => ({ ...item, selected: !!item.linkId })));
    setLinksArr(res.map((item) => ({ ...item, selected: !!item.linkId })));
  }
  React.useEffect(() => {
    exec();
  }, [priceRecordId, searchWord]);
  const modifiedLinksArr = React.useRef(null);

  const p = React.useRef();
  const new_arr = React.useRef(true);
  React.useEffect(() => {
    console.log(linksArr);
    if (!linksArr) return;
    setCurrentLinksArr(
      linksArr.filter((el) => el.linkId !== "").map((el) => el.uid)
    );
  }, [linksArr]);
  React.useEffect(() => {
    if (!linksArr) return;
    if (new_arr.current) {
      console.error(linksArr);
      setInitialLinksArr(
        linksArr.filter((el) => el.linkId !== "").map((el) => el.uid)
      );
      setCurrentLinksArr(
        linksArr.filter((el) => el.linkId !== "").map((el) => el.uid)
      );
      new_arr.current = false;
    }
  }, [linksArr]);
  React.useEffect(() => {
    if (isFetching.current) {
      setSearchWord(oldSearchWord);
      console.log("Loading...");
    }
    let t;
    if (oldSearchWord.length >= 3)
      t = setTimeout(() => {
        setSearchWord(oldSearchWord);
      }, 2000);
    else setSearchWord("");
    return () => {
      clearTimeout(t);
    };
  }, [oldSearchWord]);
  React.useEffect(() => {
    console.error(linksArr);
    alert("linksArr change");
  }, [linksArr]);
  const [initialLinksArr, setInitialLinksArr] = React.useState([]);
  const [currentLinksArr, setCurrentLinksArr] = React.useState([]);

  async function itemChange(event) {
    console.log(event);
    let value = event.value;
    const name = event.field;
    if (value) {
      let obj = await send(priceRecordId, event.dataItem.uid);
      if (!obj || !obj.result) return;
      let linkId = obj.result;
      console.log();
      setLinksArr(
        linksArr.map((row) => {
          if (row.uid === event.dataItem.uid) {
            console.warn(row.uid);
            console.log({ ...row, linkId });
            return { ...row, linkId };
          }
          return row;
        })
      );
      console.log(
        linksArr.map((row) => {
          if (row.uid === event.dataItem.uid) {
            console.warn(row.uid);
            console.log({ ...row, linkId });
            return { ...row, linkId };
          }
          return row;
        })
      );
      alert(event.dataItem.uid);
      console.log(linkId);
      setCurrentLinksArr([...currentLinksArr, linkId]);
    } else {
      console.log(event);
      let obj = await removeSingleReq(event.dataItem.linkId).unwrap();
      if (!obj || !obj.result) return;
      setCurrentLinksArr(
        currentLinksArr.filter((row) => row !== event.dataItem.linkId)
      );
    }
    //setLinksReq
    console.log(name, " ", value);
    // let obj = quantOrderArr.find(
    //   (el) => el.priceRecordId === event.dataItem.id
    // );
    setLinksArr(
      linksArr.map((item) => {
        if (item.uid === event.dataItem.uid) {
          linksArr[event.field] = event.value;
        }
        return item;
      })
    );

    // let status;
    // if (obj) {
    //   status = obj.status;
    //   if (status === "toEdit") {
    //     status = "edited";
    //   }
    // } else {
    //   status = "new";
    // }
    // setOrderArr(event.dataItem.id, value, status, obj?.id);
    // const state = {
    //   result: table.map((item) => {
    //     if (item.id === event.dataItem.id) {
    //       item[event.field || ""] = event.value;
    //     }
    //     return item;
    //   }),
    //   dataState,
    // };
    // setResult(state.result);
  }

  const send = async (ProductScu, Product1c) => {
    return await setLinksReq({ id: "", ProductScu, Product1c }).unwrap();
  };
  const cancel = () => {};
  return (
    <Window
      title={"Link"}
      onClose={closeDialog}
      initialHeight={850}
      initialWidth={600}
    >
      <Input
        onChange={(e) => setOldSearchWord(e.target.value)}
        style={{ width: "400px" }}
      />
      <Button onClick={cancel}>Отменить изменения</Button>
      <Grid
        data={linksArr}
        style={{ height: "500px" }}
        onItemChange={itemChange}
        dataItemKey={"tempId"}
      >
        <GridColumn
          cell={CheckCell}
          field="selected"
          title="Выбрать"
          width="50px"
        />
        <GridColumn field="name" width="150px" title="Имя" />
        <GridColumn field="code" width="250px" title="Код" />
      </Grid>
    </Window>
  );
};
export default WindowLink;
