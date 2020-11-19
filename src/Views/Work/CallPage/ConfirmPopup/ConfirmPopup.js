import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import TypographyComponent from "../../../../Components/Typography/Typography";
import { useTranslation } from "react-i18next";
import RightArrow from  "../../../../images/next_arrow_white.svg";
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
    marginTop: '35px',

    '& button': {
      fontSize: '16px',
      fontWeight: 'normal',
      letterSpacing: '0.02em',
      borderRadius: '10px',
      color: "#fff",
      height: '48px',
      minWidth: '107px',
      padding: '10px 21px',
      textTransform: 'inherit',
      cursor: "pointer",
      margin: '0',

      '&:after': {
        content: "''",
        backgroundImage: `url(${RightArrow})`,
        height: '20px',
        width: '12px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        marginLeft: '5px',
      },

      '&.Mui-disabled': {
        '&:after': {
          display: 'none',
        },
      },
    },
  },
  continueCallBtn: {
    backgroundColor: "#2FB41A",
    marginLeft: '10px !important',
  },
  endCallBtn: {
    backgroundColor: "#FF0000",

    '&:after': {
      width: '14px !important',
    },

    '&:hover' : {
      backgroundColor: '#FF0000',
    },

    '& .MuiButton-startIcon': {
      margin: '0 auto',
    }
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
  const { handleClosePopup, openConfirmPopup, room, disconnectRoom } = props;

  const onContinueCall = () => {
    handleClosePopup();
  };

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
        if (response.type === "SUCCESS") {
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
          disconnectRoom();
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
        <div className="dialog_container">
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
        </div>
      </DialogComponent>
    </React.Fragment>
  );
};

export default withRouter(ConfirmPopupForLeavingCall);
