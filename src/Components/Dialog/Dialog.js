import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import TypographyComponent from "../../Components/Typography/Typography";
import "./Dialog.css";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    display: "flex",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#FF7A00",
  },
  header: {
    width: "100%",
    maxWidth: 458,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexFlow: "row wrap",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const {
    children,
    classes,
    title,
    subTitle1,
    subTitle2,
    onSubTitle2,
    onClose,
    ...other
  } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <div
        style={{ maxWidth: 140, width: "100%", display: "flex", flex: 1 }}
      ></div>
      <div className={classes.header}>
        <div>
          <TypographyComponent title={title} variant="h3" />
        </div>
        <div style={{ display: "flex" }}>
          <TypographyComponent title={subTitle1} variant="h2" />
          <TypographyComponent
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={(e) => {
              onSubTitle2(e);
            }}
            title={subTitle2}
            variant="h2"
          ></TypographyComponent>
        </div>
      </div>
      <div style={{ maxWidth: 140, width: "100%", display: "flex", flex: 1 }}>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </MuiDialogTitle>
  );
});

const DialogStyle = makeStyles((theme) => ({
  paperWidthSm: {
    width: "100%",
    height: "100%",
    maxWidth: (props) => props.maxWidth || 766,
    background: "rgba(48, 48, 48, 0.9)",
    border: "1px solid #ffffff",
    borderRadius: 40,
    maxHeight: (props) => props.maxHeight,
  },
}));

const DialogComponent = (props) => {
  const {
    open,
    onClose,
    children,
    title,
    subTitle1,
    subTitle2,
    onSubTitle2,
    maxHeight,
    maxWidth,
  } = props;
  const classes1 = DialogStyle({ maxHeight: maxHeight, maxWidth: maxWidth });
  return (
    <div>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog"
        open={open}
        disableBackdropClick
        classes={{
          paperWidthSm: classes1.paperWidthSm,
        }}
      >
        <DialogTitle
          title={title}
          subTitle1={subTitle1}
          subTitle2={subTitle2}
          onSubTitle2={onSubTitle2}
          onClose={onClose}
        ></DialogTitle>
        {children}
      </Dialog>
    </div>
  );
};

export default DialogComponent;
