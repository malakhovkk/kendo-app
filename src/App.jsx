import * as React from "react";
import * as ReactDOM from "react-dom";
import "./App.css";
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./pages/LogIn/LogIn";
import Users from "./pages/Users/Users.jsx";
import UserGroup from "./pages/UserGroup/UserGroup.jsx";
import Rights from "./pages/Rights/Rights.jsx";
import Suppliers from "./pages/Suppliers/Suppliers.jsx";
import Home from "./pages/Home/Home";
import DrawerRouterContainer from "./components/DrawerRouterContainer";
import PriceList from "./pages/PriceList/PriceList";
import Vendor from "./pages/Vendor/Vendor";
import Profile from "./pages/Profile/Profile";
import Files from "./pages/Files/Files";
import Dictionary from "./pages/Dictionary/Dictionary";
import New from "./pages/New/New";
import Orders from "./pages/Orders/Orders";
import { useGetRightsSettingsMutation } from "./features/apiSlice.js";
import NotFound from "./pages/NotFound/NotFound";
import { Loader } from "@progress/kendo-react-indicators";
const App = () => {
  const [settings, setSettings] = React.useState([]);
  const [getRightsSettings] = useGetRightsSettingsMutation();
  const [codes, setCodes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    getRightsSettings(localStorage.getItem("login"))
      .unwrap()
      .then((payload) => {
        setSettings(payload);
        setCodes(payload.map((el) => el.code));
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);
  console.log(codes);
  if (isLoading)
    return (
      <div
        style={{
          content: "",
          position: "absolute",
          // top: "-247px",
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
    );
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<LogIn />} />
        <Route path="/home" element={<Home />}>
          {codes.includes("SETTINGS") && (
            <Route path="/home/users" element={<Users />} />
          )}
          {codes.includes("SETTINGS") && (
            <Route path="/home/group" element={<UserGroup />} />
          )}
          {codes.includes("SETTINGS") && (
            <Route path="/home/rights" element={<Rights />} />
          )}
          {/* <Route path="/home/suppliers" element={<Suppliers/>}/> */}
          {codes.includes("PRICE") && (
            <Route path="/home/pricelist" element={<PriceList />} />
          )}
          {codes.includes("VENDORS") && (
            <Route path="/home/vendor" element={<Vendor />} />
          )}
          <Route path="/home/profile" element={<Profile />} />
          {codes.includes("LOAD") && (
            <Route path="/home/files" element={<Files />} />
          )}
          {/* <Route path="/home/dictionary" element={<Dictionary />} />
          <Route path="/home/new" element={<New />} /> */}
          {codes.includes("ORDER") && (
            <Route path="/home/orders" element={<Orders />} />
          )}
        </Route>
      </Routes>
    </HashRouter>
  );
  // return (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/" element={<SignIn/>}/>
  //       <Route path="/home" element={<Home/>}/>
  //     </Routes>
  //   </BrowserRouter>
  // )
};

export default App;
