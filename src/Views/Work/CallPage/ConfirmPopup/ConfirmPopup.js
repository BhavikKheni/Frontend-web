import React, { useState } from 'react';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import TypographyComponent from "../../../../Components/Typography/Typography";
import { useTranslation } from "react-i18next";
import NextArrow from "../../../../images/next_arrow_white.svg";
import DialogComponent from "../../../../Components/Dialog/Dialog";
import { themes } from "../../../../themes";

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const useStyles = makeStyles((theme) => ({
  endCallWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  continueCallBtn: {
    backgroundColor: "#2FB41A",
    borderRadius: 10,
    height: 48,
    padding: 12,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  endCallBtn: {
    backgroundColor: "#FF0000",
    borderRadius: 10,
    border: "1px solid #FF0000",
    height: 48,
    padding: 12,
    marginRight: 10,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  endCallMessage: {
    color: "#fff",
  },
}));

const ConfirmPopupForLeavingCall = (props) => {

  const classes = useStyles();
  const { t } = useTranslation();

  const {
    handleClosePopup,
    openConfirmPopup,
    room
  } = props;

  const onContinueCall = () => {};

  const onReportAbuse = () => {};

  const onLeaveCall = () => {
    room.on("disconnected", (room) => {
      room.localParticipant.tracks.forEach((publication) => {
        const attachedElements = publication.track.detach();
        attachedElements.forEach((element) => element.remove());
      });
    });
    room.disconnect();
  };

  return (
    <React.Fragment>
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          handleClosePopup();
        }}
        open={openConfirmPopup}
        title={t("video-call.title")}
      >
        <DialogContent>
          <TypographyComponent
            title={t("video-call.message")}
            className={classes.endCallMessage}
          />
          <div className={classes.endCallWrapper}>
            <div
              onClick={() => {
                onLeaveCall();
              }}
              className={classes.endCallBtn}
            >
              <span>Leave</span>
              <img
                src={NextArrow}
                alt="call end icon"
                style={{ width: "15px", height: "15px" }}
              />
            </div>
            <div
              onClick={() => {
                onContinueCall();
              }}
              className={classes.continueCallBtn}
            >
              <span>Continue with call</span>
              <img
                src={NextArrow}
                alt="call end icon"
                style={{ width: "15px", height: "15px" }}
              />
            </div>
          </div>
        </DialogContent>
      </DialogComponent>
    </React.Fragment>
  )
}

export default ConfirmPopupForLeavingCall;
