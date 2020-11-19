import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { Grid, InputBase, Avatar, Divider } from "@material-ui/core";
import { withRouter } from "react-router-dom";
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
import SnackBarComponent from "../../../Components/SnackBar/SnackBar";
import { countdown } from "../../../utils";
import Sidebar from "./Sidebar/Sidebar";
import "./callpage.css";
const useSession = () => React.useContext(SessionContext);
const useStyles = makeStyles((theme) => ({
  video_hero_wrapper: {
    position: "relative",
    minHeight: "450px",
    border: "1px solid #d3d3d3",
    backgroundColor: "#E5E9F8",

    "& h2": {
      position: "absolute",
      left: "20px",
      top: "20px",
    },
  },
  remoteVideoContainer: {
    height: "calc(100vh - 148px)",
    overflow: "hidden",
  },
  remote_media_div: {
    "&:empty:after": {
      content: "'Loading...'",
      position: "absolute",
      fontSize: "60px",
      color: "#c5c5c5",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      marginTop: "-30px",
    },

    "& video": {
      width: "100%",
      objectFit: "cover",
      height: "100%",
      display: "block",
    },
  },
  localVideoContainer: {
    position: "absolute",
    bottom: "30px",
    right: "30px",
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
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [setRes, setTypeRes] = React.useState("");
  const { state = {} } = props && props.location;
  const [room, setRoom] = useState(null);
  const [audio, setAudio] = useState(true);
  const [onVideo, setVideo] = useState(true);
  const [isOpenConfirmPopup, openConfirmPopup] = useState(false);
  const [getTotalCost, setTotalCost] = useState(null);
  const bookingId = state.record && state.record.id_booking;
  const [sessionLoader, setSessionLoader] = useState(false);
  const [isRemoteVideoMute, setRemoteVideoMute] = useState(true);
  const [isRemoteAudioMute, setRemoteAudioMute] = useState(true);
  const onSearch = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const [remainingDuration, setRemainingDuration] = useState(
    state.record.duration
  );

  useEffect(() => {
    if (room) {
      countdown("remainingDuration", remainingDuration, 0);
      if (remainingDuration > 1) {
        setInterval(() => {
          updateSessionToBackend();
        }, 300000);
      }
    }
    // return () => clearInterval(timer);
  }, [room, remainingDuration]);

  const updateSessionToBackend = () => {
    const params = {
      user_id: user.id_user,
      booking_id: bookingId,
    };
    setSessionLoader(true);
    add("/video/end", params)
      .then((response) => {
        if (response) {
          setRemainingDuration(0);
          setSessionLoader(false);
        }
      })
      .catch((err) => {
        setSessionLoader(false);
      });
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
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };
  useEffect(() => {
    calculatePrice(
      moment(state.record.from_datetime).format("HH:mm"),
      moment(state.record.to_datetime).format("HH:mm")
    );
  }, [state.record.from_datetime, state.record.to_datetime]);

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
        <Sidebar
          record={state.record}
          sessionLoader={sessionLoader}
          getTotalCost={getTotalCost}
        />
      </div>
    );
  }, [
    setSidebarContent,
    setSidebar,
    state.record,
    sessionLoader,
    getTotalCost,
  ]);

  const onEndCall = () => {
    openConfirmPopup(true);
  };

  const onLeaveCall = () => {};

  const onContinueCall = () => {};

  const onReportAbuse = () => {};

  const onLeave = () => {};

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
    //handle video call here
    const localMediaContainer = document.getElementById("local-media");
    if (onVideo) {
      setVideo(false);
      room.localParticipant.videoTracks.forEach((publication) => {
        publication.track.disable();
      });
      localMediaContainer.innerHTML = "";
    } else {
      setVideo(true);
      localMediaContainer.innerHTML = "";
      console.log("local video enabled");

      room.localParticipant.videoTracks.forEach((publication) => {
        publication.track.enable();

        localMediaContainer.appendChild(publication.track.attach());
      });
    }
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
      participant.on("trackDisabled", (track) => {
        if (track.kind === "audio") {
          console.log("remote audio track disabled", track);
          setRemoteAudioMute(false);
        }
        if (track.kind === "video") {
          console.log("remote video track disabled", track);
          setRemoteVideoMute(false);
        }
      });
      participant.on("trackEnabled", (track) => {
        if (track.kind === "audio") {
          console.log("remote audio track enabled", track);
          setRemoteAudioMute(true);
          /****************/
          /****************/
        }
        if (track.kind === "video") {
          console.log("remote video track enabled", track);
          setRemoteVideoMute(true);
          /****************/
          /****************/
        }
      });
    }
    add("/video/join", params).then((res) => {
      const { video_token = "" } = res && res.data;

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
            /****************/
            /****************/
            console.log(`Participant "${participant.identity}" connected`);
            document.getElementById("remote-media-div").innerHTML = "";
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
              participant.on("trackAdded", (track) => {
                document
                  .getElementById("remote-media-div")
                  .appendChild(track.attach());
              });
            });
          });
          room.on("participantDisconnected", (participant) => {
            /****************/
            /****************/
            updateSessionToBackend();
            console.log(`Participant disconnected: ${participant.identity}`);
            document.getElementById("remote-media-div").innerHTML = "";
          });
        },
        (error) => {
          props.history.push("/");
          setOpenSnackBar(openSnackBar);
          setTypeRes({
            message: error.message,
            type: "error",
          });
          console.error(`Unable to connect to Room: ${error.message}`);
        }
      );
    });
  }, [bookingId, user.id_user, openSnackBar, props.history]);

  useEffect(() => {
    onFinish();
  }, [onFinish]);

  const handleClosePopup = () => {
    openConfirmPopup(false);
  };

  const disconnectRoom = () => {
    setRoom(null);
  };

  return (
    <React.Fragment>
      <div className={clsx(classes.video_hero_wrapper, "video_hero_wrapper")}>
        <TypographyComponent title={state.record.title} variant="h2" />
        <div className="remoteVideoContainer">
          <div id="remote-media-div-already"></div>
          <div id="remote-media-div" className={classes.remote_media_div}></div>
          <div className="service_calling_option">
            {isRemoteAudioMute ? (
              <MicIcon className="owera_link" />
            ) : (
              <MicOffIcon className="owera_link" />
            )}
            {isRemoteVideoMute ? (
              <VideocamIcon className="owera_link" />
            ) : (
              <VideocamOffIcon className="owera_link" />
            )}
          </div>
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
        disconnectRoom={disconnectRoom}
        room={room}
        booking_id={bookingId}
        user_id={user.id_user}
      />
      <SnackBarComponent
        open={openSnackBar}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={setRes.message}
        type={setRes.type && setRes.type.toLowerCase()}
      />
    </React.Fragment>
  );
};

export default withRouter(CallPage);
