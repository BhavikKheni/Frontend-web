import React, { useState } from "react";
import clsx from "clsx";
import {
  CardNumberElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import AddIcon from "@material-ui/icons/Add";
import TypographyComponent from "../../../Components/Typography/Typography";
import DialogComponent from "../../../Components/Dialog/Dialog";
import ButtonComponent from "../../../Components/Forms/Button";
import ConfirmDialog from "../../../Components/ConfirmDialog/ConfirmDialog";
import DeleteIcon from "@material-ui/icons/Delete";
import Styles from "./Payment.module.css";
import Spinner from "../../../Components/Spinner/Spinner";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },

  payment_card_wrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: "50px",

    "& p": {
      fontFamily: "Rubik",
      fontSize: "12px",
      letterSpacing: "0.05em",
      color: "#303030",
    },

    "& .user_card_name": {
      fontSize: "14px",
      fontWeight: "500",
    },

    "& .user_card_expired_date": {
      fontSize: "14px",
    },
  },

  payment_card_delete: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#ff0000",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    height: "100%",
    width: "100%",
    cursor: "pointer",
    display: "flex",
    flexWrap: "wrap",
    flexFlow: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "10px 25px",
    opacity: "0",
    pointerEvents: "none",

    "& label": {
      pointerEvents: "none",
    },
  },

  payment_card: {
    background: "#ffffff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
    borderRadius: "8px",
    maxWidth: "293px",
    width: "100%",
    height: "150px",
    padding: "7px 16px",
    position: "relative",
    transition: "all 0.3s ease-in-out 0s",
    marginRight: "30px",
    "&:hover": {
      transform: "scale(1.04)",
      transition: "all 0.3s ease-in-out 0s",

      "& $payment_card_delete": {
        opacity: 1,
        pointerEvents: "inherit",
      },
    },
  },

  card_title: {
    padding: 0,
    marginBottom: "14px",

    "& span": {
      fontFamily: "Rubik",
      fontWeight: "500",
      lineHeight: "36px",
      letterSpacing: "0.02em",
      color: "#303030",
    },
  },

  payment_item_card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  payment_card_content: {
    padding: "0 !important",
  },

  add_payment_card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexFlow: "column",
    padding: "0 !important",
    width: "100%",
    cursor: "pointer",

    "& p": {
      fontSize: "14px",
      fontWeight: "500",
    },
  },

  card_wrapper: {
    width: "100%",
    maxWidth: "456px",
    height: "100%",
    minHeight: "209px",
    backgroundColor: "#ffffff",
    padding: "27px 76px 15px 68px",
  },

  card_form: {
    width: "100%",
    maxWidth: "312px",
    height: "100%",
    minHeight: "167px",
    backgroundColor: "#000",
    padding: "10px",
  },

  card_items: {
    background: "#434343",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
  },

  payment_add_new_card: {
    display: "flex",
    justifyContent: "center",
    padding: "0",
    transition: "all 0.3s ease-in-out 0s",
  },
}));

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
  const classes = useStyles();
  const { t } = useTranslation();
  const [addNewCardOpen, setAddNewCardOpen] = useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const [conformDeleteDialogOpen, setConformDeleteDialogOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setDisabled(true);
    setLoading(true);
    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (payload.error) {
      setLoading(false);
      setDisabled(false);
      console.log("[error]", payload.error);
      setError(payload.error);
    } else {
      setLoading(false);
      setDisabled(false);
      console.log("payload", payload);
    }
  };

  const onDeleteCard = () => {};

  return (
    <React.Fragment>
      <TypographyComponent title={t("home.paymentMethod.title")} variant="h2" />
      <div className={classes.payment_card_wrapper}>
        <Card className={classes.payment_card}>
          <CardHeader
            title="Visa"
            variant="h6"
            className={classes.card_title}
          />
          <CardContent className={classes.payment_card_content}>
            <div className={classes.payment_item_card}>
              <TypographyComponent
                title="Name of card"
                className={classes.user_card_name}
              />
              <TypographyComponent title="expired on" />
            </div>
            <div className={classes.payment_item_card}>
              <TypographyComponent title="xxxx xxxx xxxx 9843" />
              <TypographyComponent
                title="00/00"
                className={classes.user_card_expired_date}
              />
            </div>
          </CardContent>
          <div
            className={classes.payment_card_delete}
            onClick={() => {
              setConformDeleteDialogOpen(true);
            }}
          >
            <DeleteIcon />
            <label>Remove Card</label>
          </div>
        </Card>
        <Card
          className={clsx(classes.payment_card, classes.payment_add_new_card)}
        >
          <CardContent
            className={classes.add_payment_card}
            onClick={() => onAdd()}
          >
            <AddIcon />
            <TypographyComponent title="Add payment method" />
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
          <div className={classes.card_wrapper}>
            <div className={classes.card_form}>
              <div className={classes.card_items}>
                <div className={classes.cardElement}>
                  <TypographyComponent title="Number on card" />
                  <TypographyComponent title="expired on" />
                </div>
                <div className={classes.cardElement}>
                  <CardNumberElement options={CARD_OPTIONS} />
                  <CardExpiryElement options={CARD_OPTIONS} />
                </div>
              </div>
            </div>
            {error && <span>{error.message}</span>}
          </div>
        </DialogContent>
        <ButtonComponent
          title="Add new card"
          onClick={() => onAddCard()}
          startIcon={loading && <Spinner size="small" />}
          disabled={disabled}
        />
      </DialogComponent>
      <ConfirmDialog
        open={conformDeleteDialogOpen}
        onClose={() => setConformDeleteDialogOpen(false)}
        onConfirm={() => onDeleteCard()}
        onCancel={() => setConformDeleteDialogOpen(false)}
        loader={deleteLoader}
      />
    </React.Fragment>
  );
};

export default PaymentMethod;
