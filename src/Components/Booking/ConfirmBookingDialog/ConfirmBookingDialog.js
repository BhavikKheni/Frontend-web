import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ButtonComponent from "../../Forms/Button";
import TypographyComponent from "../../Typography/Typography";
import Spinner from '../../Spinner/Spinner';
import Card from '../../Card/Card';

const useStyles = makeStyles((theme) => ({
  timeFields: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textColor: {
    color: "#fff",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const ConfirmBookingDialog = (props) => {
  const classes = useStyles();
  const {
    selectedService,
    getFromTime,
    getToTime,
    selectedDate,
    getTotalCost,
    onSetBooking,
    isLoading,
    disabled
  } = props;

  return (
    <React.Fragment>
      <TypographyComponent
        title={selectedService && selectedService.title}
        className={classes.textColor}
      />
      <TypographyComponent
        className={classes.textColor}
        title={
          selectedService &&
          selectedService.provider_details &&
          `${selectedService.provider_details.first_name} ${selectedService.provider_details.last_name}`
        }
      />
      <div className={classes.timeFields}>
        <div className={classes.textColor}>
          <div className={classes.item}>
            <TypographyComponent title="Start time:" />
            <TypographyComponent title={getFromTime} />
          </div>
          <div className={classes.item}>
            <TypographyComponent title="End time:" />
            <TypographyComponent title={getToTime} />
          </div>
        </div>
        <div className={classes.textColor}>
          <div className={classes.item}>
            <TypographyComponent title="Start date:" />
            <TypographyComponent
              title={moment(selectedDate).format("DD-MM-YYYY")}
            />
          </div>
          <div className={classes.item}>
            <TypographyComponent title="total:" />
            <TypographyComponent title={getTotalCost} />
          </div>
        </div>
        <Card />
        <ButtonComponent
          title="Buy to set booking"
          endIcon={<ChevronRightIcon />}
          style={{ color: classes.textColor }}
          onClick={() =>onSetBooking()}
          startIcon={isLoading && <Spinner />}
          disabled={disabled}
        />
      </div>
    </React.Fragment>
  );
};
export default ConfirmBookingDialog;
