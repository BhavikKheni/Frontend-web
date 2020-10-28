import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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
        autoHideDuration={1000}
        onClose={onClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert onClose={onClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default SnackbarComponent;
