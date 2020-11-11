import React, { useState } from "react";
import clsx from "clsx";
import { CardCvcElement } from "@stripe/react-stripe-js";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TypographyComponent from "../Typography/Typography";

const useStyles = makeStyles((theme) => ({
  textColor: {
    color: "#fff",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  card_wrapper: {
    backgroundColor: "#fff",
  },
  card_list_item: {
    backgroundColor: "#000",
    width: "100%",
    maxWidth: "273px",
    padding: 10,
  },
}));

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: "18px",
      color: "#000",
      letterSpacing: "0.025em",
      "::placeholder": {
        color: "#000",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};
const Card = () => {
  const classes = useStyles();
  const [visibleCvc, setVisibleCvc] = useState(true);
  return (
    <React.Fragment>
      <div className={classes.card_wrapper}>
        <div className={classes.item}>
          <TypographyComponent title="Select card" />
          <ExpandMoreIcon />
        </div>
        <div className={clsx(classes.textColor, classes.card_list_item)}>
          <span>VISA</span>
          <div className={classes.item}>
            <span>Name on card</span>
            <span>expired on</span>
          </div>
          <div className={classes.item}>
            <span>xxxx xxxx xxxx xxx36</span>
            <span>00/00</span>
          </div>
        </div>
        {visibleCvc && (
          <div>
            <CardCvcElement options={CARD_OPTIONS} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
export default Card;
