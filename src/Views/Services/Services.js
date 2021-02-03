import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import MuiFormControl from "@material-ui/core/FormControl";
import Rating from "@material-ui/lab/Rating";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ServiceCardComponent from "../../Components/ServiceCard/ServiceCard";
import Spinner from "../../Components/Spinner/Spinner";
import { search, add, get } from "../../Services/Auth.service";
import SnackBarComponent from "../../Components/SnackBar/SnackBar";
import { SessionContext } from "../../Provider/Provider";
import { AuthenticationContext } from "../../Provider/AuthProvider";
import { useSidebar } from "../../Provider/SidebarProvider";
import SelectComponent from "../../Components/Forms/Select";
import TypographyComponent from "../../Components/Typography/Typography";
import ChangePassword from "../../Components/ChangePassword/ChangePassword";
// import { onLogout } from "../../Services/Auth.service";
import { LOCALSTORAGE_DATA } from "../../utils";
import Verification from "../../Components/Verification/VerificationDialog";
import "./service.css";
import SignIn from "../Auth/SignIn/SignIn";
import { useDebouncedCallback } from "use-debounce";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DialogComponent from "../../Components/Dialog/Dialog"
import DialogContent from "@material-ui/core/DialogContent";
import ButtonComponent from "../../Components/Forms/Button";
import RightArrow from "../../images/next_arrow_white.svg";
import Service from "../../Services/index";
import moment from "moment";
const newService = new Service();
const useSession = () => React.useContext(SessionContext);
const useSession1 = () => React.useContext(AuthenticationContext);

const limit = 10;

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    width: "100%",
  },
  margin: {
    margin: theme.spacing(1),
  },
  call_time_wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  call_page_timer: {
    fontFamily: "Rubik",
    fontSize: "16px",
    lineHeight: "33px",
    letterSpacing: "0.02em",
    color: "#191919",
    border: "1px solid #191919",
    padding: "10px",
    backgroundColor: "#CFE9CB",
    borderRadius: "10px",
    // width: '86px',
    width: "85px",
    height: "55px",
    display: "block",
    textAlign: "center",
    cursor: "pointer"
  },
  total_card_title:{
    display:'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: "#fff",
    marginTop:10
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
    marginTop:10
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
  listNav: {
    backgroundColor: "#fff",
  },
  select_card:{
    cursor: "pointer",
  },
  confirm_booking_cta: {
    fontSize: "16px",
    fontWeight: "500",
    width: "100%",
    maxWidth: "456px",
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
}));

