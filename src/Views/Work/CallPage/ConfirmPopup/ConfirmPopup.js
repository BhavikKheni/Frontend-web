import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import TypographyComponent from "../../../../Components/Typography/Typography";
import { useTranslation } from "react-i18next";
import NextArrow from "../../../../images/next_arrow_white.svg";
import DialogComponent from "../../../../Components/Dialog/Dialog";
import { themes } from "../../../../themes";
import { add } from "../../../../Services/Auth.service";
import ButtonComponent from "../../../../Components/Forms/Button";
import Spinner from "../../../../Components/Spinner/Spinner";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const { handleClosePopup, openConfirmPopup, room } = props;

  const onContinueCall = () => {};

  const onReportAbuse = () => {};

  const onLeaveCall = () => {
    const params = {
      booking_id: props && props.booking_id,
      user_id: props && props.user_id,
    };
    setIsLoading(true);
    setIsDisable(true);
    add("/video/end", params)
      .then((response) => {
        if (response.type === "success") {
          const { history } = props;
          setIsLoading(false);
          setIsDisable(false);
          room.on("disconnected", (room) => {
            room.localParticipant.tracks.forEach((publication) => {
              publication.track.stop();
              publication.unpublish();
              const attachedElements = publication.track.detach();
              attachedElements.forEach((element) => element.remove());
            });
          });
          history.push("/");
          room.disconnect();
          handleClosePopup();
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
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
            <ButtonComponent
              title="Leave"
              onClick={() => {
                onLeaveCall();
              }}
              className={classes.endCallBtn}
              startIcon={isLoading && <Spinner size={20} />}
              loader={isLoading}
              disabled={isDisable}
            />
            <ButtonComponent
              onClick={() => {
                onContinueCall();
              }}
              title="Continue with call"
              className={classes.continueCallBtn}
              // startIcon={isLoading && <Spinner size={20} />}
              // loader={isLoading}
              // disabled={isDisable}
            />
          </div>
        </DialogContent>
      </DialogComponent>
    </React.Fragment>
  );
};

export default withRouter(ConfirmPopupForLeavingCall);
