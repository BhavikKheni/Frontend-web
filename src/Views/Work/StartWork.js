import React from "react";
import { Grid, InputBase, Avatar, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import TypographyComponent from "../../Components/Typography/Typography";
import ButtonComponent from "../../Components/Forms/Button";
import { themes } from "../../themes";
import "./StartWork.css";

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
  const changeSearch = (e) => {};

  const onSearch = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={10}>
          <TypographyComponent title="Service name" />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={10}>
          <div className="service_call">
            <div className="service_calling_wrapper">
              <InputBase
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
                onChange={changeSearch}
              />
              <span className={classes.searchIconItem} onClick={onSearch}>
                <SendIcon className={classes.searchIcon} />
              </span>
            </div>
            <div>
              <MicOffIcon />
              <VideocamOffIcon /> <DesktopWindowsIcon />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={2}>
          <Avatar className={classes.large} />
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
          <ButtonComponent title="Go online" />
          <ButtonComponent title="Off online" />
        </Grid>
      </Grid>
    </div>
  );
};

export default StartWork;
