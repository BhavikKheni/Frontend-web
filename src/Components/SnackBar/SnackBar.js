import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const SnackbarComponent = (props) => {
  const classes = useStyles();
  const { open, onClose, message, type, anchorOrigin } = props;
  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        anchorOrigin={anchorOrigin}
        autoHideDuration={2000}
        onClose={onClose}
      >
        <Alert onClose={onClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default SnackbarComponent;
