import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CircularProgress, Avatar } from "@material-ui/core";
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

const INITIAL_EVENTS = [];
const ProfileProvider = (props) => {
  const { setSidebarContent, setSidebar } = useSidebar();
  const { t } = useTranslation();
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const { state } = props && props.location;
  let { pathname } = props.location;
  const { service = {}, type } = state;
  const { history } = props;
  const [selectedService, setSelectedService] = useState({});
  const [selectedReviews, setSelectedReview] = useState([]);
  const [allLanguages, setAllLanguges] = useState([]);
  const [averages, setAverages] = useState({});
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
    setSidebarContent(<ProfileProviderSidebar />);
  }, [setSidebarContent, setSidebar, history, pathname]);

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
    <div style={{ margin: 20 }}>
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
                  title={userData.country_name}
                />
                <TypographyComponent
                  variant="h6"
                  title={userData.timezone_name}
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
          <section className="calendar">
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TypographyComponent
                  variant="h4"
                  title={t("providerProfile.bookService")}
                  style={{
                    color: themes.default.colors.darkGray,
                    fontWeight: "500px",
                    marginTop: 20,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <div className="service">
                  <TypographyComponent
                    title="Service quality"
                    className="service-quality"
                    variant="h6"
                    style={{
                      color: themes.default.colors.darkGray,
                    }}
                  />
                  <TypographyComponent
                    title={averages && averages.average_service_quality_rating}
                    style={{
                      marginLeft: 5,
                      color: themes.default.colors.darkGray,
                    }}
                    variant="h6"
                  />
                  <StarRateRounded
                    style={{
                      marginLeft: 5,
                      color: themes.default.colors.darkGray,
                    }}
                  />
                  <TypographyComponent
                    variant="h5"
                    title={selectedService.title}
                    style={{
                      marginLeft: 5,
                      color: themes.default.colors.darkGray,
                    }}
                  />
                </div>
                <div className="service">
                  <TypographyComponent
                    title="Simpathy"
                    variant="h6"
                    style={{
                      marginLeft: 5,
                      color: themes.default.colors.darkGray,
                    }}
                  />
                  <TypographyComponent
                    title={averages && averages.average_sympathy_rating}
                    style={{
                      marginLeft: 5,
                      color: themes.default.colors.darkGray,
                    }}
                    variant="h6"
                  />
                  <StarRateRounded
                    style={{
                      marginLeft: 5,
                      color: themes.default.colors.darkGray,
                    }}
                  />
                  <TypographyComponent
                    variant="h6"
                    title={
                      selectedService.price && `${selectedService.price}$/h`
                    }
                    style={{
                      marginLeft: 5,
                      color: themes.default.colors.darkGray,
                    }}
                  />
                </div>
                <CalendarComponent
                  INITIAL_EVENTS={INITIAL_EVENTS}
                  renderEventContent={renderEventContent}
                />
              </Grid>
            </Grid>
          </section>
        </React.Fragment>
      )}
    </div>
  );
};
export default withRouter(ProfileProvider);
