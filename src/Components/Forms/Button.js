import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    height: 48,
    fontFamily: "Rubik",
    borderRadius: "10px",
  },
  primary: {
    backgroundColor: "#2fb41a",
    "&:hover": {
      backgroundColor: "#2fb41a",
    },
  },
}));

const ButtonComponent = (props) => {
  const classes = useStyles();
  const {
    endIcon,
    startIcon,
    onClick,
    title,
    type,
    variant,
    color,
    disabled,
    disableFocusRipple,
    disableElevation,
    size,
    style,
    className,
    loader
  } = props;
  return (
    <Button
      variant={variant}
      color={color}
      className={clsx(classes.primary, classes.button, className)}
      endIcon={endIcon}
      startIcon={startIcon}
      onClick={onClick}
      type={type}
      disabled={disabled}
      disableFocusRipple={disableFocusRipple}
      disableElevation={disableElevation}
      size={size}
      style={{ ...style }}
    >
      {!loader && title}
    </Button>
  );
};
export default ButtonComponent;
