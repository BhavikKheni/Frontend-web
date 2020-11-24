import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TypographyComponent from "../Typography/Typography";
const useStyles = makeStyles((theme) => ({
  card_wrapper: {
    width: "100%",
    maxWidth: "456px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    display: "flex",
    alignItems: "flex-end",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: "27px 23px 15px",
  },

  card_form: {
    width: "100%",
    maxWidth: "273px",
    height: "100%",
    minHeight: "145px",
    backgroundColor: "#303030",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
    borderRadius: "8px",
    padding: "0",
    paddingTop: "10px",
  },

  card_provider_name: {
    fontFamily: "Rubik",
    fontSize: "24px",
    lineHeight: "36px",
    color: "#FFFFFF",
    padding: "0 15px 5px",
    display: "block",
  },

  card_items: {
    background: "#434343",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
    padding: "15px",
  },
  payment_add_new_card: {
    display: "flex",
    justifyContent: "center",
    padding: "0",
    transition: "all 0.3s ease-in-out 0s",
  },

  card_user_details: {
    display: "flex",
    justifyContent: "space-between",

    "& .StripeElement": {
      width: "100% !important",
    },

    "& p": {
      fontFamily: "Rubik",
      fontWeight: "400",
      fontSize: "12px",
      letterSpacing: "0.02em",
      color: "#FFFFFF",
      "&:last-child": {
        paddingRight: "45px",
      },
    },
  },
  card_cvv: {
    border: "1px solid rgba(25, 25, 25, 0.9)",
    borderRadius: "10px",
    width: "97px",
    height: "55px",

    "& iframe": {
      height: "55px !important",
    },
  },
}));

const CARD_OPTIONS = {
  style: {
    hidePostalCode: true,
    base: {
      fontSize: "12px",
      color: "#fff",
      letterSpacing: "0.05em",
      textAlign: "left",
      "::placeholder": {
        color: "#fff",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const PaymentCardComponent = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.card_wrapper}>
        <div className={classes.card_form}>
          <span className={classes.card_provider_name}>VISA</span>
          <div className={classes.card_items}>
            <div className={classes.card_user_details}>
              <TypographyComponent
                title="Number on card"
                style={{ fontWeight: "500" }}
              />
              <TypographyComponent title="expired on" />
            </div>
            <div className={classes.card_user_details}>
              <props.CardElement options={CARD_OPTIONS} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default PaymentCardComponent;
