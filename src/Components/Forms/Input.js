import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { themes } from "../../themes";
const theme = createMuiTheme({
  overrides: {
    MuiInputLabel: {
      root: {
        "&$focused": {
          color: themes.default.colors.nero,
        },
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    // margin: theme.spacing(1, "auto"),
  },
  marginBottom: {
    // marginBottom: "20px",
  },
}));

const ValidationTextField = withStyles({
  root: {
    "& input:valid + fieldset": {
      borderColor: "green",
      borderWidth: 2,
    },
    "& input:invalid + fieldset": {
      borderColor: "red",
      borderWidth: 2,
    },
    "& input:valid:focus + fieldset": {
      borderLeftWidth: 6,
      padding: "4px !important", // override inline-style
    },
    "& .MuiFilledInput-input": {
      backgroundColor: "#fff",
      border: "1px solid rgba(25, 25, 25, 0.9)",
      borderRadius: 3,
    },
    "& .MuiFilledInput-underline::after": {
      borderBottom: "none",
    }
  },
})(TextField);

const InputComponent = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <ValidationTextField
          id={props.id}
          error={props.error}
          className={clsx(classes.marginBottom, props.className)}
          name={props.name}
          label={props.label}
          defaultValue={props.defaultValue}
          value={props.value}
          placeholder={props.placeholder}
          type={props.type}
          required={props.required}
          onChange={props.onChange}
          autoFocus={props.autoFocus}
          helperText={props.helperText}
          variant="filled"
          style={{ ...props.styles }}
        />
      </ThemeProvider>
    </React.Fragment>
  );
};
export default InputComponent;
