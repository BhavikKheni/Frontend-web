import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ButtonComponent from "../../Forms/Button";
import TypographyComponent from "../../Typography/Typography";
import Spinner from '../../Spinner/Spinner';
import Card from '../../Card/Card';
import RightArrow from  "../../../images/next_arrow_white.svg";

const useStyles = makeStyles((theme) => ({
  confirm_booking_title: {
    fontFamily: 'Rubik',
    fontSize: '24px',
    letterSpacing: '0.02em',
    color: '#FFFFFF',
    textTransform: 'lowercase',

    '&:first-letter' : {
      textTransform: 'uppercase',
    }
  },
  booking_details: {
    
  },
  booking_details_columns_wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    margin: '5px auto'
  },
  booking_details_columns: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    width: '100%',
  },
  booking_detail_item: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    justifyContent: 'space-between',
    width: '100%',

    '& p': {
      fontFamily: 'Rubik',
    }
  },
  booking_date: {
    width: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  booking_time: {
    maxWidth: 'calc(100% - 200px)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  booking_price: {
    '& p' : {
      fontSize: '24px',
    }
  },
  confirm_booking_cta: {
    fontSize: '16px',
    fontWeight: '500',
    width: '100%',
    margin: '20px auto',
    color: '#fff',
    textTransform: 'inherit',

    '& .MuiButton-label': {
      width: 'auto',
    },

    '&:after' : {
      content: "''",
      backgroundImage: `url(${RightArrow})`,
      height: '20px',
      width: '12px',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      marginLeft: '10px',
    },
  },
  select_card: {
    cursor: 'pointer',
    fontSize: '24px',
  }
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
      <div className="dialog_container">
        <TypographyComponent
          title={selectedService && selectedService.title}
          className={classes.confirm_booking_title}
        />
        <TypographyComponent
          className={classes.confirm_booking_title}
          title={
            selectedService &&
            selectedService.provider_details &&
            `${selectedService.provider_details.first_name} ${selectedService.provider_details.last_name}`
          }
        />
        <div className={classes.booking_details}>
          <div className={classes.booking_details_columns_wrapper}>
            <div className={classes.booking_details_columns}>
              <div className={classes.booking_detail_item}>
                <div className={classes.booking_date}>
                  <TypographyComponent title="Date:" />
                  <TypographyComponent title={moment(selectedDate).format("DD-MM-YYYY")} />
                </div>
                <div className={classes.booking_time}>
                  <TypographyComponent title="From Time:" />
                  <TypographyComponent title={getFromTime} />
                  <TypographyComponent title="To" />
                  <TypographyComponent title={getToTime} />
                </div>
              </div>
            </div>
          </div>
          
          <div className={classes.booking_detail_item} style={{marginTop:'10px', marginBottom:'10px'}}>
            <div className={classes.booking_price}>
              <TypographyComponent title="Total:" />
              <TypographyComponent title={getTotalCost} />
            </div>
            <span className={classes.select_card}>Select Card</span>
          </div>

          <Card />

          <ButtonComponent
            title="Buy to set booking"
            style={{ color: classes.textColor }}
            onClick={() =>onSetBooking()}
            startIcon={isLoading && <Spinner />}
            disabled={disabled}
            className={classes.confirm_booking_cta}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
export default ConfirmBookingDialog;
