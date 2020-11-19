import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Divider, FormControl } from "@material-ui/core";
import ImageComponent from "../../../../Components/Forms/Image";
import TypographyComponent from "../../../../Components/Typography/Typography";
import { countdown } from "../../../../utils";
import { get, search } from "../../../../Services/Auth.service";
import SelectComponent from "../../../../Components/Forms/Select";
import Spinner from "../../../../Components/Spinner/Spinner";

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
  const { getTotalCost, sessionLoader, record } = props;
  console.log("sidebar", record);
  const [cardList, setCardList] = useState([]);
  const classes = useStyles();
  const [selectCard, setSelectCard] = useState(10);
  React.useEffect(() => {
    async function getCards() {
      const res = await get("/usercards/list").catch((err) => console.log(err));
      if (res) {
        setCardList(res);
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
      {!record.provider_profile_image ? (
        <ImageComponent />
      ) : (
        <Avatar src={record.provider_profile_image} />
      )}
      <TypographyComponent title={`${record.provider_name}`} />
      <Divider className="divider" />
      <div className="call-time">
        <TypographyComponent title="Time left" />
        {sessionLoader ? <Spinner /> : <span id="remainingDuration"></span>}
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
        <TypographyComponent title={`${getTotalCost} CHF`} />
      </div>
      <FormControl variant="outlined">
        <SelectComponent
          name="select card"
          label="Select card"
          value={selectCard}
          onChange={(e) => {
            setSelectCard(e.target.value);
          }}
          native
        >
          {cardList &&
            cardList.map((l, index) => {
              return (
                <option key={index} value={l.card_token_id}>
                  {l.card_token_id}
                </option>
              );
            })}
        </SelectComponent>
      </FormControl>
    </React.Fragment>
  );
};

export default CallPageSidebar;
