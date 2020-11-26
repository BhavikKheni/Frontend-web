
import { makeStyles } from "@material-ui/core/styles";
import RightArrow from "../../../images/next_arrow_white.svg";
export const useStyles = makeStyles((theme) => ({
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
      borderRadius: "10px",
      padding: "20px 76px 20px 68px",
    },
  
    card_provider_name: {
      fontFamily: "Rubik",
      fontSize: "24px",
      lineHeight: "36px",
      color: "#FFFFFF",
      padding: "0 15px 15px",
      display: "block",
    },
  
    card_form: {
      width: "100%",
      maxWidth: "312px",
      height: "100%",
      minHeight: "167px",
      backgroundColor: "#303030",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
      borderRadius: "8px",
      padding: "0",
      paddingTop: "20px",
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
  
    add_card_cta: {
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