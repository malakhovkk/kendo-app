import React from "react";
import {
  useDeleteFileMutation,
  useGetAllUsersQuery,
  useGetDocumentMutation,
  useGetFilesQuery,
  useGetProfilesQuery,
  useGetVendorsQuery,
} from "../../features/apiSlice";
import { useNavigate } from "react-router-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import Select from "react-select";
import { Button } from "@progress/kendo-react-buttons";
import axios from "axios";
import { Loader } from "@progress/kendo-react-indicators";
import "./Files.css";
export default function Files(props) {
  const { data: files, refetch } = useGetFilesQuery();
  const [info, setInfo] = React.useState([]);
  const { data: users } = useGetAllUsersQuery();
  const { data: vendors } = useGetVendorsQuery();
  const { data: profiles } = useGetProfilesQuery();
  const { data, error: err, isLoading } = useGetVendorsQuery();
  const [options, setOptions] = React.useState([]);
  const [vendor, setVendor] = React.useState(null);
  const [optionsProfile, setOptionsProfile] = React.useState([]);
  const [deleteFile] = useDeleteFileMutation();
  const [profile, setProfile] = React.useState(null);
  const [file, setFile] = React.useState();
  const [fileN, setFileN] = React.useState(null);
  const [showTable, setShowTable] = React.useState(false);
  const [docId, setDocId] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const { data: dataProfiles } = useGetProfilesQuery();
  console.log(files);
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
  React.useEffect(() => {
    //console.log(data);
    setOptions(data?.map((el) => ({ value: el.id, label: el.name })));
  }, [data]);
  const editRow = ({ profileId, vendorId, id, fileName }) => {
    navigate(
      "/home/pricelist",
      { state: { profileId, vendorId, docId: id, fileName } } // your data array of objects
    );
    console.log("AAA ", profileId, "BBB", vendorId);
  };

  const onSelectVendor = (select) => {
    //console.log(select.value);
    setVendor(select.value);
  };
  const onSelectProfile = (select) => {
    //console.log(select.value);
    setProfile(select.value);
  };
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };

  const save = (e) => {
    console.log(file);
    if (!file || !profile || !vendor || !localStorage.getItem("login")) return;
    setFileN(file.name);
    // const url = "http://192.168.20.30:55555/api/file";
    const url = "http://194.87.239.231:55555/api/file";

    const formData = new FormData();
    formData.append("Document", file);
    formData.append("ProfileId", profile);
    formData.append("UserLogin", localStorage.getItem("login"));
    formData.append("VendorId", vendor);
    // formData.append('fileName', file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        User: `${localStorage.getItem("login")}`,
      },
    };
    setLoading(true);
    // {
    //     Document: formData,
    //     Description:'',
    //     UserLogin: localStorage.getItem('login'),
    //     VendorId: 'Поставщик 1'
    // }
    axios
      .post(url, formData, config)
      .then((response) => {
        //console.log(response.data);
        setShowTable(true);

        const doc_id = response.data.result;
        //setId("0bc3bc0c-7233-4fea-a647-11956fccb5cf");
        //setDocId("0bc3bc0c-7233-4fea-a647-11956fccb5cf");
        setDocId(doc_id);
        if (files !== undefined) refetch();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) navigate("/");
        if (err?.response.data.message === "Records not found")
          alert("Профиль не соотвествует файлу");
        else alert("Произошла ошибка");
      })
      .finally(() => {
        setLoading(false);
      });
    //     upload({
    //     Document: file,
    //     Description:'',
    //     UserLogin: localStorage.getItem('login'),
    //     VendorId: 'Поставщик 1'
    // })
  };

  React.useEffect(() => {
    //console.log(dataProfiles);
    setOptionsProfile(
      dataProfiles?.map((el) => ({ value: el.id, label: el.name }))
    );
  }, [dataProfiles]);

  return (
    <div style={{ marginLeft: "10px", marginTop: "100px" }}>
      {loading && (
        <div
          style={{
            content: "",
            position: "absolute",
            top: "-179px",
            left: 0,
            background: "rgba(0,0,0,.5)",
            zIndex: "1000",
            height: "100vh",
            display: "flex",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader size="large" type="infinite-spinner" />{" "}
        </div>
      )}
      <div style={{ display: "flex" }}>
        <div>
          Поставщик:
          <div
            style={{
              width: "300px",
              marginTop: "10px",
            }}
          >
            <Select
              options={options}
              onChange={onSelectVendor}
              placeholder="Выбрать поставщика"
            />
          </div>
          <div
            style={{
              marginTop: "10px",
            }}
          >
            Выбрано: {vendors && getVendorById(vendor)}
          </div>
        </div>
        <div style={{ marginLeft: "15px" }}>
          Профиль:
          <div
            style={{
              width: "300px",
              marginTop: "10px",
            }}
          >
            <Select
              options={optionsProfile}
              onChange={onSelectProfile}
              placeholder="Выбрать профиль"
            />
          </div>
          <div
            style={{
              marginTop: "10px",
            }}
          >
            Выбрано: {profiles && getProfileById(profile)}
          </div>
        </div>
      </div>
      <label
        class="custom-file-upload"
        style={{
          marginTop: "10px",
        }}
      >
        <input
          style={{
            marginTop: "10px",
          }}
          type="file"
          onChange={handleFileChange}
        />
        Выбрать файл
      </label>

      <div
        style={{
          marginTop: "10px",
        }}
      >
        Выбрано: {fileN}
      </div>
      {/* <Button
        
      >
        Загрузить
      </Button> */}
      <img
        style={{
          marginTop: "10px",
          width: "35px",
        }}
        onClick={save}
        src={require("../../assets/upload.png")}
        alt="Удалить"
      />
      <Grid
        data={info}
        className="grid"
        style={{
          height: "400px",
          marginLeft: 0,
          marginTop: "10px",
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
    </div>
  );
}
