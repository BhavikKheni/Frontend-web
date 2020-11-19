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
  call_sidebar_avatar: {
    width: '187px',
    height: '187px',
    borderRadius: '50%',
    overflow: 'hidden',
    margin: '0 auto 30px',

    '& img': {
      width: '187px',
      height: '187px',
    },
    
    '& .MuiAvatar-root': {
      width: '187px',
      height: '187px',
    },
  },
  caller_username : {
    fontFamily: 'Rubik',
    fontSize: '18px',
    lineHeight: '30px',
    letterSpacing: '0.02em',
    color: '#303030',
  },
  call_remaining_time : {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    marginBottom: '5px',
  },
  call_time_wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  call_page_timer: {
    fontFamily: 'Rubik',
    fontSize: '16px',
    lineHeight: '33px',
    letterSpacing: '0.02em',
    color: '#191919',
    border: '1px solid #191919',
    padding: '10px',
    backgroundColor: '#CFE9CB',
    borderRadius: '10px',
    // width: '86px',
    width: '78px',
    height: '55px',
    display: 'block',
    textAlign: 'center',
  },
  call_total_time : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '5px 0 15px',

    '& P': {
      fontFamily: 'Rubik',
      fontSize: '24px',
      lineHeight: '30px',
      letterSpacing: '0.02em',
      color: '#303030',
    }
  },
  
  call_select: {
    '& .MuiFormControl-root': {
      width: '100%',
    },

    '& label:not(.Mui-focused)': {
      lineHeight: '12px',
      marginLeft: '10px',
    },

    '& fieldset': {
      border: '1px solid #303030',
      borderRadius: '10px',
    }
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
        <div className={classes.call_sidebar_avatar}>
          <ImageComponent />
        </div>
      ) : (
        <div className={classes.call_sidebar_avatar}>
          <Avatar src={record.provider_profile_image} />
        </div>
      )}
      <TypographyComponent title={`${record.provider_name}`} className={classes.caller_username} />
      <Divider className="divider" />
      <div className={classes.call_remaining_time}>
        <TypographyComponent title="Time left" />
        {sessionLoader ? <Spinner /> : <p><b id="remainingDuration"></b></p>}
      </div>
      <div>
        <p><b>Stay Longer?</b></p>
        {/* <img src={ArrowIcon} alt="stay longer" /> */}
      </div>
      <div className={classes.call_time_wrapper}>
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
      <div className={classes.call_total_time}>
        <TypographyComponent title="Total:" />
        <TypographyComponent title={`${getTotalCost} CHF`} />
      </div>
      <div className={classes.call_select}>
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
      </div>
    </React.Fragment>
  );
};

export default CallPageSidebar;
