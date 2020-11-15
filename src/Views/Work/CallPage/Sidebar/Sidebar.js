import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Divider } from "@material-ui/core";
import ImageComponent from "../../../../Components/Forms/Image";
import TypographyComponent from "../../../../Components/Typography/Typography";
import { countdown } from "../../../../utils";
import { get, search } from "../../../../Services/Auth.service";
const useStyles = makeStyles((theme) => ({
  call_timer_left: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timer_item: {
    marginTop: 10,
  },
  call_page_timer: {
    background: "#CFE9CB",
    border: "1px solid #191919",
    borderRadius: "10px",
    padding: "10px",
  },
}));

const CallPageSidebar = (props) => {
  const { userData } = props;
  const classes = useStyles();
  React.useEffect(() => {
    async function getCards() {
      const res = await get("/usercards/list").catch((err) => console.log(err));
      if (res) {
        console.log("res", res);
      }
    }
    getCards();
    async function getVideoRoomInfo() {
      search("/video/room")
        .then((res) => {
          if (res.type === "success") {
            console.log("res", res);
          }
        })
        .catch((err) => console.log(err));
    }
    getVideoRoomInfo();
  }, []);

  return (
    <React.Fragment>
      {!userData.image ? <ImageComponent /> : <Avatar src={userData.image} />}
      <TypographyComponent
        title={`${userData.first_name} ${userData.last_name}`}
      />
      <Divider className="divider" />
      <div className={classes.call_timer_left}>
        <TypographyComponent title="Time left" />
        <TypographyComponent title="120 Min" />
      </div>
      <div className="stay-Longer">
        <span>Stay Longer?</span>
        {/* <img src={ArrowIcon} alt="stay longer" /> */}
      </div>
      <div className={classes.timer_item}>
        <span
          id="timer-15"
          onClick={() => {
            countdown("timer", 15, 0);
          }}
          className={classes.call_page_timer}
        >
          15 min
        </span>
        <span
          onClick={() => {
            countdown("timer-30", 30, 0);
          }}
          id="timer-30"
          className={classes.call_page_timer}
        >
          30 min
        </span>
        <span
          onClick={() => {
            countdown("timer-60", 60, 0);
          }}
          id="timer-60"
          className={classes.call_page_timer}
        >
          60 min
        </span>
      </div>
      <div>
        <TypographyComponent title="Total:" />
        <TypographyComponent title="00.0$" />
      </div>
    </React.Fragment>
  );
};

export default CallPageSidebar;
