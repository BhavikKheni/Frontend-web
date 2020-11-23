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
  const [loadMoreOption, showLoadeMoreOption] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const offset = 0;

  const getParams = (role) => {
    return {
      limit: limit,
      offset: offset,
      role: role,
      id_user: user.id_user,
      status: "NEXT"
    };
  }

  let nextBookingsArr = [];
  const getBookings = async () => {
    try {
      const allResponses = await Promise.all([
        search(path, getParams(CONSUMER)),
        search(path, getParams(PROVIDER))
      ]);

      if (allResponses) {
        const nextBookingAsConsumer = allResponses[0];
        const nextBookingAsProvider = allResponses[1];
        manipulateBookingResponse(nextBookingAsConsumer.data, "Consumer");
        manipulateBookingResponse(nextBookingAsProvider.data, "Provider");
      }
    } catch(err) {
      console.log(err);
    };
  }

  const manipulateBookingResponse = (data, role) => {
    nextBookingsArr = [];
    if (data && data.length) {
      data.forEach((val, index) => {
        val["role"] = role;
        val["duration"] = calculateDuration(val);
        nextBookingsArr.push(val);
      });
      setNextBookingData(nextBookingsArr);
      console.log("Records", nextBookingsArr)
    }
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
    getBookings();
  }, []);

  const goToMeeting = (element) => {
    const { history } = props;
    history.push("/call-page", {
      record:element
    });
  };

  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    const a = s.split(" ")
    return a[0].charAt(0).toUpperCase() + a[0].slice(1) + " " + a[1].charAt(0).toUpperCase() + a[1].slice(1)
  }

  const onLoadMore = async () => {
    setIsLoading(true);
    // let res = await search(path, {
    //   limit: limit,
    //   offset: offset,
    //   ...criteria,
    // });
    // if (res) {
    //   const { data, stopped_at, type } = res || {};
    //   if (type === "ERROR" || data.length === 0) {
    //     setIsLoading(false);
    //     return;
    //   }
    //   setUpcomingOffset(stopped_at);
    //   setNextBookingData((services) => [...(services || []), ...(data || [])]);
    //   setIsLoading(false);
    // }
  };

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
        {isLoading ? (
          <Spinner />
        ) : records && !records.length ? (
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
              {/* <TypographyComponent title={`Booking As ${r.role}`} /> */}
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

        {loadMoreOption && records && records.length > 0 && (
          <div style={{marginBottom: '20px'}}>
            {isLoading ? (
              <Spinner />
            ) : (
              <div
                className="load-more"
                onClick={() => onLoadMore()}
              ></div>
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default withRouter(NewNextBooking);
