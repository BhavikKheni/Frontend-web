import React, { useState } from "react";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import DialogComponent from "../../Components/Dialog/Dialog";
import ButtonComponent from "../../Components/Forms/Button";
import Sppiner from "../../Components/Spinner/Spinner";
import TypographyComponent from "../../Components/Typography/Typography";
import { add } from "../../Services/Auth.service";
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

  const handleChangeOtp = (name, event) => {
    const otpValue = event.target && event.target.value;
    if (otpValue) {
      setOtp((o) => ({ ...o, [name]: otpValue }));
    }
  };
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
    const data = {
      id_user: user.id_user,
      code: Number(`${otp.otp1}${otp.otp2}${otp.otp3}${otp.otp4}`),
      type: "email",
    };
    setVerifyLoader(true);
    const res = await add("/profile/verify", data).catch((err) => {
      setTypeRes(err);
    });
    if (res && res.type === "SUCCESS") {
      setVerifyLoader(false);
      setTypeRes(res);
      setOpen(true);
      props.closeVerifyDialog();
    } else {
      setVerifyLoader(false);
      setOpen(true);
    }
  };

  const handleSubmitOtp = (e) => {
    e.preventDefault();
    onSubmitEmailCode();
  };

  const onGetCodeVerifyEmail = async () => {
    const data = {
      email: user.email,
      id_user: user.id_user,
    };
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
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <DialogComponent
      onClose={(e) => {
        e.stopPropagation();
        props.closeVerifyDialog();
      }}
      open={props.verify}
      title="E-mail verification"
      subTitle1="We’ve send a 4 digit code to your email. Please enter the code to verify your email-id."
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
                  style={{ display: "inline", marginRight: '5px'}}
                />
              </div>
              <div
                onClick={() => onGetCodeVerifyEmail()}
              >
                {verifyLoader2 ? (
                  <Sppiner size={20} />
                ) : (
                  <TypographyComponent
                    variant="h2"
                    title="Resend"
                    className='owera_link'
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
  );
};
export default Verification;
