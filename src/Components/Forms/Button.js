import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    height: 48,
    fontFamily: "Rubik",
    borderRadius: '10px',
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
  } = props;
  return (
    <React.Fragment>
      <Button
        variant={variant}
        color={color}
        className={clsx(classes.primary, classes.button, className)}
        endIcon={endIcon}
        onClick={onClick}
        type={type}
        disabled={disabled}
        disableFocusRipple={disableFocusRipple}
        disableElevation={disableElevation}
        size={size}
        style={{ ...style }}
      >
        {title}
      </Button>
    </React.Fragment>
  );
};
export default ButtonComponent;
