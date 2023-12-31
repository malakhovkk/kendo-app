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
  useAddMultipleMutation,
} from "../features/apiSlice";
import CheckInput from "./CheckInput";
import { link } from "@progress/kendo-editor-common";
import { Popup } from "devextreme-react/popup";

const CheckCell = (props) => {
  return (
    <td>
      <CheckInput {...props} />
    </td>
  );
};

const WindowLink = ({ closeDialog, priceRecordId, title }) => {
  const [checkedRow, setCheckedRow] = React.useState([]);
  const [searchWord, setSearchWord] = React.useState("");
  const [oldSearchWord, setOldSearchWord] = React.useState("");
  const [removeSingleReq] = useDeleteSingleMutation();
  const [removeMultipleReq] = useDeleteMultipleMutation();
  const [setLinksReq] = useSetLinkMutation();
  const [queryInfo, setQueryInfo] = React.useState({});
  const [linksArr, setLinksArr] = React.useState([]);
  const [addMultipleReq] = useAddMultipleMutation();
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
    try {
      let res = await getLinksQueryReq({
        priceRecordId,
        searchWord: searchWord ? searchWord : "getAll",
      }).unwrap();
      isFetching.current = false;
      //console.log(res.map((item) => ({ ...item, selected: !!item.linkId })));
      setLinksArr(res.map((item) => ({ ...item, selected: !!item.linkId })));
      var2.current = res.map((item) => ({ ...item, selected: !!item.linkId }));
    } catch (e) {
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
    if (new_arr.current && linksArr && linksArr.length) {
      // console.error(
      //   linksArr.filter((el) => el.linkId !== "").map((el) => el.uid)
      // );

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
      }, 1400);
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
    console.warn(initialLinksArr);
    //alert("linksArr change");
  }, [initialLinksArr]);

  React.useEffect(() => {
    console.error(currentLinksArr);
    //alert("linksArr change");
  }, [currentLinksArr]);
  const toDelete = React.useRef(null);
  async function itemChange(event) {
    let value = event.value;
    const name = event.field;
    if (value) {
      let obj = await send(priceRecordId, event.dataItem.uid);
      console.log("uid ", event.dataItem.uid);
      if (!obj || !obj.result) return;
      let linkId = obj.result;

      setLinksArr(
        linksArr.map((row) => {
          if (row.uid === event.dataItem.uid) {
            console.warn(row.uid);
            return { ...row, linkId };
          }
          return row;
        })
      );

      setCurrentLinksArr((currentLinksArr) => [
        ...currentLinksArr,
        event.dataItem.uid,
      ]);
    } else {
      console.log(event);
      let ld = event.dataItem.linkId;

      try {
        let obj = await removeSingleReq(ld).unwrap();
        if (!obj || !obj.result) return;
        console.warn(currentLinksArr.filter((row) => row !== ld));
        console.log(ld);
        setCurrentLinksArr(currentLinksArr.filter((row) => row !== ld));
      } catch (e) {
        console.log(e);
      }
    }
  }

  const send = async (ProductScu, Product1c) => {
    try {
      //const res = await setLinksReq({ id: "", ProductScu, Product1c }).unwrap();
      const res = await addMultipleReq([
        { id: "", ProductScu, Product1c },
      ]).unwrap();
      return res;
    } catch (e) {
      console.log(e);
    }
  };
  const cancel = async () => {
    try {
      if (linksArr && linksArr.length) {
        await removeMultipleReq(
          linksArr.filter((el) => el.linkId !== "").map((el) => el.linkId)
        ).unwrap();
        const toAdd = initialLinksArr.map((el) => ({
          id: "",
          ProductScu: priceRecordId,
          Product1c: el,
        }));
        if (toAdd.length)
          await addMultipleReq(
            initialLinksArr.map((el) => ({
              id: "",
              ProductScu: priceRecordId,
              Product1c: el,
            }))
          ).unwrap();
        exec();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderContent = () => {
    return (
      <>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Penatibus
          et magnis dis parturient. Eget dolor morbi non arcu risus. Tristique
          magna sit amet purus gravida quis blandit. Auctor urna nunc id cursus
          metus aliquam eleifend mi in. Tellus orci ac auctor augue mauris augue
          neque gravida. Nullam vehicula ipsum a arcu. Nullam ac tortor vitae
          purus faucibus ornare suspendisse sed nisi. Cursus in hac habitasse
          platea dictumst. Egestas dui id ornare arcu. Dictumst vestibulum
          rhoncus est pellentesque elit ullamcorper dignissim.
        </p>
        <p>
          Mauris rhoncus aenean vel elit scelerisque mauris pellentesque
          pulvinar. Neque volutpat ac tincidunt vitae semper quis lectus. Sed
          sed risus pretium quam vulputate dignissim suspendisse in. Urna nec
          tincidunt praesent semper feugiat nibh sed pulvinar. Ultricies lacus
          sed turpis tincidunt id aliquet risus feugiat. Amet cursus sit amet
          dictum sit amet justo donec enim. Vestibulum rhoncus est pellentesque
          elit ullamcorper. Id aliquet risus feugiat in ante metus dictum at.
        </p>
      </>
    );
  };

  return (
    <>
      <Window
        title={title}
        onClose={closeDialog}
        initialHeight={850}
        initialWidth={800}
      >
        <div style={{ marginBottom: "20px", width: "400px" }}>
          <div>
            Поиск:
            <Input
              onChange={(e) => setOldSearchWord(e.target.value)}
              style={{ width: "335px", marginLeft: "20px" }}
            />
          </div>
          <div style={{ marginTop: "10px", textAlign: "right" }}>
            <Button onClick={cancel}>Отменить изменения</Button>
            <Button onClick={closeDialog} style={{ marginLeft: "10px" }}>
              Завершить
            </Button>
          </div>
        </div>

        <Grid
          data={linksArr}
          style={{ minHeight: "500px", height: "85%", minWidth: "500px" }}
          onItemChange={itemChange}
          dataItemKey={"tempId"}
        >
          <GridColumn
            cell={CheckCell}
            field="selected"
            title="Выбрать"
            width="100px"
          />

          <GridColumn field="name" width="350px" title="Имя" />
          <GridColumn field="code" width="250px" title="Код" />
        </Grid>
      </Window>
    </>
  );
};
export default WindowLink;
