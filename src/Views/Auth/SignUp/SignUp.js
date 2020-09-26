import React, { useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { FormControl } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Grid from "@material-ui/core/Grid";
import InputComponent from "../../../Components/Forms/Input";
import ButtonComponent from "../../../Components/Forms/Button";
import TypographyComponent from "../../../Components/Typography/Typography";
import { add } from "../../../Services/Auth.service";
import DialogComponent from "../../../Components/Dialog/Dialog";
import { themes } from "../../../themes";

import "./Signup.css";

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
const CustomCheckbox = withStyles({
  root: {
    color: "#949494",
    "&$checked": {
      color: "#fff",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);
const SignUp = (props) => {
  const { handleCloseSignUp, openSignUp, openSignInDialog } = props;
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [isValid, setValid] = useState(false);
  const [isError, setError] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [openTermsCondition, setTermsCondition] = useState(false);

  const [state, setState] = useState({
    email: "",
    full_name: "",
    password: "",
  });

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (state.email && state.full_name && state.password) {
      setValid(false);
      setDisabled(true);
      setError(false);
      add("/signup", state)
        .then((res) => {
          if (res && res.type === "SUCCESS") {
            setDisabled(false);
            handleCloseSignUp();
          } else {
            setDisabled(false);
          }
        })
        .catch((error) => {});
    } else {
      setValid(true);
      setError(true);
    }
  };
  const handleCloseTermsCondition = () => {
    setTermsCondition(false);
  };

  return (
    <React.Fragment>
      <DialogComponent
        onClose={handleCloseSignUp}
        open={openSignUp}
        title="Sign up"
        subTitle1="Already have an account?"
        subTitle2="Login"
        onSubTitle2={(e) => {
          e.stopPropagation();
          handleCloseSignUp();
          openSignInDialog();
        }}
        maxHeight={407}
      >
        <DialogContent style={{ textAlign: "center" }}>
          <form onSubmit={onSubmit} noValidate autoComplete="off">
            <FormControl className="signup-form-control">
              <InputComponent
                label="Full name"
                type="text"
                placeholder="Full name"
                name="full_name"
                id="outlined-name"
                value={state.full_name}
                autoFocus
                required={isValid}
                onChange={handleChange}
                error={isError}
                styles={{
                  border: isError && isValid ? "1px solid red" : "initial",
                }}
              />
              <InputComponent
                label="Email"
                type="email"
                placeholder="Email"
                name="email"
                id="outlined-email"
                value={state.email}
                required={isValid}
                onChange={handleChange}
                error={isError}
                styles={{
                  border: isError && isValid ? "1px solid red" : "initial",
                }}
              />
              <InputComponent
                label="Password"
                type="password"
                placeholder="Create password"
                name="password"
                id="outlined-password"
                value={state.password}
                required={isValid}
                onChange={handleChange}
                error={isError}
                styles={{
                  border: isError && isValid ? "1px solid red" : "initial",
                }}
              />
              <div className="item">
                <div style={{ display: "flex" }}>
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={isChecked}
                        name="checked"
                        onChange={() => {
                          setChecked(!isChecked);
                        }}
                        size="medium"
                      />
                    }
                  />
                  <div className="item-1">
                    <TypographyComponent
                      title="With your registration you agree to our"
                      variant="h1"
                      style={{
                        lineHeight: 4,
                      }}
                    />

                    <TypographyComponent
                      title="terms & conditions"
                      variant="h1"
                      onClick={() => {
                        setTermsCondition(true);
                        handleCloseSignUp();
                      }}
                      style={{
                        lineHeight: 0,
                        textAlign: "left",
                        color: themes.default.colors.green,
                      }}
                      className="terms-condition-item"
                    />
                  </div>
                </div>
                <div style={{ height: 48 }}>
                  <ButtonComponent
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isDisabled}
                    className="go"
                    endIcon={<ArrowForwardIosIcon />}
                    title="go"
                    style={{
                      backgroundColor: isChecked ? "#2FB41A" : "#949494",
                      height: 48,
                    }}
                  />
                </div>
              </div>
            </FormControl>
          </form>
        </DialogContent>
      </DialogComponent>
      <DialogComponent
        onClose={handleCloseTermsCondition}
        open={openTermsCondition}
        title="Terms & condtitions"
        maxHeight={892}
        maxWidth={1269}
      >
        <DialogContent style={{ textAlign: "center" }}>
          <form onSubmit={onSubmit} noValidate autoComplete="off">
            <FormControl className="terms-condition-control">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <InputComponent
                    label="Full name"
                    type="text"
                    placeholder="Full name"
                    name="full_name"
                    id="outlined-name"
                    value={state.full_name}
                    autoFocus
                    required={isValid}
                    onChange={handleChange}
                    error={isError}
                    styles={{
                      border: isError && isValid ? "1px solid red" : "initial",
                    }}
                    className="terms-condition-fullName"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <InputComponent
                    label="Create password"
                    type="password"
                    placeholder="Create password"
                    name="password"
                    id="outlined-password"
                    value={state.password}
                    required={isValid}
                    onChange={handleChange}
                    error={isError}
                    styles={{
                      border: isError && isValid ? "1px solid red" : "initial",
                    }}
                    className="password terms-condition-password"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <InputComponent
                    label="Email"
                    type="email"
                    placeholder="Email"
                    name="email"
                    id="outlined-email"
                    value={state.email}
                    required={isValid}
                    onChange={handleChange}
                    error={isError}
                    styles={{
                      border: isError && isValid ? "1px solid red" : "initial",
                    }}
                    className="email terms-condition-email"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <div className="item">
                    <div style={{ display: "flex" }}>
                      <FormControlLabel
                        control={
                          <CustomCheckbox
                            checked={isChecked}
                            name="checked"
                            onChange={() => {
                              setChecked(!isChecked);
                            }}
                            size="medium"
                          />
                        }
                      />
                      <div className="item-1">
                        <TypographyComponent
                          title="With your registration you agree to our"
                          variant="h1"
                          style={{
                            lineHeight: 4,
                          }}
                        />

                        <TypographyComponent
                          title="terms & conditions"
                          variant="h1"
                          style={{
                            lineHeight: 0,
                            textAlign: "left",
                            color: themes.default.colors.green,
                            cursor: "initial"
                          }}
                          className="terms-condition-item"
                        />
                      </div>
                    </div>
                    <div style={{ height: 48 }}>
                      <ButtonComponent
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isDisabled}
                        className="go"
                        endIcon={<ArrowForwardIosIcon />}
                        title="go"
                        style={{
                          backgroundColor: isChecked ? "#2FB41A" : "#949494",
                          height: 48,
                        }}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
              <div className="Container Flipped">
                <div className="Content">
                  GeeksforGeeks is a Computer Science portal for geeks. It
                  contains well written, well thought and well explained
                  computer science and programming articles, quizzes etc.
                  GeeksforGeeks is a Computer Science portal for geeks. It
                  contains well written, well thought and well explained
                  computer science and programming articles, quizzes etc.
                  GeeksforGeeks is a Computer Science portal for geeks. It
                  contains well written, well thought and well explained
                  computer science and programming articles, quizzes etc.
                  GeeksforGeeks is a Computer Science portal for geeks. It
                  contains well written, well thought and well explained
                  computer science and programming articles, quizzes etc.
                  GeeksforGeeks is a Computer Science portal for geeks. It
                  contains well written, well thought and well explained
                  computer science and programming articles, quizzes etc.
                  GeeksforGeeks is a Computer Science portal for geeks. It
                  contains well written, well thought and well explained
                  computer science and programming articles, quizzes etc.
                  GeeksforGeeks is a Computer Science portal for geeks. It
                  contains well written, well thought and well explained
                  computer science and programming articles, quizzes etc.
                  GeeksforGeeks is a Computer Science portal for geeks. It
                  contains well written, well thought and well explained
                  computer science and programming articles, quizzes etc.
                  GeeksforGeeks is a Computer Science portal for geeks. It
                  contains well written, well thought and well explained
                  computer science and programming articles, quizzes etc.
                  GeeksforGeeks is a Computer Science portal for geeks. It
                  contains well written, well thought and well explained
                  computer science and programming articles, quizzes etc.
                </div>
              </div>
            </FormControl>
          </form>
        </DialogContent>
      </DialogComponent>
    </React.Fragment>
  );
};

export default SignUp;
