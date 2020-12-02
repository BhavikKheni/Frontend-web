import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import ButtonComponent from "../../Forms/Button";
import TypographyComponent from "../../Typography/Typography";
import Spinner from "../../Spinner/Spinner";
import PaymentCardComponent from "../../PaymentCard/PaymentCardComponent";
import RightArrow from "../../../images/next_arrow_white.svg";
import { get } from "../../../Services/Auth.service";
import Service from "../../../Services/index";

const newService = new Service();
const useStyles = makeStyles((theme) => ({
  confirm_booking_title: {
    fontFamily: "Rubik",
    fontSize: "24px",
    letterSpacing: "0.02em",
    color: "#FFFFFF",
    textTransform: "lowercase",
    "&:first-letter": {
      textTransform: "uppercase",
    },
  },
  booking_details: {},
  booking_details_columns_wrapper: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    margin: "5px auto",
  },
  booking_details_columns: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    width: "100%",
  },
  booking_detail_item: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    justifyContent: "space-between",
    width: "100%",
    "& p": {
      fontFamily: "Rubik",
    },
  },
  booking_date: {
    width: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  booking_time: {
    maxWidth: "calc(100% - 200px)",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  booking_price: {
    "& p": {
      fontSize: "24px",
    },
  },
  confirm_booking_cta: {
    fontSize: "16px",
    fontWeight: "500",
    width: "100%",
    margin: "20px auto",
    color: "#fff",
    textTransform: "inherit",
    "& .MuiButton-label": {
      width: "auto",
    },
    "&:after": {
      content: "''",
      backgroundImage: `url(${RightArrow})`,
      height: "20px",
      width: "12px",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      marginLeft: "10px",
    },
  },
  select_card: {
    cursor: "pointer",
    fontSize: "24px",
  },
  cardListItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#000",
    width: "100%",
  },
  root: {
    flexDirection: "column",
  },
  listNav: {
    backgroundColor: "#fff",
  },
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
}));

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

const ConfirmBookingDialog = (props) => {
  const classes = useStyles();
  const [selectCardVisible, setSelectCardVisible] = useState(false);
  const [cardList, setCardList] = useState([]);
  const [cardTokenId, setCardTokenId] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const {
    selectedService,
    getFromTime,
    getToTime,
    selectedDate,
    getTotalCost,
    onSetBooking,
    isLoading,
    disabled,
    loginUser
  } = props;

  useEffect(() => {
    const onListCard = () => {
      get("/usercards/list")
        .then((response) => {
          setCardList(response);
        })
        .catch((error) => {});
    };
    onListCard();
  }, []);

  const onAddCard = (cardDetails) => {
    if (!stripe || !elements) {
      return;
    }

    const formData = new FormData();  
    formData.append("user_id", loginUser.id_user);
    formData.append("card_token_id", cardDetails.card.id);
    formData.append("token_id", cardDetails.id);
  
    if (cardDetails.card.id) {
      newService
        .upload("/usercards/add", formData)
        .then((res) => res.json())
        .then((res) => {
          if (res.type === "SUCCESS") {
            onSetBooking(cardDetails.id);
          }
        })
        .catch((err) => {});
    }
  };

  const getCardInfo = async () => {
    try {
      const res = await stripe.createToken(elements.getElement(CardElement));
      if (res) {
        return res.token ? res.token : null;
      } else {
        return null;
      }
    } catch(e) {
      console.log("Eroro: ", e);
    }
  };

  const onConfirmBooking = () => {

    getCardInfo().then((cardDetails) => {
      if (cardTokenId && cardDetails && cardDetails.id) {
        setCardTokenId(null)
        alert(
          "You have selected a card from existing and also entered a new card details. action not performed"
        );
        return;
      } else if (cardTokenId) {
        onSetBooking(cardTokenId);
      } else if (cardDetails && cardDetails.id) {
        onAddCard(cardDetails);
      } else {
        alert("Please enter card details or choose a card from list");
      }
    });
  };

  const handleListItemClick = (tokenId, index) => {
    setCardTokenId(tokenId);
    setSelectedIndex(index);
  };

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
                  <TypographyComponent
                    title={moment(selectedDate).format("DD-MM-YYYY")}
                  />
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
​
          <div
            className={classes.booking_detail_item}
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <div className={classes.booking_price}>
              <TypographyComponent title="Total:" />
              <TypographyComponent title={getTotalCost} />
            </div>
            {selectCardVisible ? (
              <span
                className={classes.select_card}
                onClick={() => {
                  setSelectCardVisible(false);
                }}
              >
                go back
              </span>
            ) : (
              <span
                className={classes.select_card}
                onClick={() => {
                  setSelectCardVisible(true);
                }}
              >
                Select Card
              </span>
            )}
          </div>
          {selectCardVisible ? (
            <List component="nav" className={classes.listNav}>
              {cardList &&
                cardList.map((l, index) => {
                  return (
                    <ListItem
                      key={index}
                      button
                      selected={selectedIndex === index}
                      onClick={(event) =>{
                        handleListItemClick(l.card_token_id, index)
                      }
                      }
                      className={classes.root}
                    >
                      <div className={classes.cardListItem}>
                        <span>Name</span>
                        <span>expired on</span>
                      </div>
                      <div className={classes.cardListItem}>
                        <span>XXXX XXXX XXXX XXXX {l.last4}</span>
                        <span>
                          {l.exp_month}/{l.exp_year}
                        </span>
                      </div>
                    </ListItem>
                  );
                })}
            </List>
          ) : (
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
          
            // <PaymentCardComponent user={props.user} CardElement={CardElement} />
          )}
          <ButtonComponent
            title="Buy to set booking"
            style={{ color: classes.textColor }}
            type="button"
            onClick={() => {
              onConfirmBooking();
            }}
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