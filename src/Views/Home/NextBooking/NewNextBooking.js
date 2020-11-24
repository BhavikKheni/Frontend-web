import React, { useState, useEffect } from 'react'
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import moment from "moment";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Spinner from "../../../Components/Spinner/Spinner";
import ButtonComponent from "../../../Components/Forms/Button";
import TypographyComponent from "../../../Components/Typography/Typography";
import TooltipComponent from "../../../Components/Tooltip/Tooltip";
import { search } from "../../../Services/Auth.service";

let limit = 10;
const path = "/service/bookings/list";
const PROVIDER = "PROVIDER";
const CONSUMER = "CLIENT";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },

  next_booking_wrapper: {
    maxHeight: "230px",
    overflow: "auto",
    marginTop: "24px",
    marginBottom: "24px",
    direction: "rtl",
  },

  next_booking_item: {
    display: "flex",
    alignItems: "center",
    direction: "ltr",

    "& + $next_booking_item": {
      marginTop: "25px",
    },

    "& button": {
      fontSize: "12px",
      lineHeight: "18px",
      letterSpacing: "0.02em",
      fontWeight: "normal",
      color: "#FFFFFF",
      textTransform: "inherit",
      height: "25px",
      maxWidth: "112px",
      width: "100%",
      borderRadius: "5px",
      margin: "0 13px 0 0",
    },

    "& p": {
      fontFamily: "Rubik",
      lineHeight: "30px",
      letterSpacing: "0.02em",
      color: "#303030",
      minWidth: "100px",
      textAlign: "center",
      margin: "0 3px",

      "&:last-of-type": {
        textAlign: "left",
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        paddingLeft: '25px',
        paddingRight: '15px',
      },
    },

    '& span': {
      whiteSpace: 'nowrap',
    },

    "& svg": {
      marginLeft: "auto",
    },
  },
}));

const NewNextBooking = (props) => {

  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = props;
  const [records, setNextBookingData] = useState([]);
  const [upcomingOffset, setUpcomingOffset] = useState(0);
  const [loadMoreOption, showLoadeMoreOption] = useState({
    consumer: true,
    provider: true
  });
  const [paginationLoader, setPaginationLoader] = useState(false);
  const [showSectionLoader, setSectionLoader] = useState(false);

  let nextBookingsArr = [];

  const getParams = (bookingsFor) => {
    return {
      limit: limit,
      offset: upcomingOffset,
      role: bookingsFor,
      id_user: user.id_user,
      status: "NEXT"
    }
  }

  const getAPIArray = () => {
    const arr = [];
    if (loadMoreOption.consumer && loadMoreOption.provider) {
      arr.push(search(path, getParams(CONSUMER)));
      arr.push(search(path, getParams(PROVIDER)));
    } else if (loadMoreOption.consumer) {
      arr.push(search(path, getParams(CONSUMER)));
    } else if (loadMoreOption.provider) {
      arr.push(search(path, getParams(PROVIDER)));
    };
    return arr;
  }

  const getBookings = async () => {
    try {
      debugger;
      const apisArr = getAPIArray();
      if (apisArr && apisArr.length) {
        const allResponses = await Promise.all(apisArr);

        if (allResponses) {
          setSectionLoader(false);
          setPaginationLoader(false);
          if (loadMoreOption.consumer && loadMoreOption.provider) {
            const nextBookingAsConsumer = allResponses[0];
            const nextBookingAsProvider = allResponses[1];
            manipulateBookingResponse(nextBookingAsConsumer, "consumer");
            manipulateBookingResponse(nextBookingAsProvider, "provider");
          } else if (loadMoreOption.consumer) {
            const nextBookingAsConsumer = allResponses[0];
            manipulateBookingResponse(nextBookingAsConsumer, "consumer");
          } else if (loadMoreOption.provider) {
            const nextBookingAsProvider = allResponses[1];
            manipulateBookingResponse(nextBookingAsProvider, "provider");
          }
        }
      }
    } catch(err) {
      console.log(err);
    };
  }

  const manipulateBookingResponse = (res, bookingsFor) => {
    res["bookingsFor"] = bookingsFor;
    if (!res) return;
    const data = res.data;
    nextBookingsArr = [];
    let loadMore = loadMoreOption;
    if (data && data.length) {
      loadMore[bookingsFor] = true;
      setUpcomingOffset(res.stopped_at);
      data.forEach((val, index) => {
        val["bookingsFor"] = bookingsFor;
        val["duration"] = calculateDuration(val);
        res["textToShow"] = bookingsFor === "provider" ? "My Booking" : "Job";
        nextBookingsArr.push(val);
      });
      setNextBookingData(nextBookingsArr);
    } else {
      loadMore[bookingsFor] = false;
    }
    showLoadeMoreOption(loadMore);
    console.log("Records", bookingsFor, loadMoreOption, data);
  }

  const calculateDuration = (val) => {
    if (val.from_datetime && val.to_datetime) {
      const fromDateTime = new Date(val.from_datetime).getTime();
      const toDateTime = new Date(val.to_datetime).getTime();

      const timeDiff = toDateTime / 1000 - fromDateTime / 1000;
      return timeDiff / 60;
    }
  }

  useEffect(() => {
    setSectionLoader(true);
    getBookings();
  }, []);

  const loadMore = () => {
    setPaginationLoader(true);
    getBookings();
  }

  const goToMeeting = (element) => {
    const { history } = props;
    history.push("/call-page",{ 
      record:element
    });
  };

  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    const a = s.split(" ")
    return a[0].charAt(0).toUpperCase() + a[0].slice(1) + " " + a[1].charAt(0).toUpperCase() + a[1].slice(1)
  }

  return (
    <React.Fragment>
      <TypographyComponent title={t("home.nextBooking.title")} variant="h2" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Divider
            style={{
              border: "0.5px solid #9E9E9E",
            }}
          />
        </Grid>
      </Grid>
      <div className={classes.next_booking_wrapper}>
        {showSectionLoader ? (
          <Spinner />
        ) : (!showSectionLoader && records && !records.length) ? (
          <span className="no_records_found">
            {t("home.nextBooking.notFoundRecord")}
          </span>
        ) : (
          records.map((r, index) => (
            <div className={classes.next_booking_item} key={index}>
              <ButtonComponent
                title="Go to meeting"
                onClick={() => goToMeeting(r)}
              />
              <TypographyComponent title={moment(r.from_datetime).format("MM-DD-YYYY")} />
              <TypographyComponent
                title={moment(r.from_datetime).format("HH:mm")}
              />
              <TypographyComponent title={`${r.duration} Minutes`} />
              <TypographyComponent title={capitalize(r.provider_name)} />
              <TypographyComponent title={`${r.textToShow}`} />
              <TooltipComponent title={r.title} placement="bottom">
                <span>{r.title}</span>
              </TooltipComponent>
              <MoreVertIcon
                variant="contained"
                color="primary"
                style={{ cursor: "pointer" }}
              />
            </div>
          ))
        )}
        {records && records.length>0 && loadMoreOption.provider && loadMoreOption.consumer && (
          <div style={{marginBottom: '20px'}}>
            {paginationLoader ? (
              <Spinner />
            ) : (
              <div
                className="load-more"
                onClick={() => loadMore()}
              ></div>
            )}
          </div>
        )}
      </div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Divider
            style={{
              border: "0.5px solid #9E9E9E",
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default withRouter(NewNextBooking);
