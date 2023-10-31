import React from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Window } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Input } from "@progress/kendo-react-inputs";
import {
  useDeleteMultipleMutation,
  useDeleteSingleMutation,
  useGetInitialLinksQuery,
  useSetLinkMutation,
} from "../features/apiSlice";

const WindowLink = ({ closeDialog, priceRecordId }) => {
  const [checkedRow, setCheckedRow] = React.useState([]);
  const [searchWord, setSearchWord] = React.useState("");
  const [oldSearchWord, setOldSearchWord] = React.useState("");
  const [removeSingle] = useDeleteSingleMutation();
  const [removeMultiple] = useDeleteMultipleMutation();
  const { data: linksArr, isFetching } = useGetInitialLinksQuery({
    priceRecordId,
    searchWord: searchWord ? searchWord : "getAll",
  });
  const [setLinksReq] = useSetLinkMutation();
  const p = React.useRef();
  const new_arr = React.useRef(true);
  //const [itemsWithLink, setItemsWithLink] = React.useState([]);
  // const itemsWithLink = React.useRef([]);
  React.useEffect(() => {
    //onsole.log
    // itemsWithLink.current = linksArr?.map((el) => el.linkId);
    console.log(linksArr);
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

  const [initialLinksArr, setInitialLinksArr] = React.useState([]);
  const [currentLinksArr, setCurrentLinksArr] = React.useState([]);

  const CheckCell = (props) => {
    /*console.log(
      linksArr?.map((el) => el.linkId),
      props.dataItem.linkId
    );*/
    return (
      <td>
        <Checkbox
          checked={
            currentLinksArr?.includes(props.dataItem.uid)
            // props.dataItem.linkId &&
            // linksArr?.map((el) => el.linkId)?.includes(props.dataItem.linkId)
          }
          onChange={(e) => {
            // alert(e.value);
            if (e.value) {
              console.log(e);
              setLinksReq({
                id: "",
                ProductScu: priceRecordId,
                Product1c: props.dataItem.uid,
              })
                .unwrap()
                .then((_) => {
                  console.log([...currentLinksArr, props.dataItem.uid]);
                  setCurrentLinksArr([
                    ...currentLinksArr,
                    props.dataItem.uid,
                  ]);
                })
                .catch(console.log);
            } else {
              console.log(e);
              removeSingle(props.dataItem.linkId)
                .unwrap()
                .then((_) => {
                  setCurrentLinksArr(
                    currentLinksArr.filter(
                      (item) => item !== props.dataItem.uid
                    )
                  );
                })
                .catch(console.log);
            }
          }}
          // onClick={(e) => checked(e, props.dataItem.id)}
        />
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
        {/* <GridColumn field="comment" width="150px" title="Комментарий" /> */}
        <GridColumn field="name" width="150px" title="Имя" />
        <GridColumn
          field="code"
          // cell={EmailContactCell}
          width="250px"
          title="Код"
        />
      </Grid>
      {/* <div style={{ marginTop: "15px", marginBottom: "15px" }}>
            <Select
              options={companies}
              onChange={onSelectCompany}
              placeholder="Выбрать магазин"
            />
          </div> */}
      {/* <Button onClick={send}>Отправить</Button> */}
    </Window>
  );
};
export default WindowLink;
