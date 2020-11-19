import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { Grid, InputBase, Avatar, Divider } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import SendIcon from "@material-ui/icons/Send";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import CallEndIcon from "@material-ui/icons/CallEnd";
import TypographyComponent from "../../../Components/Typography/Typography";
import ArrowIcon from "../../../images/select_arrow.svg";
import DialogComponent from "../../../Components/Dialog/Dialog";
import { useTranslation } from "react-i18next";
import { themes } from "../../../themes";
import { useSidebar } from "../../../Provider/SidebarProvider";
import NextArrow from "../../../images/next_arrow_white.svg";
import { get, add } from "../../../Services/Auth.service";
import Spinner from "../../../Components/Spinner/Spinner";
import { connect, createLocalTracks } from "twilio-video";
import ConfirmPopupForLeavingCall from "./ConfirmPopup/ConfirmPopup";
import { SessionContext } from "../../../Provider/Provider";
import moment from "moment";
import "./callpage.css";
const useSession = () => React.useContext(SessionContext);
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const useStyles = makeStyles((theme) => ({
  video_hero_wrapper: {
    position: 'relative',
    minHeight: '450px',
    border: '1px solid #d3d3d3',
    backgroundColor: '#E5E9F8',

    '& h2' : {
      position: 'absolute',
      left: '20px',
      top: '20px',
    }
  },
  remoteVideoContainer : {
    height: 'calc(100vh - 148px)',
    overflow: 'hidden',
  },
  remote_media_div: {

    '&:empty:after' : {
      content: "'Loading...'",
      position: 'absolute',
      fontSize: '60px',
      color: '#c5c5c5',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      marginTop: '-30px',
    },

    '& video' : {
      width: '100%',
      objectFit: 'cover',
      height: '100%',
      display: 'block',
    }
  },
  localVideoContainer: {
    position: 'absolute',
    bottom: '30px',
    right: '30px',
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
}));

const CallPage = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useSession();
  const [counter, setCounter] = React.useState(5);
  const [simpathy, setSimpathy] = useState();
  const [service_quality, setServiceQuality] = useState();
  const { setSidebarContent, setSidebar } = useSidebar();
  const [endCallOpen, setEndCallOpen] = useState(false);
  const { state = {} } = props && props.location;
  const [room, setRoom] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [audio, setAudio] = useState(true);
  const [onVideo, setVideo] = useState(true);
  const [isOpenConfirmPopup, openConfirmPopup] = useState(false);
  const [getTotalCost, setTotalCost] = useState(null);
  const bookingId = state.record && state.record.id_booking;

  let [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    image: "",
  });

  const onSearch = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    console.log("state.record: ", state.record);
    async function getData() {
      setLoading(true);
      const res = await get(`/profile/${user.id_user}`).catch((err) => {
        setLoading(false);
      });

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

  const [remainingDuration, setRemainingDuration] = useState(state.record.duration);

  useEffect(() => {
    setInterval(() => {
      updateSessionToBackend();
    }, 5000);
    // return () => clearInterval(timer);
  }, []);


  const updateSessionToBackend = () => {
    console.log("1111", remainingDuration);
    const a = remainingDuration - 1;
    setRemainingDuration(a);
    console.log("222", remainingDuration);
    console.log("3333", parseInt(remainingDuration)-1);
  };

  const calculatePrice = (get_from_time, get_to_time) => {
    const pricePerHour = parseInt(state.record.price);
    const pricePerMinute = pricePerHour / 60;
    const startTimeInMinutes = getTimeInMinutes(get_from_time);
    const endTimeInMinutes = getTimeInMinutes(get_to_time);

    const finalTime = endTimeInMinutes - startTimeInMinutes;
    const totalCost = finalTime * pricePerMinute;
    setTotalCost(totalCost);
  };

  useEffect(() => {
    calculatePrice(moment(state.record.from_datetime).format("HH:mm"), moment(state.record.to_datetime).format("HH:mm"));
  }, [state.record.from_datetime, state.record.to_datetime])


  // Function will convert 13:45 time to minutes
  const getTimeInMinutes = (time) => {
    const hourTime = parseInt(time.toString().split(":")[0]);
    const minuteTime = parseInt(time.toString().split(":")[1]);
    const timeInMinutes = hourTime * 60 + minuteTime;
    return timeInMinutes;
  };

  useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div style={{ margin: 20 }}>
        {isLoading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <Avatar className={classes.large} src={state.record.provider_profile_image} />
            <TypographyComponent
              title={`${state.record.provider_name}`}
            />
            <Divider className="divider" />
            <div className="call-time">
              <TypographyComponent title="Time left" />
              <TypographyComponent title={remainingDuration} />
            </div>
            {/* <div className="stay-Longer">
              <span>Stay Longer?</span>
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
            </div> */}
            <div>
              <TypographyComponent title="Total:" />
              <TypographyComponent title={`${getTotalCost} CHF`} />
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }, [
    setSidebarContent,
    setSidebar,
    classes.large,
    isLoading,
    userData.first_name,
    userData.last_name,
    userData.image,
  ]);

  const onEndCall = () => {
    openConfirmPopup(true);
  };

  const onLeaveCall = () => {};

  const onContinueCall = () => {};

  const onReportAbuse = () => {};

  const onLeave = () => {

  };

  const audioTracksdisable = () => {
    room.localParticipant.audioTracks.forEach((publication) => {
      if (audio) {
        publication.track.disable();
        setAudio(false);
        console.log("local audio disabled");
      } else {
        publication.track.enable();
        setAudio(true);
        console.log("local audio enable");
      }
    });
  };
  const videoTracksdisable = () => {
    // handle video call here
    room.localParticipant.videoTracks.forEach((publication) => {
      if (onVideo) {
        setVideo(false);
        publication.track.disable();
      } else {
        setVideo(true);
        publication.track.enable();
      }
    });
  };

  const onFinish = useCallback(() => {
    const params = {
      user_id: user.id_user,
      booking_id: bookingId,
    };
    function attachTrack(track, container) {
      container.appendChild(track.attach());
    }
    function participantConnected(participant) {
      participant.tracks.forEach((publication) => {
        if (publication.isSubscribed) {
          attachTrack(
            publication.track,
            document.getElementById("remote-media-div")
          );
        }
      });
      participant.on("trackSubscribed", (track) => {
        attachTrack(track, document.getElementById("remote-media-div"));
      });
    }

    add("/video/join", params).then((res) => {
      // Temporary code start - This code will execute if the auth token is invalid/expired/not-logged-in
      console.log(res);

      // Temporary code end

      let video_token = res.data.video_token;

      createLocalTracks({
        audio: true,
        video: { width: 150, height: 150 },
      }).then(function (localTracks) {
        const localMediaContainer = document.getElementById("local-media");
        localTracks.forEach(function (track) {
          localMediaContainer.innerHTML = "";
          localMediaContainer.appendChild(track.attach());
        });
      });
      connect(video_token, { booking_id: bookingId }).then(
        (room) => {
          console.log(`Successfully joined a Room: ${room}`);
          setRoom(room);
          // Log any Participants already connected to the Room

          room.participants.forEach(participantConnected);

          room.participants.forEach((participant) => {
            console.log(
              `Participant "${participant.identity}" is connected to the Room`
            );
            participant.tracks.forEach((publication) => {
              console.log("publication", publication);
              if (publication.track) {
                document
                  .getElementById("remote-media-div-already")
                  .appendChild(publication.track.attach());
              }
            });
          });

          room.on("participantConnected", (participant) => {
            console.log(`Participant "${participant.identity}" connected`);

            participant.tracks.forEach((publication) => {
              if (publication.isSubscribed) {
                const track = publication.track;
                document
                  .getElementById("remote-media-div")
                  .appendChild(track.attach());
              }
            });

            participant.on("trackSubscribed", (track) => {
              document
                .getElementById("remote-media-div")
                .appendChild(track.attach());
            });
            room.participants.forEach((participant) => {
              // participant.tracks.forEach((track) => {
              //   document
              //     .getElementById("remote-media-div")
              //     .appendChild(track.attach());
              // });

              participant.on("trackAdded", (track) => {
                document
                  .getElementById("remote-media-div")
                  .appendChild(track.attach());
              });
            });
          });
        },
        (error) => {
          console.error(`Unable to connect to Room: ${error.message}`);
        }
      );
    });
  }, [bookingId, user.id_user]);

  useEffect(() => {
    onFinish();
  }, [onFinish]);

  const handleClosePopup = () => {
    openConfirmPopup(false);
  };

  return (
    <React.Fragment>
      <div className={clsx(classes.video_hero_wrapper, 'video_hero_wrapper')}>
        <TypographyComponent title={state.record.title} variant="h2" />
        <div className="remoteVideoContainer">
          <div id="remote-media-div-already"></div>
          <div id="remote-media-div" className={classes.remote_media_div}></div>
        </div>
        <div className={classes.localVideoContainer}>
          <div id="local-media" style={{ height: "150px", width: "150px" }} />
        </div>
        <div className="service_calling_wrapper">
          <div className="service_calling_message">
            <InputBase
              placeholder="Write here"
              inputProps={{ "aria-label": "search" }}
            />
            <span className={classes.searchIconItem} onClick={onSearch}>
              <SendIcon className={classes.searchIcon} />
            </span>
          </div>
          <div className="service_calling_option">
            {audio ? (
              <MicIcon
                onClick={() => audioTracksdisable()}
                className="owera_link"
              />
            ) : (
              <MicOffIcon
                onClick={() => audioTracksdisable()}
                className="owera_link"
              />
            )}
            {onVideo ? (
              <VideocamIcon
                onClick={() => videoTracksdisable()}
                className="owera_link"
              />
            ) : (
              <VideocamOffIcon
                onClick={() => videoTracksdisable()}
                className="owera_link"
              />
            )}
            <DesktopWindowsIcon className="owera_link" />
            <div
              onClick={() => {
                onEndCall();
              }}
              style={{ cursor: "pointer" }}
            >
              <CallEndIcon />
            </div>
          </div>
        </div>
      </div>
      <ConfirmPopupForLeavingCall
        handleClosePopup={handleClosePopup}
        openConfirmPopup={isOpenConfirmPopup}
        room={room}
        booking_id={bookingId}
        user_id={user.id_user}
      />
    </React.Fragment>
  );
};

export default CallPage;