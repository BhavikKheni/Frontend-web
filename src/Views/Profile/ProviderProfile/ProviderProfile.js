import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import { get, search } from "../../../Services/Auth.service";
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
import AddBookingSidebar from "../../../Components/Booking/AddBookingSidebar/AddBookingSidebar";
import { LOCALSTORAGE_DATA, languages_level } from "../../../utils";
import moment from "moment";
import "./ProviderProfile.css";

function renderEventContent(eventInfo) {
  return (
    <>
      <div>
        <i
          style={{
            color: "#4AC836",
            fontWeight: "normal",
            fontStyle: "normal",
            fontSize: "10px",
          }}
        >
          {eventInfo.event.extendedProps.description}
        </i>
        <br />
        <b>{eventInfo.timeText}</b>
        <br />
        <i>{eventInfo.event.title}</i>
      </div>
    </>
  );
}


const ProfileProvider = (props) => {
  const { setSidebarContent, setSidebar } = useSidebar();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const { state = {} } = props.location && props.location;
  let { pathname } = props.location;
  const { service = {}, type } = state;
  const { history } = props;
  const [selectedService, setSelectedService] = useState({});
  const [selectedReviews, setSelectedReview] = useState([]);
  const [allLanguages, setAllLanguges] = useState([]);
  const [averages, setAverages] = useState({});
  const [slots, setAllSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
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
    async function fetchSlots() {
      const params = {
        from_date: moment().startOf("week").format("YYYY-MM-DD"),
        to_date: moment().endOf("week").format("YYYY-MM-DD"),
      };
      const response = await search("/slot/list", params).catch((err) => {
        console.log("error", err);
      });

      if (response) {
        setAvailableSlots(response["available_slots"]);
        
        let tempArray = [];
        response["available_slots"].forEach((slot) => {
          tempArray.push({
            groupId: "availableForMeeting",
            start: moment(slot.startDate).toISOString(),
            end: moment(slot.endDate).toISOString(),
            display: "background",
            // constraint: 'availableForMeeting',
          });
        });
        response["booked_slots"].forEach((slot) => {
          tempArray.push({
            id: slot.slot_id,
            start: moment(slot.startDate).toISOString(),
            end: moment(slot.endDate).toISOString(),
            title: slot.service_title,
            description: "Booked",
            booked_by: slot.booked_by,
            color: "#4F4F4F",
            resize: false,
            overlap: false,
          });
        });
        setAllSlots([...tempArray]);
      }
    }
    fetchSlots();
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
    if (service && service.id_service) {
      getService();
    } else {
      props.history.push("/");
    }
  }, [service.id_service, type, props.history, service]);

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

  const onAddBooking = (data) => {
    // availableSlots.forEach((slot) => {
    //   const startDate = moment(slot.startDate).format("YYYY-MM-DDTHH:mm:ss");
    //   const endDate = moment(slot.endDate).format("YYYY-MM-DDTHH:mm:ss");
    // });
    setAllSlots((d) => [...(d || []), data]);
  };

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
                  <TypographyComponent title="Service quality" variant="h5" />
                  <div className="book_service_quality_review_count">
                    <TypographyComponent
                      title={
                        averages && averages.average_service_quality_rating
                      }
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
                  <TypographyComponent title="Simpathy" variant="h5" />
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
                INITIAL_EVENTS={slots}
                renderEventContent={renderEventContent}
              />

              <div className="booking_time">
                <AddBookingSidebar
                  onAddBooking={(data) => onAddBooking(data)}
                  user={userData}
                  selectedService={selectedService}
                />
              </div>
            </div>
          </section>
        </React.Fragment>
      )}
    </div>
  );
};
export default withRouter(ProfileProvider);
