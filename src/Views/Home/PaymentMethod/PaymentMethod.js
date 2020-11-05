import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import AddIcon from "@material-ui/icons/Add";
import TypographyComponent from "../../../Components/Typography/Typography";
import DialogComponent from "../../../Components/Dialog/Dialog";
import ButtonComponent from "../../../Components/Forms/Button";
import Styles from "./Payment.module.css";

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: "18px",
      color: "#fff",
      letterSpacing: "0.025em",
      "::placeholder": {
        color: "#fff",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};
const PaymentMethod = (props) => {
  const { t } = useTranslation();
  const [addNewCardOpen, setAddNewCardOpen] = useState(false);
  const elements = useElements();
  const stripe = useStripe();

  const onAdd = () => {
    setAddNewCardOpen(true);
  };

  const handleClose = () => {
    setAddNewCardOpen(false);
  };

  const onAddCard = async () => {
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardNumberElement);

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (payload.error) {
      console.log("[error]", payload.error);
    } else {
      console.log("payload", payload);
    }
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TypographyComponent
            title={t("home.paymentMethod.title")}
            variant="h3"
          />
        </Grid>
      </Grid>
      <div className={clsx(Styles.payment_add_wrapper)}>
        <Card className={clsx(Styles.payment_card)}>
          <CardHeader title="Visa" variant="h6" />
          <CardContent>
            <div className={clsx(Styles.payment_item_card)}>
              <TypographyComponent title="Name of card" />
              <TypographyComponent title="Expired on" />
            </div>
            <div className={clsx(Styles.payment_item_card)}>
              <TypographyComponent title="xxxx xxxx xxxx 9843" />
              <TypographyComponent title="00/00" />
            </div>
          </CardContent>
        </Card>
        <Card className={clsx(Styles.payment_card, Styles.payment_add_card)}>
          <CardContent
            className={clsx(Styles.payment_card_content)}
            onClick={() => onAdd()}
          >
            <div>
              <AddIcon />
            </div>
            <div>
              <TypographyComponent title="Add payment method" />
            </div>
          </CardContent>
        </Card>
      </div>
      <DialogComponent
        onClose={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        open={addNewCardOpen}
        title={t("payment.addCard")}
      >
        <DialogContent>
          <div className={clsx(Styles.card_wrapper)}>
            <div className={clsx(Styles.card_form)}>
              <div className={clsx(Styles.card_items)}>
                <div className={clsx(Styles.cardElement)}>
                  <TypographyComponent title="Number on card" />
                  <TypographyComponent title="expired on" />
                </div>
                <div className={clsx(Styles.cardElement)}>
                  <CardNumberElement options={CARD_OPTIONS} />
                  <CardExpiryElement options={CARD_OPTIONS} />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <ButtonComponent title="Add new card" onClick={() => onAddCard()} />
      </DialogComponent>
    </React.Fragment>
  );
};

export default PaymentMethod;
