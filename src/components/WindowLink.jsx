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

const WindowLink = ({ closeDialog, priceRecordId }) => {
  const [checkedRow, setCheckedRow] = React.useState([]);
  const [searchWord, setSearchWord] = React.useState("");
  const [oldSearchWord, setOldSearchWord] = React.useState("");
  const [removeSingle] = useDeleteSingleMutation();
  const [removeMultiple] = useDeleteMultipleMutation();
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
    setLinksArr(res);
  }
  React.useEffect(() => {
    exec();
  }, [priceRecordId, searchWord]);
  const modifiedLinksArr = React.useRef(null);
  const [setLinksReq] = useSetLinkMutation();
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
    if (isFetching) {
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
  }, [linksArr]);
  const [initialLinksArr, setInitialLinksArr] = React.useState([]);
  const [currentLinksArr, setCurrentLinksArr] = React.useState([]);

  const CheckCell = (props) => {
    return (
      <td>
        <CheckInput {...props} />
      </td>
    );
  };
  const send = (ProductScu, Product1c) => {
    setLinksReq({ id: "", ProductScu, Product1c });
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
      <Grid data={linksArr} style={{ height: "500px" }}>
        <GridColumn cell={CheckCell} width="50px" />
        <GridColumn field="name" width="150px" title="Имя" />
        <GridColumn field="code" width="250px" title="Код" />
      </Grid>
    </Window>
  );
};
export default WindowLink;
