import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  primary: {
    backgroundColor: "#2fb41a",
    "&:hover": {
      backgroundColor: "#2fb41a",
    },
  },
  secondary: {
    backgroundColor: "#333333",
    "&:hover": {
      backgroundColor: "#333333",
    },
  },
}));

const ButtonComponent = (props) => {
  const classes = useStyles();
  const {
    endIcon,
    onClick,
    title,
    type,
    variant,
    color,
    disabled,
    disableFocusRipple,
    disableElevation,
    size,
    style
  } = props;
  return (
    <React.Fragment>
      <Button
        variant={variant}
        color={color}
        className={clsx(classes.primary, classes.button)}
        endIcon={endIcon}
        onClick={onClick}
        type={type}
        disabled={disabled}
        disableFocusRipple={disableFocusRipple}
        disableElevation={disableElevation}
        size={size}
        style={{...style}}
      >
        {title}
      </Button>
    </React.Fragment>
  );
};

export default ButtonComponent;
