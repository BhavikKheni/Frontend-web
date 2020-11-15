import React, { useState} from "react";
import { InputBase, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import TypographyComponent from "../../../Components/Typography/Typography";
import ButtonComponent from "../../../Components/Forms/Button";
import ImageComponent from "../../../Components/Forms/Image";
import { themes } from "../../../themes";
import { add } from "../../../Services/Auth.service";
import { SessionContext } from "../../../Provider/Provider";
import Spinner from "../../../Components/Spinner/Spinner";
import SnackBarComponent from "../../../Components/SnackBar/SnackBar";
import "./StartWork.css";
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
  const [onLineServiceLoader, setOnLineServiceLoader] = useState(false);
  const [offLineServiceLoader, setOffLineServiceLoader] = useState(false);
  const [offlineButtonVisible, setOfflineButtonVisible] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState({});
  function countdown(elementName, minutes, seconds) {
    var element, endTime, hours, mins, msLeft, time;

    function twoDigits(n) {
      return n <= 9 ? "0" + n : n;
    }

    function updateTimer() {
      msLeft = endTime - +new Date();
      if (msLeft < 1000) {
        setOfflineButtonVisible(true);
      } else {
        time = new Date(msLeft);
        hours = time.getUTCHours();
        mins = time.getUTCMinutes();
        element.innerHTML =
          (hours ? hours + ":" + twoDigits(mins) : mins) +
          ":" +
          twoDigits(time.getUTCSeconds());
        setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
      }
    }

    element = document.getElementById(elementName);
    endTime = +new Date() + 1000 * (60 * minutes + seconds) + 500;
    updateTimer();
  }

  async function setLiveService(type) {
    const param = {
      id_user: user.id_user,
      live_state: type,
    };

    if (type === "ONLINE") {
      setOnLineServiceLoader(true);
    } else if (type === "OFFLINE") {
      setOffLineServiceLoader(true);
    }
    add("/service/livestate", param)
      .then((res) => {
        if (res && res) {
          setError(res);
          if (type === "ONLINE") {
            setOnLineServiceLoader(false);
            countdown("timer", 10, 0);
          } else if (type === "OFFLINE") {
            setOffLineServiceLoader(false);
          }
          setOpenSnackbar(true);
        }
      })
      .catch((error) => {
        setError(error);
        setOpenSnackbar(true);
        if (type === "ONLINE") {
          setOnLineServiceLoader(false);
        } else if (type === "OFFLINE") {
          setOffLineServiceLoader(false);
        }
      });
  }
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const changeSearch = (e) => {};

  const onSearch = (e) => {
    e.preventDefault();
  };

  const onGoOnline = () => {
    setLiveService("ONLINE");
  };

  const onGoOffline = () => {
    setLiveService("OFFLINE");
  };

  return (
    <React.Fragment>
      <TypographyComponent
        variant="h2"
        title="Service name"
        className="start_work_title"
      />
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
          {user.image === null ? (
            <ImageComponent />
          ) : (
            <Avatar className={classes.large} src={user.image} />
          )}
          <div className="work_user_total_count_wrapper">
            <TypographyComponent
              title={`${user.first_name} ${user.last_name}`}
              className="work_user_total_count_title"
            />
            <div className="work_user_total_count">
              <TypographyComponent title="Total time:" />
              <TypographyComponent title="00:00:00" />
            </div>
            <div className="work_user_total_count">
              <TypographyComponent title="Total earned:" />
              <TypographyComponent title="00.00 $" />
            </div>
            <div className="work_user_total_count">
              <TypographyComponent title="Hourly rate" />
              <TypographyComponent title="00.00/h" />
            </div>
          </div>
          {!offlineButtonVisible && (
            <ButtonComponent
              title="Go online"
              className="go_online"
              startIcon={onLineServiceLoader && <Spinner size="small" />}
              onClick={() => {
                onGoOnline();
              }}
            />
          )}
          {offlineButtonVisible && (
            <ButtonComponent
              title="Go offline"
              className="go_offline"
              startIcon={offLineServiceLoader && <Spinner size="small" />}
              onClick={() => {
                onGoOffline();
              }}
            />
          )}
        </div>
      </div>
      <SnackBarComponent
        open={openSnackbar}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={error.message}
        type={error.type && error.type.toLowerCase()}
      />
    </React.Fragment>
  );
};

export default StartWork;
