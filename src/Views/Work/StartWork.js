import React from "react";
import { InputBase, Avatar, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import TypographyComponent from "../../Components/Typography/Typography";
import ButtonComponent from "../../Components/Forms/Button";
import ImageComponent from "../../Components/Forms/Image";
import { themes } from "../../themes";
import "./StartWork.css";

import { SessionContext } from "../../Provider/Provider";
const useSession = () => React.useContext(SessionContext);
const useStyles = makeStyles((theme) => ({
  search: {
    display: "flex",
    background: "#FFFFFF",
    border: "2px solid #303030",
    borderRadius: 25,
    width: "100%",
  },
  searchIconItem: {
    width: "100%",
    maxWidth: 60,
    backgroundColor: themes.default.colors.green,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  searchIcon: {
    marginLeft: 15,
    marginTop: 5,
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    color: themes.default.colors.white,
  },
  inputRoot: {
    color: themes.default.colors.darkGray,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}));

const StartWork = () => {
  const classes = useStyles();
  const { user } = useSession();
  const changeSearch = (e) => {};

  const onSearch = (e) => {
    e.preventDefault();
  };
  
  return (
    <div>
      <TypographyComponent title="Service name" className="start_wrok_title" />
      <div className="start_work_hero">
        <div className="start_work_hero_left">
          <div className="service_calling_wrapper">
            <div className="service_calling_message">
              <InputBase
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
                onChange={changeSearch}
              />
              <span className={classes.searchIconItem} onClick={onSearch}>
                <SendIcon className={classes.searchIcon} />
              </span>
            </div>
            <div className="service_calling_option">
              <MicOffIcon className="owera_link" />
              <VideocamOffIcon className="owera_link" />
              <DesktopWindowsIcon className="owera_link" />
            </div>
          </div>
        </div>
        <div className="start_work_hero_right">
          {user.image ? (
            <Avatar className={classes.large} src={user.image} />
          ) : (
            <ImageComponent />
          )}
          <TypographyComponent title="Name" />
          <Divider className="divider" />
          <div className="calling-right-sidebar">
            <TypographyComponent title="Total time:" />
            <TypographyComponent title="00:00:00" />
          </div>
          <div className="calling-right-sidebar">
            <TypographyComponent title="Total earned:" />
            <TypographyComponent title="00.00 $" />
          </div>
          <div className="calling-right-sidebar">
            <TypographyComponent title="Hourly rate" />
            <TypographyComponent title="00.00/h" />
          </div>
          <ButtonComponent title="Go online" className="go-online" />
          <ButtonComponent title="Off online" className="off-line" />
        </div>
      </div>
    </div>
  );
};

export default StartWork;
