import React from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Window } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Input } from "@progress/kendo-react-inputs";
import { useGetInitialLinksQuery } from "../features/apiSlice";

const WindowLink = ({ closeDialog, priceRecordId }) => {
  const [checkedRow, setCheckedRow] = React.useState([]);
  const [searchWord, setSearchWord] = React.useState("");
  const [oldSearchWord, setOldSearchWord] = React.useState("");
  const { data: linksArr } = useGetInitialLinksQuery({
    priceRecordId,
    searchWord: searchWord ? searchWord : "getAll",
  });
  React.useEffect(() => {
    let t;
    if (oldSearchWord.length === 3) setSearchWord(oldSearchWord);
    else {
      if (oldSearchWord.length > 3)
        t = setTimeout(() => {
          setSearchWord(oldSearchWord);
        }, 2000);
      else setSearchWord("");
    }
    return () => {
      clearTimeout(t);
    };
  }, [oldSearchWord]);
  const CheckCell = (props) => {
    return (
      <td>
        <Checkbox
          checked={checkedRow[props.dataItem.id]}
          // onClick={(e) => checked(e, props.dataItem.id)}
        />
      </td>
    );
  };
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
      <Button onClick={() => {}}>Отправить</Button>
    </Window>
  );
};
export default WindowLink;
