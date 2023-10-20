import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import users from "./UserGroup.json";
import "./Rights.css";
import { Button } from "@progress/kendo-react-buttons";
import { Window } from "@progress/kendo-react-dialogs";
import { uid } from "uid";
import { useNavigate } from "react-router-dom";
import { formatCodeBlockIcon } from "@progress/kendo-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetAllRightsQuery,
  useEditRightMutation,
  useCreateRightMutation,
  useDeleteRightMutation,
} from "../../features/apiSlice";
import { groupBy } from "@progress/kendo-data-query";

const Rights = () => {
  const { data, error: err, isLoading, refetch } = useGetAllRightsQuery();
  const [edit] = useEditRightMutation();
  const [_addRight] = useCreateRightMutation();
  const [_deleteRight] = useDeleteRightMutation();
  const [visible, setVisible] = React.useState(false);
  const [id, setId] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    data && (
      <div style={{ marginTop: "100px" }}>
        <Grid
          //groupable={true}
          group={[{ field: "groupId" }]}
          data={groupBy(data, [{ field: "groupId" }])}
          //data={data}
          className="grid"
          style={{
            height: "400px",
          }}
        >
          <GridColumn field="name" title="Name" />
          <GridColumn field="code" title="Code" />
          {/* <GridColumn field="groupId" title="GroupId" /> */}
          {/* <GridColumn cell={EditCell} width="50px" />
        <GridColumn cell={DeleteCell} width="50px" /> */}
        </Grid>
      </div>
    )
  );
};
export default Rights;
