import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";

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
import Spinner from "../../../Components/Spinner/Spinner";
import { add, get } from "../../../Services/Auth.service";
import { SessionContext } from "../../../Provider/Provider";
import SnackBarComponent from "../../../Components/SnackBar/SnackBar";
import Service from "../../../Services/index";
import {useStyles} from './PaymentMethod.style'
const useSession = () => React.useContext(SessionContext);
const newService = new Service();

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const CARD_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: "12px",
      color: "#fff",
      letterSpacing: "0.05em",
      "::placeholder": {
        color: "#fff",
      },
      textAlign: "right",
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
  const stripe = useStripe();
  const [conformDeleteDialogOpen, setConformDeleteDialogOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectCard, setSelectCard] = useState({});
  const [listCards, setListCards] = useState([]);
  const [open, setOpen] = React.useState(false);
  const elements = useElements();
  const { user } = useSession();
  const onAdd = () => {
    setAddNewCardOpen(true);
  };

  const handleClose = () => {
    setAddNewCardOpen(false);
  };

  useEffect(() => {
    const onListCard = () => {
      get("/usercards/list")
        .then((response) => {
          setListCards(response);
        })
        .catch((error) => {});
    };
    onListCard();
  }, []);
  const onAddCard = async () => {
    if (!stripe || !elements) {
      return;
    }
    const res = await stripe.createToken(elements.getElement(CardElement));
    setDisabled(true);
    setLoading(true);

    const formData = new FormData();
    formData.append("user_id", user.id_user);
    formData.append("card_token_id", res.token.card.id);
    formData.append("token_id", res.token.id);
    formData.append("is_default", "0");

    if (res.token.card.id) {
      newService
        .upload("/usercards/add", formData)
        .then((res) => res.json())
        .then((res) => {})
        .catch((err) => {
          setOpen(true);
          setAddNewCardOpen(false);
          setError({
            message: error,
            type: "error",
          });
        });
    }
  };

  const onDeleteCard = () => {
    setDeleteLoader(true);
    add("/usercards/delete", {
      id_user_cards: selectCard.id_user_cards,
    })
      .then((response) => {
        setDeleteLoader(false);
        setConformDeleteDialogOpen(false);
        const targetIndex = listCards.findIndex(
          (l) => l.id_user_cards === selectCard.id_user_cards
        );

        listCards.splice(targetIndex, 1);
        setListCards((d) => [...d]);
      })
      .catch((error) => {
        setOpen(true);
        setDeleteLoader(false);
        setConformDeleteDialogOpen(false);
        setError({
          message: error,
          type: "error",
        });
      });
  };
  return (
    <React.Fragment>
      <TypographyComponent title={t("home.paymentMethod.title")} variant="h2" />
      <div className={classes.payment_card_wrapper}>
        {listCards &&
          listCards.length > 0 &&
          listCards.map((c, index) => (
            <Card className={classes.payment_card} key={index}>
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
                  <TypographyComponent title={`xxxx xxxx xxxx ${c.last4}`} />
                  <TypographyComponent
                    title={`${c.exp_month}/${c.exp_year}`}
                    className={classes.user_card_expired_date}
                  />
                </div>
              </CardContent>
              <div
                className={classes.payment_card_delete}
                onClick={() => {
                  setConformDeleteDialogOpen(true);
                  setSelectCard(c);
                }}
              >
                <DeleteIcon />
                <label>Remove Card</label>
              </div>
            </Card>
          ))}
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
        <div className="dialog_container">
          <DialogContent>
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
                    <CardElement options={CARD_OPTIONS} />
                  </div>
                </div>
              </div>
            </div>
            {error && <span>{error.message}</span>}
          </DialogContent>
          <ButtonComponent
            title="Add new card"
            onClick={() => onAddCard()}
            startIcon={loading && <Spinner size="small" />}
            disabled={disabled}
            className={classes.add_card_cta}
            loader={loading}
          />
        </div>
      </DialogComponent>
      <ConfirmDialog
        open={conformDeleteDialogOpen}
        onClose={() => setConformDeleteDialogOpen(false)}
        onConfirm={() => onDeleteCard()}
        onCancel={() => setConformDeleteDialogOpen(false)}
        loader={deleteLoader}
      />
      <SnackBarComponent
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={error.message}
        type={error.type}
      />
    </React.Fragment>
  );
};

export default PaymentMethod;
