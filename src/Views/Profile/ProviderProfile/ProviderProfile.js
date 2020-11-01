import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CheckIcon from "@material-ui/icons/Check";
import { get } from "../../../Services/Auth.service";
import TypographyComponent from "../../../Components/Typography/Typography";
import { themes } from "../../../themes";
import { useSidebar } from "../../../Provider/SidebarProvider";
import StarRateRounded from "@material-ui/icons/StarRateRounded";
import CalendarComponent from "../../../Components/Calendar/Calendar";
import ProfileProviderSidebar from "./ProviderProfileSidebar";
import OfferedServices from "./OfferedServices/OfferedServices";
import ServiceDetails from "./ServiceDetails/ServiceDetails";
import LatestReviews from "./LatestReviews/LatestReviews";
import ImageComponent from "../../../Components/Forms/Image";


import AddIcon from "@material-ui/icons/Add";
import { add } from "../../../Services/Auth.service";
import DateFnsUtils from "@date-io/date-fns";
import InputComponent from "../../../Components/Forms/Input";
import ButtonComponent from "../../../Components/Forms/Button";
import Sppiner from "../../../Components/Spinner/Spinner";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";


import moment from "moment";

import { LOCALSTORAGE_DATA, languages_level } from "../../../utils";
import "./ProviderProfile.css";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}));
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today
function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}


const booked_slots = [
  {
    id: 1,
    startDate: "2020-11-01T01:10:00",
    endDate: "2020-11-02T11:00:00",
    title: "Test event",
    booked_by: 1,
    color: "red",
    resize: false,
  },
];
const available_slots = [
  {
    startDate: "2020-11-01T12:10:00",
    endDate: "2020-11-02T11:00:00",
    color: "green",
    editable: true,
    title: "Available slot",
  },
  {
    id: 2,
    startDate: "2020-11-01T07:00:00",
    endDate: "2020-11-01T11:00:00",
    title: "Test event",
    booked_by: 159,
    color: "blue",
    editable: false,
  },
];
var tempArray = [];

available_slots.forEach((val) => {
  tempArray.push({
    start: val.startDate,
    color: val.color,
    editable: val.editable,
    id: val.id,
    title: val.title,
  });
});
booked_slots.forEach((val) => {
  tempArray.push({
    start: val.startDate,
    color: val.color,
    editable: val.editable,
    id: val.id,
    title: val.title,
  });
});


