import * as React from "react";
import * as ReactDOM from "react-dom";
import './App.css';
import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn/SignIn';
import Users from './pages/Users/Users.jsx';
import UserGroup from './pages/UserGroup/UserGroup.jsx';
import Rights from './pages/Rights/Rights.jsx';
import Home from './pages/Home/Home';
import DrawerRouterContainer from "./components/DrawerRouterContainer";
const App = () => {
  return (
      <HashRouter>
          <Routes>
            <Route path="/" element={<SignIn/>}/>
            <Route path="/home" element={<Home/>}>
              <Route path="/home/users" element={<Users/>}/>
              <Route path="/home/group" element={<UserGroup/>}/>
              <Route path="/home/rights" element={<Rights/>}/>
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