const FormControl = withStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-root": {},
  },
}))(MuiFormControl);
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
const Services = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  let { logout, user, isLoggedIn } = useSession();
  const {
    openSignIn,
    handleCloseSignIn,
    openSignUpDialog,
    openForgotPasswordDialog,
    openSignInDialog,
    LoggedIn,
  } = useSession1();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarLoader, setSidebarLoader] = useState(false);
  const [services, setServices] = useState([]);
  const [isUpcomingMoreData, setUpcomingMoreData] = useState(true);
  const [upcomingoffset, setUpcomingOffset] = useState(0);
  const [isUpcomingLoading, setUpcomingLoading] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [country, setCountry] = useState(214);
  const { setSidebarContent, setSidebar } = useSidebar();
  const [languages, setLanguages] = useState([]);
  const [provider_language, setProviderLanguage] = useState(3);
  const [per_hour_rate_min, setperHourRateMin] = useState(10);
  const [per_hour_rate_max, setperHourRateMax] = useState(99);
  const { history } = props;
  const [value, setValue] = useState("LIVE");
  const [simpathy, setSimpathy] = useState();
  const [service_quality, setServiceQuality] = useState();
  const [countries, setCountries] = useState([]);
  const [setRes, setTypeRes] = useState("");
  const [open, setOpen] = React.useState(false);
  const [verify, setVerify] = useState(false);
  const [verifyLoader, setVerifyLoader] = useState(false);
  const [disabledPromotionLink, setDisabledPromotionLink] = useState(false);
  const [promotion_text_hide, setPromotion_text_hide] = useState(false);
  const [timerDialog,setTimerDialog]=useState(false);
  const [selectCardVisible, setSelectCardVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [time,setTime]=useState(0);
  const [totalCost,setTotalCost]=useState(0);
  const [cardTokenId, setCardTokenId] = useState("");
  const [cardList, setCardList] = useState([]);
  const [selectService,setSelectService]=useState({})
  const stripe = useStripe();
  const elements = useElements();

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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChangeRadio = (event) => {
    setValue(event.target.value);
    debounced.callback();
  };

  const onOpenChangePassword = () => {
    setOpenResetPassword(false);
  };

  const getParams = useCallback(() => {
    return {
      limit: limit,
      offset: 0,
      per_hour_rate_min: Number(per_hour_rate_min),
      per_hour_rate_max: Number(per_hour_rate_max),
      simpathy,
      service_quality,
      live_now: value,
      country: country,
      provider_language,
    };
  }, [
    per_hour_rate_min,
    per_hour_rate_max,
    simpathy,
    service_quality,
    provider_language,
    country,
    value,
  ]);
  const debounced = useDebouncedCallback(
    () => {
      asyncFetchData();
    },
    1500,
    { maxWait: 2000 }
  );

  useEffect(
    () => () => {
      debounced.flush();
    },
    [debounced]
  );
  
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  async function asyncFetchData() {
    setIsLoading(true);
    const res = await search("/service/list/filter", getParams()).catch(
      (error) => {
        setIsLoading(false);
        console.log(error);
      }
    );
    if (res) {
      const { data, stopped_at, type } = res || {};
      if (type === "ERROR" || (data && data.length === 0)) {
        setUpcomingMoreData(false);
        setIsLoading(false);
        setServices([]);
        return;
      }
      setUpcomingOffset(stopped_at);
      setServices(data || []);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const res = await search("/service/list/filter", getParams()).catch(
        (error) => {
          setIsLoading(false);
          console.log(error);
        }
      );
      if (res) {
        const { data, stopped_at, type } = res || {};
        if (type === "ERROR" || (data && data.length === 0)) {
          setUpcomingMoreData(false);
          setIsLoading(false);
          setServices([]);
          return;
        }
        setUpcomingOffset(stopped_at);
        setServices(data || []);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div className="sidebar_inner">
        {sidebarLoader ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <div className="sidebar_row">
              <FormControl variant="outlined" disabled>
                <SelectComponent
                  name="country"
                  label="Select a country"
                  value={(country && country) || ""}
                  onChange={(e) => {
                    setCountry(e.target.value);
                  }}
                  native
                >
                  {countries &&
                    countries.map((m, i) => (
                      <option key={i} value={m.country_id}>
                        {m.country_name}
                      </option>
                    ))}
                </SelectComponent>
              </FormControl>
            </div>
            <div className="sidebar_row">
              <FormControl variant="outlined" disabled>
                <SelectComponent
                  name="provider_language"
                  label="Provider language"
                  value={provider_language}
                  onChange={(e) => {
                    setProviderLanguage(e.target.value);
                  }}
                  native
                >
                  {languages &&
                    languages.map((l) => {
                      return (
                        <option key={l.id_language} value={l.id_language}>
                          {l.language_name}
                        </option>
                      );
                    })}
                </SelectComponent>
              </FormControl>
            </div>
            <div className="sidebar_row select_price_range">
              <TypographyComponent title="Price per hour (CHF)"></TypographyComponent>
              <div className="select_price_range_inner">
                <TextField
                  type="number"
                  value={per_hour_rate_min}
                  placeholder="CHF"
                  name="per_hour_rate_min"
                  id="per_hour_rate_min"
                  InputProps={{ inputProps: { min: 0, max: 200 } }}
                  onChange={(e) => {
                    setperHourRateMin(e.target.value);
                    debounced.callback();
                  }}
                  variant="outlined"
                />

                <span>To</span>

                <TextField
                  type="number"
                  value={per_hour_rate_max}
                  placeholder="CHF"
                  name="per_hour_rate_max"
                  id="per_hour_rate_max"
                  InputProps={{ inputProps: { min: 0, max: 200 } }}
                  onChange={(e) => {
                    setperHourRateMax(e.target.value);
                    debounced.callback();
                  }}
                  variant="outlined"
                />
              </div>
            </div>
            <div className="sidebar_row">
              <div className="sidebar_review">
                <TypographyComponent title="Service quality"></TypographyComponent>
                <Rating
                  name="quality"
                  value={service_quality}
                  onChange={(event, newValue) => {
                    setServiceQuality(newValue);
                    debounced.callback();
                  }}
                  size="small"
                />
              </div>
              <div className="sidebar_review">
                <TypographyComponent title="Simpathy"></TypographyComponent>
                <Rating
                  name="simpathy"
                  value={simpathy}
                  onChange={(event, newValue) => {
                    setSimpathy(newValue);
                    debounced.callback();
                  }}
                  size="small"
                />
              </div>
            </div>
            <div className="sidebar_row sidebar_input_radio">
              <RadioGroup
                aria-label="service"
                name="live_now"
                value={value}
                onChange={handleChangeRadio}
              >
                <FormControlLabel
                  value="LIVE"
                  control={<Radio />}
                  label="Live service"
                />
                <FormControlLabel
                  value="BOOK"
                  control={<Radio />}
                  label="Book service"
                />
              </RadioGroup>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }, [
    per_hour_rate_min,
    per_hour_rate_max,
    provider_language,
    classes.formControl,
    countries,
    country,
    service_quality,
    simpathy,
    languages,
    setSidebarContent,
    setSidebar,
    value,
    sidebarLoader,
    debounced,
  ]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const forgotPassword = urlParams.get("forgotPassword");

    if (Boolean(forgotPassword) === true) {
      setOpenResetPassword(true);
      // onLogout(props).then((result) => {
      //   logout();
      // });
    }

    const fetchLanguage = new Promise((resolve, reject) => {
      const cnt = LOCALSTORAGE_DATA.get("languages") || [];
      if (!cnt.data || typeof cnt.data === "undefined") {
        const res = get("/languages/list").catch((error) => {
          reject(error);
        });
        if (res) {
          resolve(res);
        }
      } else {
        resolve(cnt.data);
      }
    });

    const fetchCountry = new Promise((resolve, reject) => {
      const cnt = LOCALSTORAGE_DATA.get("countries") || [];
      if (!cnt.data || typeof cnt.data === "undefined") {
        const res = get("/countries/list").catch((error) => {
          reject(error);
        });
        if (res) {
          resolve(res);
        }
      } else {
        resolve(cnt.data);
      }
    });
    setSidebarLoader(true);
    Promise.all([fetchLanguage, fetchCountry])
      .then(([languages, countries]) => {
        setSidebarLoader(false);
        LOCALSTORAGE_DATA.set("languages", languages);
        LOCALSTORAGE_DATA.set("countries", countries);
        setCountries(countries);
        setLanguages(languages);
      })
      .catch((error) => {
        LOCALSTORAGE_DATA.remove("countries");
        LOCALSTORAGE_DATA.remove("languages");
        console.log("Error", error);
      });
  }, [logout]);

  const onMore = async (path, offset, criteria = {}) => {
    setUpcomingLoading(true);
    let res = await search(path, {
      limit: limit,
      offset: offset,
      ...criteria,
    });
    if (res) {
      const { data, stopped_at, type } = res || {};
      if (type === "ERROR" || (data && data.length === 0)) {
        setUpcomingMoreData(false);
        return;
      }
      setUpcomingOffset(stopped_at);
      setServices((services) => [...(services || []), ...(data || [])]);
      setUpcomingLoading(false);
    }
  };
  const onResetPassword = () => {
    //update auth api call karva ni
  };

  const goToPhone = (element) => {
    if (user && user.id_user === element.provider_id_user) {
      setOpen(true);
      setTypeRes({
        message: "You can't this service because it is belongs to you",
        type: "error",
      });
    } else {
      if (isLoggedIn) {
        setTimerDialog(true)
        setSelectService(element)
      } else {
        openSignInDialog();
      }
    }
  };

  const goToCalendar = (element) => {
    if (user && user.id_user === element.provider_id_user) {
      setOpen(true);
      setTypeRes({
        message: "You can't this service because it is belongs to you",
        type: "error",
      });
    } else {
      history.push("/profile-provider", {
        type: "calendar-view",
        service: element,
        userId: element.provider_id_user,
      });
    }
  };

  const goToServiceTitle = (element) => {
    history.push("/profile-provider", {
      service: element,
      type: "job-details",
      userId: element.provider_id_user,
    });
  };

  const goToProviderName = (element) => {
    history.push("/profile-provider", {
      userId: element.provider_id_user,
      service: element,
      loginUser: user,
    });
  };

  const onSetVerify = () => {
    setVerify(true);
  };

  const onVerifyEmail = async () => {
    const data = {
      email: user.email,
      id_user: user.id_user,
    };
    setVerifyLoader(true);
    setDisabledPromotionLink(true);
    const res = await add("/profile/verifyemail", data).catch((err) => {
      setTypeRes(err);
      setVerifyLoader(false);
      setDisabledPromotionLink(false);
    });
    if (res && res.type === "SUCCESS") {
      setVerifyLoader(false);
      onSetVerify();
      setTypeRes(res);
      setDisabledPromotionLink(false);
      setOpen(true);
    } else if (res && res.type === "ERROR") {
      setVerify(false);
      setVerifyLoader(false);
      setOpen(true);
      setDisabledPromotionLink(false);
    }
  };

  const onCloseVerifyDialog = () => {
    setVerify(false);
  };

  const onPromotionLinkHide = () => {
    setPromotion_text_hide(true);
  };

  const onPromotionClick = () => {
    setPromotion_text_hide(true);
  };
  const handleListItemClick = (tokenId, index) => {
    setCardTokenId(tokenId);
    setSelectedIndex(index);
  };

  const onAddCard = (cardDetails) => {
    if (!stripe || !elements) {
      return;
    }

    const formData = new FormData();  
    formData.append("user_id", user.id_user);
    formData.append("card_token_id", cardDetails.card.id);
    formData.append("token_id", cardDetails.id);
  
    if (cardDetails.card.id) {
      newService
        .upload("/usercards/add", formData)
        .then((res) => res.json())
        .then((res) => {
          if (res.type === "SUCCESS") {
            instantBookingCall(cardDetails.id);
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
  
  const instantBookingCall =(tokenID)=>{
 let from_datetime = '2020-12-07T12:30:03+0530';//moment().subtract(1, 'day').toISOString()
    const toData={
       id_user:user.id_user,
       id_service:selectService.id_service,
       from_datetime : from_datetime,
       to_datetime:'2020-12-07T12:45:03+0530',//moment(from_datetime).add(15,"minute").toISOString(),
       payment_token:tokenID,
    }
    
    add("/service/instant/book", toData)
    .then((res) => {
      if (res.type === "SUCCESS") {
        history.push("/call-page", {
          service: selectService,
          userId: selectService.provider_id_user,
        });
      }
    })
    .catch((err) => {});
  }

  const onConfirmBooking = () => {
  if(time){
    getCardInfo().then((cardDetails) => {
        if (cardTokenId && cardDetails && cardDetails.id) {
          setCardTokenId(null)
          alert(
            "You have selected a card from existing and also entered a new card details. action not performed"
          );
          return;
        } else if (cardTokenId) {
          instantBookingCall(cardTokenId)
        } else if (cardDetails && cardDetails.id) {
          onAddCard(cardDetails);
        } else {
          alert("Please enter card details or choose a card from list");
        }
      });
    }else{
      setOpen(true)
      setTypeRes({
        message: "Please select time",
        type:"error"
      })
    }
  };
  
  const getTotalCost=useCallback((value)=>{
    const pricePerHour = value;
    const pricePerMinute = pricePerHour / 60;
    const cost = value * pricePerMinute;
    setTotalCost(cost)
    setTime(value)
  },[])

  const onSetTime=useCallback((value)=>{
    getTotalCost(value)
  },[getTotalCost])


  return (
    <div className="service_card_content">
      {user && !user.email_verified && isLoggedIn && !promotion_text_hide && (
        <div className="promotion_text">
          <p>
            Hi, Your email isn’t verified yet. Please verify to use all the
            services.
          </p>
          <div className="promotion_links">
            {verifyLoader && <Spinner size={20} />}
            <span
              disabled={disabledPromotionLink}
              onClick={() => {
                onVerifyEmail();
              }}
            >
              Resend email confirmation link
            </span>
            <p className="close_icon" onClick={() => onPromotionClick()}>
              <span className="material-icons">close</span>
            </p>
          </div>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="service_card_wrapper">
          {services && !services.length ? (
            <span className="no_records_found">
              {t("service.notFoundService")}
            </span>
          ) : (
            services.map((element, index) => (
              <ServiceCardComponent
                key={index}
                images={element.images}
                title={element.title}
                providerName={element.provider_name}
                price={element.price}
                service_quality_rating={element.service_quality_rating}
                sympathy_rating={element.sympathy_rating}
                service_provider_live_now={element.service_provider_live_now}
                onPhone={() => goToPhone(element)}
                onCalendar={() => goToCalendar(element)}
                onServiceTitle={() => goToServiceTitle(element)}
                onProviderName={() => goToProviderName(element)}
              />
            ))
          )}
        </div>
      )}
      {isUpcomingMoreData && services && services.length > 0 && !isLoading && (
        <div>
          {isUpcomingLoading ? (
            <Spinner />
          ) : (
            <div
              className="load-more"
              onClick={() =>
                onMore("/service/list/filter", upcomingoffset, {
                  per_hour_rate_min: Number(per_hour_rate_min),
                  per_hour_rate_max: Number(per_hour_rate_max),
                  simpathy,
                  service_quality,
                  live_now: value,
                  country: country,
                  provider_language,
                })
              }
            ></div>
          )}
        </div>
      )}
      <ChangePassword
        openResetPassword={openResetPassword}
        onOpenChangePassword={() => onOpenChangePassword()}
        type="forgot-password"
      />

      {/* email verification dialog */}
      <Verification
        user={user}
        verify={verify}
        closeVerifyDialog={onCloseVerifyDialog}
        onPromotionLinkHide={onPromotionLinkHide}
        title="E-mail verification"
        subTitle1="We’ve send a 4 digit code to your email. Please enter the code to verify your email-id."
        type="email"
      />
      <SignIn
        onClose={handleCloseSignIn}
        openSignIn={openSignIn}
        openSignUpDialog={openSignUpDialog}
        openForgotPasswordDialog={openForgotPasswordDialog}
        handleCloseSignIn={handleCloseSignIn}
        setLogin={LoggedIn}
      />
       <DialogComponent
        onClose={() => {
          setTimerDialog(false);
        }}
        open={timerDialog}
        title="Set time and start"
      >
        <DialogContent>
        <div className={classes.call_time_wrapper}>
        <span
          className={classes.call_page_timer}
          onClick={()=>onSetTime(15)}
        >
          15 min
        </span>
        <span
          className={classes.call_page_timer}
          onClick={()=>onSetTime(30)}
        >
          30 min
        </span>
        <span
          className={classes.call_page_timer}
          onClick={()=>onSetTime(60)}
        >
          60 min
        </span>
        <span
          className={classes.call_page_timer}
          onClick={()=>onSetTime(120)}
        >
          120 min
        </span>
        <TextField
          type="number"
          placeholder="00:00"
          name="time"
          vaule={time}
          InputProps={{ inputProps: { min: 0} }}
          onChange={(e) => {
            onSetTime(e.target.value)
          }}
          variant="outlined"
        />
      </div>
      <div className={classes.total_card_title}>
        <div><span>Total:</span><span>{totalCost}CHF</span></div>
        <div>   
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
            )}</div>
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
          )}
         <ButtonComponent title="Buy and start" className={classes.confirm_booking_cta}   onClick={() => {
              onConfirmBooking();
              
            }}/>
        </DialogContent>
        </DialogComponent>
      <SnackBarComponent
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={setRes.message}
        type={setRes.type && setRes.type.toLowerCase()}
      />
    </div>
  );
};

export default Services;
