import React from "react";
import DialogComponent from "../Dialog/Dialog";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import TypographyComponent from "../Typography/Typography";
import ButtonComponent from "../Forms/Button";
import Spinner from "../Spinner/Spinner";
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const ConfirmDialog = (props) => {
  return (
    <React.Fragment>
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          props.onClose();
        }}
        open={props.open}
        title={props.title || "Alert"}
      >
        <DialogContent>
          <TypographyComponent
            title={
              props.header
                ? props.header
                : "Are you sure you want to continue with this?"
            }
          />
          <ButtonComponent
            onClick={() => props.onConfirm()}
            title="Ok"
            startIcon={props.loader && <Spinner />}
            loader={props.loader && props.loader}
          />
          <ButtonComponent onClick={() => props.onCancel()} title="Cancel" />
        </DialogContent>
      </DialogComponent>
    </React.Fragment>
  );
};

export default ConfirmDialog;
