import React from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import TypographyComponent from "../../Components/Typography/Typography";
import TooltipComponent from "../../Components/Tooltip/Tooltip";
import "./Dialog.css";

const styles = makeStyles((theme) => ({
  root: {},
  closeButton: {},
  header: {},
}));
const DialogTitle = (props) => {
  const {
    children,
    title,
    subTitle1,
    subTitle2,
    onSubTitle2,
    onClose,
    justifyContent,
    alignItems,
    flexDirection,
    titleColor,
    iconColor,
    ...other
  } = props;
  const { t } = useTranslation();
  const classes1 = styles({
    header: {
      justifyContent: justifyContent,
      alignItems: alignItems,
      flexDirection: flexDirection,
    },
  });
  return (
    <div className="dialog_header">
      <MuiDialogTitle disableTypography>
        <div className="dialog_container">
          <div>
            <TypographyComponent
              title={title}
              variant="h3"
              style={{ color: titleColor }}
            />
          </div>
          <div className="dialog_subtitle">
            <TypographyComponent title={subTitle1} variant="h2" />

            <TypographyComponent
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                onSubTitle2(e);
              }}
              title={subTitle2}
              variant="h2"
            ></TypographyComponent>
          </div>
        </div>
      </MuiDialogTitle>
      <TooltipComponent title={t("close")}>
        <IconButton
          aria-label="close"
          className={classes1.closeButton}
          onClick={onClose}
          style={{ color: iconColor }}
        >
          <CloseIcon />
        </IconButton>
      </TooltipComponent>
    </div>
  );
};

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
    justifyContent,
    alignItems,
    flexDirection,
    titleColor,
    iconColor,
    className
  } = props;
  return (
    <div>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog"
        open={open}
        disableBackdropClick
        className="dialog_wrapper"
      >
        <div className={clsx("dialog_content", className)}>
          <DialogTitle
            title={title}
            subTitle1={subTitle1}
            subTitle2={subTitle2}
            onSubTitle2={onSubTitle2}
            onClose={onClose}
            justifyContent={justifyContent}
            alignItems={alignItems}
            flexDirection={flexDirection}
            titleColor={titleColor}
            iconColor={iconColor}
          ></DialogTitle>
          {children}
        </div>
      </Dialog>
    </div>
  );
};

export default DialogComponent;
