import React from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    borderRadius: "10px",
  },
  margin: {},
  marginBottom: {},
  borderRadius: "10px",
}));

const ValidationTextField = withStyles({
  root: {
    "& .MuiFilledInput-input": {
      backgroundColor: "#fff",
      border: "1px solid rgba(25, 25, 25, 0.9)",
      borderRadius: "10px",
    },
    "& .MuiFilledInput-underline::after": {
      borderBottom: "none",
    },
    "& .MuiFilledInput-multiline": {
      padding: 0,
    },
    "& .MuiFilledInput-root": {
      backgroundColor: "transparent",
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    "& .MuiFilledInput-underline:before": {
      borderBottom: "none",
    },
    "& .MuiFilledInput-inputMultiline": {
      padding: 12,
    },
  },
})(TextField);

const InputComponent = (props) => {
  const classes = useStyles();

  return (
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
      InputLabelProps={props.InputLabelProps}
      variant="outlined"
      multiline={props.multiline}
      rows={props.rows}
      style={{ ...props.styles }}
      inputProps={props.inputProps}
      fullWidth={props.fullWidth}
    />
  );
};
export default InputComponent;
