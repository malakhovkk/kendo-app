import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
const items = [
  {
    text: "Зарегистрироваться",
    // icon: "k-i-bell",
    route: "/",
  },
  {
    separator: true,
  },
  {
    text: "Группа пользователей",
    // icon: "k-i-bell",
    route: "/group",
  },
  {
    text: "Пользователи",
    // icon: "k-i-calendar",
    route: "/users",
  },
  {
    text: "Права пользователей",
    // icon: "k-i-calendar",
    route: "/rights",
  },
  {
    separator: true,
  },
  {
    text: "Attachments",
    // icon: "k-i-hyperlink-email",
    route: "/attachments",
  },
  {
    text: "Favourites",
    // icon: "k-i-star-outline",
    route: "/favourites",
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
        {/* <span className="mail-box">Vinopark</span> */}
        <Button icon="menu" fillMode="flat" style={{marginLeft:10}} onClick={handleClick} />
      </div>
      <Drawer
        expanded={expanded}
        position={"start"}
        mode={"overlay"}
        
        onOverlayClick={handleClick}
        items={items.map((item) => ({
          ...item,
          selected: item.text === selected,
        }))}
        onSelect={onSelect}
      >
        <DrawerContent>{props.children}</DrawerContent>
      </Drawer>
    </div>
  );
};
export default DrawerRouterContainer;