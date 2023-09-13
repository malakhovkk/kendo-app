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

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/home" element={<Home />}>
          <Route path="/home/users" element={<Users />} />
          <Route path="/home/group" element={<UserGroup />} />
          <Route path="/home/rights" element={<Rights />} />
          {/* <Route path="/home/suppliers" element={<Suppliers/>}/> */}
          <Route path="/home/pricelist" element={<PriceList />} />
          <Route path="/home/vendor" element={<Vendor />} />
          <Route path="/home/profile" element={<Profile />} />
          <Route path="/home/files" element={<Files />} />
          <Route path="/home/dictionary" element={<Dictionary />} />
          <Route path="/home/new" element={<New />} />
          <Route path="/home/orders" element={<Orders />} />
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
