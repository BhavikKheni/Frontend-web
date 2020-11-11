import React, { useState, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import DialogComponent from "../../Components/Dialog/Dialog";
import ButtonComponent from "../../Components/Forms/Button";
import Sppiner from "../../Components/Spinner/Spinner";
import TypographyComponent from "../../Components/Typography/Typography";
import {
  add,
  setLocalStorage,
  getLocalStorage,
} from "../../Services/Auth.service";
import SnackBarComponent from "../../Components/SnackBar/SnackBar";
import "./VerificationDialog.css";

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const Verification = (props) => {
  const [otp, setOtp] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
  });
  const { user } = props;

  const [verifyLoader, setVerifyLoader] = useState(false);
  const [verifyLoader2, setVerifyLoader2] = useState(false);
  const [setRes, setTypeRes] = useState("");
  const [open, setOpen] = React.useState(false);
  const [successDialog, setSuccessDialog] = useState(false);

  const handleChangeOtp = useCallback((name, event) => {
    const otpValue = event.target && event.target.value;
    setOtp((o) => ({ ...o, [name]: otpValue }));
  }, []);

  const inputfocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      const next = elmnt.target.tabIndex;
      if (next < 4) {
        elmnt.target.form.elements[next].focus();
      }
    }
  };

  const onSubmitEmailCode = async () => {
    let data = {
      id_user: user.id_user,
      code: `${otp.otp1}${otp.otp2}${otp.otp3}${otp.otp4}`,
    };

    if (props.type === "email") {
      data.type = "email";
    } else if (props.type === "phone") {
      data.type = "phone";
    }

    setVerifyLoader(true);
    const res = await add("/profile/verify", data).catch((err) => {
      setTypeRes(err);
    });

    if (res && res.type === "SUCCESS") {
      setVerifyLoader(false);
      setTypeRes(res);
      setOpen(true);
      getLocalStorage().then((res) => {
        setLocalStorage({ ...res, email_verified: true });
      });
      props.closeVerifyDialog();
      setSuccessDialog(true);
    } else if (res && res.type === "ERROR") {
      setTypeRes({
        message: res.message,
        type: res.type,
      });
      setVerifyLoader(false);
      setOpen(true);
    }
  };

  const handleSubmitOtp = (e) => {
    e.preventDefault();
    onSubmitEmailCode();
  };

  const onGetCodeVerifyEmail = async () => {
    let data = {
      email: user.email,
      id_user: user.id_user,
    };
    if (props.type === "email") {
      setVerifyLoader2(true);
      const res = await add("/profile/verifyemail", data).catch((err) => {
        setTypeRes(err);
        setVerifyLoader2(false);
      });
      if (res && res.type === "SUCCESS") {
        setVerifyLoader2(false);
        setTypeRes(res);
        setOpen(true);
      } else {
        setOpen(true);
      }
    } else if (props.type === "mobile") {
      let data = {
        mobile: user.phone_no,
        id_user: user.id_user,
      };

      const res = await add("/profile/verifyphone", data).catch((err) => {
        setTypeRes(err);
        setVerifyLoader2(false);
      });
      if (res && res.type === "SUCCESS") {
        setVerifyLoader2(false);
        setTypeRes(res);
        setOpen(true);
      } else {
        setOpen(true);
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onFinish = () => {
    setSuccessDialog(false);
    if(props.onPromotionLinkHide){
      props.onPromotionLinkHide();
    }
  };

  return (
    <React.Fragment>
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          props.closeVerifyDialog();
        }}
        open={props.verify}
        title={props.title}
        subTitle1={props.subTitle1}
        className="otp_Varification"
      >
        <div className="dialog_container">
          <DialogContent>
            <form onSubmit={handleSubmitOtp}>
              <div className="dialog_form_row">
                <input
                  name="otp1"
                  type="text"
                  autoComplete="off"
                  value={otp.otp1}
                  onChange={(e) => handleChangeOtp("otp1", e)}
                  tabIndex="1"
                  maxLength="1"
                  onKeyUp={(e) => inputfocus(e)}
                />
                <input
                  name="otp2"
                  type="text"
                  autoComplete="off"
                  value={otp.otp2}
                  onChange={(e) => handleChangeOtp("otp2", e)}
                  tabIndex="2"
                  maxLength="1"
                  onKeyUp={(e) => inputfocus(e)}
                />
                <input
                  name="otp3"
                  type="text"
                  autoComplete="off"
                  value={otp.otp3}
                  onChange={(e) => handleChangeOtp("otp3", e)}
                  tabIndex="3"
                  maxLength="1"
                  onKeyUp={(e) => inputfocus(e)}
                />
                <input
                  name="otp4"
                  type="text"
                  autoComplete="off"
                  value={otp.otp4}
                  onChange={(e) => handleChangeOtp("otp4", e)}
                  tabIndex="4"
                  maxLength="1"
                  onKeyUp={(e) => inputfocus(e)}
                />
              </div>
              <div className="modal_bottom_cta">
                <div>
                  <TypographyComponent
                    variant="h2"
                    title="Didn’t get code?"
                    style={{ display: "inline", marginRight: "5px" }}
                  />
                </div>
                <div onClick={() => onGetCodeVerifyEmail()}>
                  {verifyLoader2 ? (
                    <Sppiner size={20} />
                  ) : (
                    <TypographyComponent
                      variant="h2"
                      title="Resend"
                      className="owera_link"
                    />
                  )}
                </div>
                <ButtonComponent
                  variant="contained"
                  color="primary"
                  type="submit"
                  className="send-code"
                  startIcon={verifyLoader && <Sppiner />}
                  title="Verify"
                  loader={verifyLoader}
                />
              </div>
            </form>
          </DialogContent>
        </div>
        <SnackBarComponent
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          message={setRes.message}
          type={setRes.type && setRes.type.toLowerCase()}
        ></SnackBarComponent>
      </DialogComponent>
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          setSuccessDialog(false);
        }}
        open={successDialog}
        title={props.title}
        subTitle1="Congratulations! Your e-mail has been verified."
        className="otp_Varification"
      >
        <div className="dialog_container">
          <DialogContent>
            <ButtonComponent title="Finish" onClick={onFinish} />
          </DialogContent>
        </div>
      </DialogComponent>
    </React.Fragment>
  );
};
export default Verification;
