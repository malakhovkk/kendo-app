import * as React from "react";
import * as ReactDOM from "react-dom";
import './App.css';
import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn/SignIn';
import Home from './pages/Home/Home';
import DrawerRouterContainer from "./components/DrawerRouterContainer";
const App = () => {
  return (
    <React.Fragment>
      <HashRouter>
        <DrawerRouterContainer>
          <Routes>
            <Route exact={true} path="/" element={<SignIn/>}/>
          </Routes>
        </DrawerRouterContainer>
      </HashRouter>
  </React.Fragment>
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
