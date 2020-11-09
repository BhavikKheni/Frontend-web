import React from "react";
import DialogComponent from "../Dialog/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";
import TypographyComponent from "../Typography/Typography";
import ButtonComponent from "../Forms/Button";
import Spinner from "../Spinner/Spinner";

const useStyles = makeStyles((theme) => ({

  alert_modal : {
    color: '#fff',

    '& p': {
      marginBottom: '25px',
    },

    '& .MuiDialogContent-root': {
      '& button': {
        fontSize: '16px',
        fontWeight: 'normal',
        letterSpacing: '0.02em',
        color: '#fff',
        textTransform: 'inherit',
        minWidth: '122px',
        height: '48px',
        margin: '0',
  
        '& + button': {
          marginLeft: '20px'
        }
      }
    }
  }

}));


const ConfirmDialog = (props) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          props.onClose();
        }}
        open={props.open}
        title={props.title || "Alert"}
        className={classes.alert_modal}
      >
        <div className="dialog_container">
          <DialogContent>
            <TypographyComponent
              title={
                props.header
                  ? props.header
                  : "Are you sure you want to continue with this?"
              }
            />
            <ButtonComponent
              className={classes.confirm_cta}
              onClick={() => props.onConfirm()}
              title="Ok"
              startIcon={props.loader && <Spinner />}
              loader={props.loader && props.loader}
            />
            <ButtonComponent onClick={() => props.onCancel()} title="Cancel" className={classes.cancel_cta} />
          </DialogContent>
        </div>
      </DialogComponent>
    </React.Fragment>
  );
};

export default ConfirmDialog;
