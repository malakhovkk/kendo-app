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
  const var1 = React.useRef(false);
  const var2 = React.useRef([]);
  // const [isFetching, setIsFetching] = React.useState(false);
  // const []
  // { data: linksArr, isFetching }
  const [getLinksQueryReq] = useGetLinksMutation();
  async function exec() {
    isFetching.current = true;
    // console.log({
    //   priceRecordId,
    //   searchWord: searchWord ? searchWord : "getAll",
    // });
    try{
      let res = await getLinksQueryReq({
        priceRecordId,
        searchWord: searchWord ? searchWord : "getAll",
      }).unwrap();
      isFetching.current = false;
      //console.log(res.map((item) => ({ ...item, selected: !!item.linkId })));
      setLinksArr(res.map((item) => ({ ...item, selected: !!item.linkId })));
      var2.current = res.map((item) => ({ ...item, selected: !!item.linkId }));
    }
    catch(e)
    {
      console.log(e);
    }
  }
  React.useEffect(() => {
    exec();
  }, [priceRecordId, searchWord]);
  const modifiedLinksArr = React.useRef(null);

  const p = React.useRef();
  const new_arr = React.useRef(true);
  // React.useEffect(() => {
  //   //console.log(linksArr);
  //   if (!linksArr) return;
  //   setCurrentLinksArr(
  //     linksArr.filter((el) => el.linkId !== "").map((el) => el.uid)
  //   );
  // }, [linksArr]);
  React.useEffect(() => {
    if (!linksArr) return;
    if (new_arr.current && linksArr && linksArr.length)  {
      console.error(linksArr.filter((el) => el.linkId !== "").map((el) => el.uid));
      
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
      //console.log("Loading...");
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
    //alert("linksArr change");
  }, [linksArr]);

 

  const [initialLinksArr, setInitialLinksArr] = React.useState([]);
  const [currentLinksArr, setCurrentLinksArr] = React.useState([]);
 React.useEffect(() => {
  console.warn(initialLinksArr)
    //alert("linksArr change");
  }, [initialLinksArr]);

  React.useEffect(() => {
    console.error(currentLinksArr);
    //alert("linksArr change");
  }, [currentLinksArr]);
  const toDelete = React.useRef(null);
  async function itemChange(event) {
    //console.log(event);
    let value = event.value;
    const name = event.field;
    if (value) {
      let obj = await send(priceRecordId, event.dataItem.uid);
      if (!obj || !obj.result) return;
      let linkId = obj.result;

      setLinksArr(
        linksArr.map((row) => {
          if (row.uid === event.dataItem.uid) {
            console.warn(row.uid);
            //console.log({ ...row, linkId });
            return { ...row, linkId };
          }
          return row;
        })
      );

      // var1.current = event;
      //console.log(linkId);
      setCurrentLinksArr([...currentLinksArr, linkId]);
    } else {
      console.log(event);
      let ld = event.dataItem.linkId;
      try 
      {
        let obj = await removeSingleReq(ld).unwrap();
        if (!obj || !obj.result) return;
        setCurrentLinksArr(
          currentLinksArr.filter((row) => row !== ld)
        );
      }
      catch(e)
      {
        console.log(e);
      }
    }

  }

  const send = async (ProductScu, Product1c) => {
    try 
    {
      const res = await setLinksReq({ id: "", ProductScu, Product1c }).unwrap();
      return res;
    }
    catch(e) 
    {
      console.log(e);
    }
    
  };
  const cancel = async () => {
    console.log(currentLinksArr, initialLinksArr);
    let res = currentLinksArr.filter(el => !initialLinksArr.includes(el));
    if(res.length)
    {
      try 
      {
        await removeMultipleReq(res).unwrap();
      
        let ans = await getLinksQueryReq({
          priceRecordId,
          searchWord: searchWord ? searchWord : "getAll",
        }).unwrap();
      
        exec();
      }
      catch(e) {
        console.log(e);
      }
    }
  };
  return (
    <Window
      title={"Link"}
      onClose={closeDialog}
      initialHeight={850}
      initialWidth={600}
    >
      <div style={{   marginBottom: "20px" }}>
      Поиск:
      <Input
        onChange={(e) => setOldSearchWord(e.target.value)}
        style={{ width: "300px", marginLeft: "20px" }}
      />
      <Button onClick={cancel} style={{  marginLeft: "20px"}}>Отменить изменения</Button>
      </div>
      <Grid
        data={ linksArr}
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
      <Button onClick={closeDialog} style={{  marginTop: "20px" }}>Завершить</Button>
    </Window>
  );
};
export default WindowLink;
