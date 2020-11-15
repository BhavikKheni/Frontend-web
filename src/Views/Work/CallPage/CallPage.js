import React, { useState, useEffect, useCallback } from "react";
import { Grid, InputBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import { connect, createLocalTracks } from "twilio-video";
import CallEndIcon from "@material-ui/icons/CallEnd";
import { useTranslation } from "react-i18next";
import ArrowIcon from "../../../images/select_arrow.svg";
import { themes } from "../../../themes";
import { useSidebar } from "../../../Provider/SidebarProvider";
import { get, add } from "../../../Services/Auth.service";
import Spinner from "../../../Components/Spinner/Spinner";
import { SessionContext } from "../../../Provider/Provider";
import ConfirmPopupForLeavingCall from "./ConfirmPopup/ConfirmPopup";
import Sidebar from "./Sidebar/Sidebar";

import "./callpage.css";

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

const CallPage = (props) => {
  const { state = {} } = props && props.location;
  const bookingId = state.record && state.record.id_booking;
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useSession();
  const [counter, setCounter] = useState(5);
  const [simpathy, setSimpathy] = useState();
  const [service_quality, setServiceQuality] = useState();
  const { setSidebarContent, setSidebar } = useSidebar();
  const [room, setRoom] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [audio, setAudio] = useState(true);
  const [onVideo, setVideo] = useState(true);
  const [isOpenConfirmPopup, openConfirmPopup] = useState(false);
  const { record = {} } = state;

  let [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    image: "",
  });

  const onSendMessage = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const getProfileInfo = async () => {
      setLoading(true);
      const res = await get(`/profile/${record.provider_id_user}`).catch(
        (err) => {
          setLoading(false);
        }
      );

      if (res) {
        setUserData({
          ...res.data,
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    getProfileInfo();
  }, [record.provider_id_user]);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div style={{ margin: 20 }}>
        {isLoading ? <Spinner /> : <Sidebar userData={userData} />}
      </div>
    );
  }, [setSidebar, isLoading, setSidebarContent, state, userData]);

    useEffect(() => {
    if (counter === 0) {
      onFinish();
    }
  }, [onFinish, counter]);

  const onEndCall = () => {
    openConfirmPopup(true);
  };

  const makeAudioTrackDisable = () => {
    room.localParticipant.audioTracks.forEach((publication) => {
      if (audio) {
        publication.track.disable();
        setAudio(false);
      } else {
        publication.track.enable();
        setAudio(true);
      }
    });
  };

  const videoTracksdisable = () => {
    //handle video call here
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
  function handleTrackEnabled(track) {
    track.on("enabled", () => {
      alert("mute or unmute");
    });
  }
  const onFinish = useCallback(() => {
    getTwillioToken();
  }, [bookingId, user.id_user]);

  const getTwillioToken = () => {
    const params = {
      user_id: user.id_user,
      booking_id: bookingId,
    };
    add("/video/join", params).then((res) => {
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
      connectVideo(video_token);
    });
  }

  const connectVideo = (video_token) => {
    connect(video_token, { booking_id: bookingId }).then(
      (room) => {
        setRoom(room);
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
        subscribeEventsForParticipants();
      },
      (error) => {
        console.error(`Unable to connect to Room: ${error.message}`);
      }
    );
  }

  const attachTrack = (track, container) => {
    container.appendChild(track.attach());
  }

  const participantConnected = (participant) => {
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

  const subscribeEventsForParticipants = () => {
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
        participant.tracks.forEach((track) => {
          document
            .getElementById("remote-media-div")
            .appendChild(track.attach());
        });

        participant.on("trackAdded", (track) => {
          document
            .getElementById("remote-media-div")
            .appendChild(track.attach());
        });
      });
    });
  }

  const handleClosePopup = () => {
    openConfirmPopup(false);
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={10}>
          <span id="count">{counter !== 0 && counter}</span>
          <div className="remoteVideoContainer">
            <div id="remote-media-div-already"></div>
            <div id="remote-media-div"></div>
          </div>
          <div className="localVideoContainer">
            <div id="local-media" style={{ height: "150px", width: "150px" }} />
          </div>
          <div className="start_work_hero_left">
            <div className="service_calling_wrapper">
              <div className="service_calling_message">
                <InputBase placeholder="Tell us write here" />
                <span
                  className={classes.searchIconItem}
                  onClick={onSendMessage}
                >
                  <SendIcon className={classes.searchIcon} />
                </span>
              </div>
              <div className="service_calling_option">
                {audio ? (
                  <MicIcon
                    onClick={() => makeAudioTrackDisable()}
                    className="owera_link"
                  />
                ) : (
                  <MicOffIcon
                    onClick={() => makeAudioTrackDisable()}
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
        </Grid>
      </Grid>
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
