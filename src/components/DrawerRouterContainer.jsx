import * as React from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";

const items = [
  // {
  //   text: "Зарегистрироваться",
  //   // icon: "k-i-bell",
  //   route: "/",
  // },
  // {
  //   separator: true,
  // },
  
  {
    text: "Пользователи",
     icon: "k-i-calendar",
    route: "/home/users",
  },
  {
    text: "Группа пользователей",
     icon: "k-i-bell",
    route: "/home/group",
  },
  {
    text: "Права пользователей",
    icon: "k-i-globe",
    route: "/home/rights",
  },
];
const DrawerRouterContainer = (props) => {
  const [expanded, setExpanded] = React.useState(true);
  let navigate = useNavigate();
  const location = useLocation();
  const handleClick = () => {
    setExpanded(!expanded);
  };
  const onSelect = (e) => {
    navigate(e.itemTarget.props.route);
    // setExpanded(!expanded);
  };
  const setSelectedItem = (pathName) => {
    console.log("pathName: "+pathName);
    console.log(items);
    let currentPath = items.find((item) => item.route === pathName);
    if (currentPath.text) {
      return currentPath.text;
    }
  };
  console.log(location.pathname)
  let selected = setSelectedItem(location.pathname);
  return (
    <div>
    <div className="custom-toolbar">
      <Button icon="menu" onClick={handleClick} />
      <span className="overview">{selected}</span>
      <div className="right-widget">
        <Link to="/home/about" style={{color: '#424242', fontWeight: '400', fontSize: '14px', fontFamily: 'Roboto', marginTop: '3px'}}>About</Link>             
      </div>
    </div>

   <div>

   <div className='user-container' > 
      <img src={require('../assets/people/user-avatar.jpg')} alt="user avatar"/> 
     <h1>Jaxons Danniels</h1> 
     <div className="user-email">jaxons.daniels@company.com</div> 
     <Link to="/"  style={{ textDecoration: 'none' }}>
     <Button onClick={() => {localStorage.removeItem('login'); localStorage.removeItem('token');}} className="user-button k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" 
     >Sign Out</Button> 
     </Link>
    </div>
    <Drawer
      expanded={expanded}
      position={'start'}
      mode={'push'}
      width={240}
      items={items.map((item) => ({
        ...item,
        selected: item.text === selected,
      }))}
      onSelect={onSelect}
      className="drawer"
    >
      <DrawerContent>{props.children}<Outlet/> </DrawerContent>
    </Drawer>
   </div>

  </div>
  
  );
};
export default DrawerRouterContainer;