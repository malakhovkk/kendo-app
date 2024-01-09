import * as React from "react";
import { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { useSelector, useDispatch } from "react-redux";
import { freeze } from "../features/settings.js";
// import { fetchUserById } from './slices/usersSlice.js';
import {
  useGetDictionaryByIdMutation,
  useGetRightsSettingsMutation,
} from "../features/apiSlice.js";
import { loginSlice } from "../features/login";
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
    rights: "SETTINGS",
  },
  {
    text: "Группа пользователей",
    icon: "k-i-bell",
    route: "/home/group",
    rights: "SETTINGS",
  },
  {
    text: "Права пользователей",
    icon: "k-i-globe",
    route: "/home/rights",
    rights: "SETTINGS",
  },
  {
    text: "Поставщики",
    icon: "k-i-globe",
    route: "/home/vendor",
    rights: "VENDORS",
  },
  {
    text: "Текущий прайс-лист",
    icon: "k-i-globe",
    route: "/home/pricelist",
    rights: "PRICE",
  },
  {
    text: "Профиль",
    icon: "k-i-globe",
    route: "/home/profile",
    rights: "ALL",
  },
  {
    text: "Прайс-листы",
    icon: "k-i-globe",
    route: "/home/files",
    rights: "LOAD",
  },
  // {
  //   text: "Словарь",
  //   icon: "k-i-globe",
  //   route: "/home/dictionary",
  // },
  // {
  //   text: "New",
  //   icon: "k-i-globe",
  //   route: "/home/new",
  // },
  {
    text: "Заказы",
    icon: "k-i-globe",
    route: "/home/orders",
    rights: "ORDER",
  },
];
const DrawerRouterContainer = (props) => {
  const [expanded, setExpanded] = React.useState(true);
  const [getDictionaryReq] = useGetDictionaryByIdMutation();
  let navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const handleClick = () => {
    setExpanded(!expanded);
  };

  const frozen = useSelector((state) => state.settings.frozen);
  const login = useSelector((state) => state.settings.login);
  const rights = useSelector((state) => state.settings.rights);

  const initial = () => {
    let pathName = location.pathname;
    let currentPath = items.find((item) => item.route === pathName);
    if (currentPath.text) {
      //setSelected(currentPath.route);
      return currentPath.text;
    }
  };
  const [selected, setSelected] = React.useState(initial());
  const [settings, setSettings] = React.useState([]);
  const [rights2, setRights2] = React.useState([]);
  const [getRightsSettings] = useGetRightsSettingsMutation();
  React.useEffect(() => {
    // alert("USEEFFECT");
    //if (!location) return;
    // navigate(location.pathname);
    // console.log(items);
    if (items.find((item) => item.route === location.pathname)) {
      setSelected(items.find((item) => item.route === location.pathname).text);
    }
  }, [location.pathname]);
  React.useEffect(() => {
    console.error(selected);
  });
  React.useEffect(() => {
    getRightsSettings(localStorage.getItem("login"))
      .unwrap()
      .then((payload) => {
        setRights2(payload.map((el) => el.code));
      })
      .catch((err) => console.error(err));
  }, []);

  // React.useEffect(() => {
  //   if (!rights) return;
  //   getRightsSettings(localStorage.getItem("login"))
  //     .unwrap()
  //     .then((payload) => {
  //       setSettings(payload);
  //     })
  //     .catch((err) => console.error(err));
  //   setSettings(rights);
  // }, []);

  // const settings = useSelector((state) => state.settings.value);

  const setSelectedItem = (pathName) => {
    let currentPath = items.find((item) => item.route === pathName);
    if (currentPath.text) {
      //setSelected(currentPath.route);
      return currentPath.text;
    }
  };

  const onSelect = (e) => {
    let route;
    console.error(e.itemTarget.props.route);
    route = e.itemTarget.props.route;
    if (frozen) {
      if (
        window.confirm(
          "Ваша информация будет потеряна, если Вы покинете страницу"
        )
      ) {
        navigate(e.itemTarget.props.route);
        dispatch(freeze(false));
        setSelected(setSelectedItem(route));
      }
    } else {
      if (route) {
        navigate(route);
        setSelected(setSelectedItem(route));
      }
    }
    // setExpanded(!expanded);
  };

  const [opened, setOpened] = useState(true);
  const [openedStateMode, setOpenedStateMode] = useState("shrink");
  const [revealMode, setRevealMode] = useState("slide");
  const [position, setPosition] = useState("left");

  const toolbarItems = useMemo(
    () => [
      {
        widget: "dxButton",
        location: "before",
        options: {
          icon: "menu",
          stylingMode: "text",
          onClick: () => setOpened(!opened),
        },
      },
    ],
    [opened, setOpened]
  );
  const onOpenedStateModeChanged = useCallback(
    ({ value }) => {
      setOpenedStateMode(value);
    },
    [setOpenedStateMode]
  );
  const onRevealModeChanged = useCallback(
    ({ value }) => {
      setRevealMode(value);
    },
    [setRevealMode]
  );
  const onPositionChanged = useCallback(
    ({ value }) => {
      setPosition(value);
    },
    [setPosition]
  );
  const onOutsideClick = useCallback(() => {
    setOpened(false);
    return false;
  }, [setOpened]);

  // let selected = setSelectedItem(location.pathname);
  return (
    <div>
      <div className="custom-toolbar">
        <Button icon="menu" onClick={handleClick} />
        <span className="overview">{selected}</span>
        <div className="right-widget">
          <Link
            to="/home/about"
            style={{
              color: "#424242",
              fontWeight: "400",
              fontSize: "14px",
              fontFamily: "Roboto",
              marginTop: "3px",
            }}
          >
            About
          </Link>
        </div>
      </div>

      <div>
        <div className="user-container">
          {/* <img
            src={require("../assets/people/user-avatar.jpg")}
            alt="user avatar"
          /> */}
          <h1>{localStorage.getItem("login")}</h1>
          <div className="user-email">{localStorage.getItem("name")}</div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button
              onClick={() => {
                localStorage.removeItem("login");
                localStorage.removeItem("name");
                localStorage.removeItem("token");
                localStorage.removeItem("companyId");

                dispatch(loginSlice.actions.delete());
              }}
              className="user-button k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
            >
              Sign Out
            </Button>
          </Link>
        </div>
        {rights2 && (
          <Drawer
            expanded={expanded}
            position={"start"}
            mode={"push"}
            width={240}
            items={items
              .filter(
                (item) =>
                  // settings.map((item) => item.code).includes(item.rights) ||
                  rights2.includes(item.rights) || item.rights === "ALL"
              )
              .map((item) => ({
                ...item,
                selected: item.text === selected,
              }))}
            onSelect={onSelect}
            className="drawer"
          >
            <DrawerContent>
              {props.children}
              <Outlet />{" "}
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
};
export default DrawerRouterContainer;
