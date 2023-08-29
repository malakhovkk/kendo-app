import React from "react";
import {
  useDeleteFileMutation,
  useGetAllUsersQuery,
  useGetFilesQuery,
  useGetProfilesQuery,
  useGetVendorsQuery,
} from "../../features/apiSlice";
import { useNavigate } from "react-router-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

export default function Files(props) {
  const { data: files } = useGetFilesQuery();
  const [info, setInfo] = React.useState([]);
  const { data: users } = useGetAllUsersQuery();
  const { data: vendors } = useGetVendorsQuery();
  const { data: profiles } = useGetProfilesQuery();
  const [deleteFile] = useDeleteFileMutation();
  const getUserById = (id) => {
    return users.find((user) => user.id === id)?.name;
  };
  const getVendorById = (id) => {
    return vendors.find((vendor) => vendor.id === id)?.name;
  };
  const getProfileById = (id) => {
    return profiles.find((profile) => profile.id === id)?.name;
  };
  React.useEffect(() => {
    if (
      files === undefined ||
      users === undefined ||
      vendors === undefined ||
      profiles === undefined
    )
      return;
    setInfo(
      files.map((file) => {
        return {
          ...file,
          userName: getUserById(file.userId),
          vendorName: getVendorById(file.vendorId),
          profileName: getProfileById(file.profileId),
        };
      })
    );
  }, [files, users, vendors, profiles]);
  const _deleteFile = (id) => {
    deleteFile(id);
  };
  const DeleteCell = (props) => {
    //console.log(props)
    return (
      <td>
        <img
          onClick={() => _deleteFile(props.dataItem.id)}
          src={require("../../assets/remove.png")}
          alt="Удалить"
        />
        {/* <Button themeColor="error" onClick={() => deleteUser(props.dataItem.id)}>Удалить</Button> */}
      </td>
    );
  };
  const navigate = useNavigate();
  const EditCell = (props) => {
    //console.log(props)
    return (
      <td>
        <img
          onClick={() =>
            editRow({
              id: props.dataItem.id,
              profileId: props.dataItem.profileId,
              vendorId: props.dataItem.vendorId,
              fileName: props.dataItem.inputName,
            })
          }
          src={require("../../assets/edit.png")}
          alt="Редактировать"
        />
        {/* <Button themeColor="error" onClick={() => deleteUser(props.dataItem.id)}>Удалить</Button> */}
      </td>
    );
  };
  React.useEffect(() => {}, []);
  const editRow = ({ profileId, vendorId, id, fileName }) => {
    navigate(
      "/home/pricelist",
      { state: { profileId, vendorId, docId: id, fileName } } // your data array of objects
    );
    console.log("AAA ", profileId, "BBB", vendorId);
  };

  return (
    <Grid
      data={info}
      className="grid"
      style={{
        height: "400px",
      }}
    >
      <GridColumn field="inputName" title="Имя" />
      <GridColumn field="userName" title="Пользователь" />
      <GridColumn field="vendorName" title="Поставщик" />
      <GridColumn field="profileName" title="Профиль" />
      <GridColumn cell={DeleteCell} width="50px" />
      <GridColumn cell={EditCell} width="50px" />
      {/* <GridColumn field="code" title="Code"  />
      <GridColumn field="surname" title="Surname" /> */}
      {/* <GridColumn cell={EditCell} width="50px" />
        <GridColumn cell={DeleteCell} width="50px" /> */}
    </Grid>
  );
}