const INITIAL_EVENTS = [];
const ProfileProvider = (props) => {
  const { setSidebarContent, setSidebar } = useSidebar();
  const { t } = useTranslation();
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [loading, setLoading2] = useState(false);
  const { state } = props && props.location;
  let { pathname } = props.location;
  const { service = {}, type } = state;
  const { history } = props;
  const [selectedService, setSelectedService] = useState({});
  const [selectedReviews, setSelectedReview] = useState([]);
  const [allLanguages, setAllLanguges] = useState([]);
  const [averages, setAverages] = useState({});

  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();

  
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [response, setResponse] = useState({});
  
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const onAddBooking = () => {
    const { user, selectedService } = props;
    const data = {
      from_time: fromTime,
      to_time: toTime,
      id_service: selectedService.id_service,
      booking_date: moment(selectedDate).format("YYYY-MM-DD"),
      id_user: user.id_user,
    };
    setLoading(true);
    add("/service/book", data)
      .then((result) => {
        setLoading(false);
        setResponse(result);
        setOpenSnackBar(true);
      })
      .catch((error) => {
        setLoading(false);
        setResponse(error);
        console.log("Error", error);
      });
  };



  let [userData, setUserData] = useState({
    full_name: "",
    country: "",
    timezone: "",
    languages: [],
    level: [],
    services_created: [],
    reviews: [],
  });

  React.useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <ProfileProviderSidebar
        user={userData}
        selectedService={selectedService}
      />
    );
  }, [
    setSidebarContent,
    setSidebar,
    history,
    pathname,
    userData,
    selectedService,
  ]);

  useEffect(() => {
    async function fetchLanguages() {
      const storage_laguages = LOCALSTORAGE_DATA.get("languages");
      if (!storage_laguages.data) {
        const res = await get("/languages/list");
        if (res) {
          LOCALSTORAGE_DATA.set("languages", res);
          setAllLanguges(res);
        }
      } else {
        setAllLanguges(storage_laguages.data);
      }
    }
    fetchLanguages();
  }, []);

  useEffect(() => {
    async function getService() {
      const res = await get(`/service/${service.id_service}`);
      if (res) {
        setSelectedService({ ...res });
        const { reviews_list } = res.reviews || [];
        setSelectedReview(reviews_list);
        if (type === "job-details") {
          var elmnt = document.getElementsByClassName("service-details");
          if (elmnt[0]) {
            elmnt[0].scrollIntoView();
          }
        }
        if (type === "calendar-view") {
          var elementCalendar = document.getElementsByClassName("calendar");
          if (elementCalendar[0]) {
            elementCalendar[0].scrollIntoView();
          }
        }
      } else {
      }
    }
    if (service.id_service) {
      getService();
    }
  }, [service.id_service, type]);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await get(`/profile/${state && state.userId}`).catch(
        (error) => {
          console.log(error);
          setLoading(false);
        }
      );
      if (res) {
        setUserData({
          ...res.data,
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    getData();
  }, [state]);

  return (
    <div className="profile_page_wrapper provider_profile_wrapper">
      
      <TypographyComponent title="Provider profile" variant="h4" />
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <React.Fragment>
          <div className="user_profile_updated_value">
            <div className="user_profile_img">
              <div className="user_profile_img_block">
                {userData.image && userData.image ? (
                  <img alt="profile" src={userData.image} />
                ) : (
                  <ImageComponent />
                )}
              </div>
            </div>
            <div className="user_language_timezone">
              <TypographyComponent
                variant="h3"
                title={`${userData.first_name} ${userData.last_name}`}
                style={{
                  color: themes.default.colors.darkGray,
                }}
              />
              <div className="user_country_timezone_title">
                <TypographyComponent
                  variant="h6"
                  title={userData.country_name || ""}
                />
                <TypographyComponent
                  variant="h6"
                  title={userData.timezone_name || ""}
                />
              </div>
              <div className="user_country_timezone_data">
                {userData.languages &&
                  userData.languages.map((language, i) => {
                    let language_name =
                      allLanguages &&
                      allLanguages.find(
                        (x) =>
                          Number(x.id_language) === Number(language.language_id)
                      );
                    const label =
                      languages_level &&
                      languages_level.find(
                        (x) =>
                          Number(x.language_level_id) ===
                          Number(language.language_level_id)
                      );
                    return (
                      <div className="user_language_item" key={i}>
                        <span className="user_language">
                          {language_name ? language_name.language_name : ""}
                        </span>
                        <span>{label ? label.label : ""}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="user_verification">
              <TypographyComponent variant="h4" title="Employer Verfication" />
              <div className="user_verification_item">
                <CheckIcon />
                <TypographyComponent
                  variant="h5"
                  title={userData.member_since}
                />
              </div>
              <div className="user_verification_item">
                <CheckIcon />
                <TypographyComponent variant="h5" title="E-Mail verified" />
              </div>
            </div>
          </div>

          <section className="offered-services">
            <OfferedServices
              userData={userData}
              setSelectedService={setSelectedService}
              setSelectedReview={setSelectedReview}
              setAverages={setAverages}
            />
          </section>
          <section className="service-details">
            <ServiceDetails
              averages={averages}
              selectedService={selectedService}
            />
          </section>
          <section className="latest-reviews">
            <LatestReviews selectedReviews={selectedReviews} />
          </section>

          <section className="book-service">
            <TypographyComponent
              variant="h4"
              title={t("providerProfile.bookService")}
            />
            <div className="book_service_inner">
                <div className="book_service_title">
                  <div className="book_service_quality_review">
                    <TypographyComponent
                      title="Service quality"
                      variant="h5"
                    />
                    <div className="book_service_quality_review_count">
                      <TypographyComponent
                        title={averages && averages.average_service_quality_rating}
                        variant="h5"
                      />
                      <StarRateRounded />
                    </div>
                    <TypographyComponent
                      variant="h3"
                      title={selectedService.title}
                    />
                  </div>
                  <div className="book_service_quality_review">
                    <TypographyComponent
                      title="Simpathy"
                      variant="h5"
                    />
                    <div className="book_service_quality_review_count">
                      <TypographyComponent
                        title={averages && averages.average_sympathy_rating}
                        variant="h5"
                      />
                      <StarRateRounded />
                    </div>
                    <TypographyComponent
                      variant="h6"
                      title={
                        selectedService.price && `${selectedService.price}$/h`
                      }
                    />
                  </div>
                </div>
            </div>
            <div className="service_calendar">
              <CalendarComponent
                INITIAL_EVENTS={tempArray}
                renderEventContent={renderEventContent}
              />

              <div className="booking_time">
                <div className="booking_title">
                  <h4>Add Booking</h4>
                  <AddIcon />
                </div>
                <div className="booking_row booking_time_interval">
                  <span className="booking_time_label">From:</span>
                  <InputComponent
                    placeholder="00:00"
                    value={fromTime}
                    onChange={(e) => {
                      setFromTime(e.target.value);
                    }}
                    className="booking_time_interval_input"
                  />
                  <span>To</span>
                  <InputComponent
                    placeholder="00:00"
                    value={toTime}
                    onChange={(e) => {
                      setToTime(e.target.value);
                    }}
                    className="booking_time_interval_input"
                  />
                </div>
                <div className="booking_row booking_date">
                  <span className="booking_time_label">Date:</span>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      className="date-picker"
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div className="booking_row booking_cost">
                  <span className="booking_time_label">Total Cost:</span>
                  <p className="booking_cost_price">20$</p>
                </div>
                <div className="confirm_booking_row">
                  <ButtonComponent
                    title="Confirm"
                    type="button"
                    startIcon={loading && <Sppiner />}
                    onClick={() => {
                      onAddBooking();
                    }}
                    className={'confirm_cta'}
                  />
                </div>
              </div>
            </div>
          </section>
        </React.Fragment>
      )}
    </div>
  );
};
export default withRouter(ProfileProvider);
