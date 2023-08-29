import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button } from "@progress/kendo-react-buttons";
import { useUploadMutation } from "../../features/apiSlice";
import axios from "axios";

const Suppliers = () => {
  const [file, setFile] = React.useState();
  const [upload] = useUploadMutation();
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const save = (e) => {
    console.log(file);
    const url = "http://192.168.20.30:55555/api/file";
    const formData = new FormData();
    formData.append("Document", file);
    formData.append("ProfileId", "hello");
    formData.append("UserLogin", localStorage.getItem("login"));
    formData.append("VendorId", "Поставщик 1");
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
      .post(url, formData, config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    //     upload({
    //     Document: file,
    //     Description:'',
    //     UserLogin: localStorage.getItem('login'),
    //     VendorId: 'Поставщик 1'
    // })
  };

  return (
    <div
      style={{
        width: "500px",
        height: "500px",
      }}
    >
      <input type="file" onChange={handleFileChange} />
      <Button onClick={save}>Загрузить</Button>
    </div>
  );
};

export default Suppliers;
