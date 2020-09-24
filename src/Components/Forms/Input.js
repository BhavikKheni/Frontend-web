import React from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1, "auto"),
  },
  marginBottom: {
    marginBottom: "20px",
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
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
})(TextField);

const InputTextComponent = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
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
        variant="filled"
        style={{ ...props.styles }}
      />
    </React.Fragment>
  );
};

export default InputTextComponent;
