import React, { useState, useEffect } from "react";
import { Grid, InputBase, Avatar, Divider } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import SendIcon from "@material-ui/icons/Send";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import CallEndIcon from "@material-ui/icons/CallEnd";
import TypographyComponent from "../../../Components/Typography/Typography";
import ArrowIcon from "../../../images/select_arrow.svg";
import DialogComponent from "../../../Components/Dialog/Dialog";
import { useTranslation } from "react-i18next";
import { themes } from "../../../themes";
import { useSidebar } from "../../../Provider/SidebarProvider";
import NextArrow from "../../../images/next_arrow_white.svg";
import { get } from "../../../Services/Auth.service";
import Spinner from "../../../Components/Spinner/Spinner";
import "./callpage.css";
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

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

const CallPage = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [counter, setCounter] = React.useState(5);
  const [simpathy, setSimpathy] = useState();
  const [service_quality, setServiceQuality] = useState();
  const { setSidebarContent, setSidebar } = useSidebar();
  const [endCallOpen, setEndCallOpen] = useState(false);
  const { state } = props && props.location;
  const [isLoading, setLoading] = useState(false);
  let [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    image: "",
  });
  const onSearch = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await get(`/profile/${state && state.userId}`);
      if (res) {
        setUserData({
          ...res.data,
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    getData();
  }, [state]);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const changeSearch = (e) => {};
  const [dynamicCounter, setDynamicCounter] = useState();
  const [timerId, setTimerID] = useState("");

  var count1 = dynamicCounter;
  var counter1 = setInterval(timer, 1000);

  function timer() {
    count1 = count1 - 1;
    if (count1 === -1) {
      clearInterval(counter1);
      return;
    }

    var seconds = count1 % 60;
    var minutes = Math.floor(count1 / 60);
    var hours = Math.floor(minutes / 60);
    minutes %= 60;
    hours %= 60;

    document.getElementById(timerId).innerHTML =
      hours + "hours : " + minutes + "minutes :" + seconds;
  }
  // var counter = 5;

  // setInterval(function () {
  //   counter--;
  //   if (counter >= 0) {
  //     let span = document.getElementById("count");
  //     span.innerHTML = counter;
  //   }
  //   if (counter === 0) {
  //     clearInterval(counter);
  //   }
  // }, 1000);

  useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div style={{ margin: 20 }}>
        {isLoading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <Avatar className={classes.large} src={userData.image} />
            <TypographyComponent
              title={`${userData.first_name} ${userData.last_name}`}
            />
            <Divider className="divider" />
            <div className="call-time">
              <TypographyComponent title="Time left" />
              <TypographyComponent title="120 Min" />
            </div>
            <div className="stay-Longer">
              <spna>Stay Longer?</spna>
              <img src={ArrowIcon} alt="stay longer" />
            </div>
            <div>
              <span
                id="timer-15"
                onClick={() => {
                  setDynamicCounter(900);
                  setTimerID("timer-15");
                }}
              >
                {!timerId && "15 min"}
              </span>
              <span
                onClick={() => {
                  setDynamicCounter(1800);
                  setTimerID("timer-30");
                }}
                id="timer-30"
              >
                30 min
              </span>
              <span
                onClick={() => {
                  setDynamicCounter(3600);
                  setTimerID("timer-60");
                }}
                id="timer-60"
              >
                60 min
              </span>
            </div>
            <div>
              <TypographyComponent title="Total:" />
              <TypographyComponent title="00.0$" />
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }, [
    setSidebarContent,
    setSidebar,
    classes.large,
    timerId,
    isLoading,
    userData.first_name,
    userData.last_name,
    userData.image
  ]);

  const onEndCall = () => {
    setEndCallOpen(true);
  };

  const onLeaveCall = () => {};

  const onContinueCall = () => {};

  const onReportAbuse = () => {};

  const onLeave = () => {};

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={10}>
          <div className="service_call">
            <TypographyComponent title="Service title" />
            <span id="count">{counter && counter}</span>
            <div>
              <TypographyComponent title="video-call.opinion" />
              <Rating
                name="quality"
                value={service_quality}
                onChange={(event, newValue) => {
                  setServiceQuality(newValue);
                }}
                size="small"
              />
              <Rating
                name="simpathy"
                value={simpathy}
                onChange={(event, newValue) => {
                  setSimpathy(newValue);
                }}
                size="small"
              />
              <div>
                <div
                  onClick={() => {
                    onReportAbuse();
                  }}
                >
                  <span>Repost abuse</span>
                  <img alt="Report abuse" src={NextArrow} />
                </div>
                <div
                  onClick={() => {
                    onLeave();
                  }}
                >
                  <span>Leave</span>
                  <img alt="leave" src={NextArrow} />
                </div>
              </div>
            </div>
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
              <CallEndIcon onClick={() => onEndCall()} />
            </div>
          </div>
        </Grid>
      </Grid>
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          setEndCallOpen(false);
        }}
        open={endCallOpen}
        title={t("video-call.title")}
        maxHeight={340}
      >
        <DialogContent>
          <TypographyComponent title={t("video-call.message")} />
          <div>
            <div
              onClick={() => {
                onLeaveCall();
              }}
            >
              <span>Leave</span>
              <img src={NextArrow} alt="call end icon" />
            </div>
            <div
              onClick={() => {
                onContinueCall();
              }}
            >
              <span>Continue with call</span>
              <img src={NextArrow} alt="call end icon" />
            </div>
          </div>
        </DialogContent>
      </DialogComponent>
    </React.Fragment>
  );
};

export default CallPage;
