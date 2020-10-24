import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CircularProgress, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CheckIcon from "@material-ui/icons/Check";
import { get } from "../../Services/Auth.service";
import TypographyComponent from "../../Components/Typography/Typography";
import ProfilePic from "../../images/profile-image.png";
import { themes } from "../../themes";
import { useSidebar } from "../../Provider/SidebarProvider";
import StarRateRounded from "@material-ui/icons/StarRateRounded";
import CalendarComponent from "./Calendar/Calendar";
import ProfileProviderSidebar from "./ProfileProviderSidebar";
import OfferedServices from "./OfferedServices/OfferedServices";
import ServiceDetails from "./ServiceDetails/ServiceDetails";
import LatestReviews from "./LatestReviews/LatestReviews";
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
  const [averages, setAverages] = useState({});
  let [userData, setUserData] = useState({
    full_name: "",
    country: "",
    timezone: "",
    languages: [],
    level: [],
    services_assigned: [],
    reviews: [],
  });

  React.useEffect(() => {
    setSidebar(true);
    setSidebarContent(<ProfileProviderSidebar />);
  }, [setSidebarContent, setSidebar, history, pathname]);

  useEffect(() => {
    async function getService() {
      const res = await get(`/service/${service.id_service}`);
      if (res) {
        setSelectedService({ ...res });
        setSelectedReview(res.reviews.reviews_list);
        if (type === "job-details") {
          var elmnt = document.getElementsByClassName("service-details");
          if (elmnt[0]) {
            elmnt[0].scrollIntoView();
          }
        }
        if (type === "calendar-view") {
          var elementCalendar = document.getElementsByClassName("calendar");
          if (elementCalendar) {
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
      const res = await get(`/profile/${state && state.userId}`);
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
          <Grid
            container
            spacing={3}
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Grid item xs={12} md={4}>
              <Avatar
                alt="profile"
                src={userData.image ? userData.image : ProfilePic}
                className={classes.large}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TypographyComponent
                variant="h3"
                title={userData.full_name}
                style={{
                  fontWeight: "bold",
                  color: themes.default.colors.darkGray,
                }}
              />
              <Grid style={{ display: "flex", marginTop: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TypographyComponent
                    variant="h6"
                    title={userData.country_name}
                    style={{ marginLeft: 5 }}
                  />
                  <TypographyComponent
                    variant="h6"
                    title={userData.timezone_name}
                    style={{ marginLeft: 5 }}
                  />
                </div>
              </Grid>
              <Grid
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {userData.languages &&
                  userData.languages.map((language, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{language.language_name}</span>
                      <span>{language.language_level}</span>
                    </div>
                  ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <TypographyComponent variant="h4" title="Employer Verfication" />
              <Grid style={{ display: "flex", marginTop: 10 }}>
                <CheckIcon />
                <TypographyComponent
                  variant="h4"
                  title={userData.member_since}
                  style={{ marginLeft: 5 }}
                />
              </Grid>

              <Grid
                style={{ display: "flex", alignItems: "center", marginTop: 10 }}
              >
                <CheckIcon />
                <TypographyComponent
                  variant="h4"
                  title="E-Mail verified"
                  style={{ marginLeft: 5 }}
                />
              </Grid>
            </Grid>
          </Grid>

          <section className="offered-services">
            <OfferedServices
              userData={userData}
              setSelectedService={setSelectedService}
              setSelectedReview={setSelectedReview}
              setAverages={setAverages}
            />
          </section>
          <section className="service-details">
            <ServiceDetails averages={averages} selectedService={selectedService} />
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
                    title={averages.average_service_quality_rating}
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
                    title={averages.average_sympathy_rating}
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
                    title={selectedService.price && `${selectedService.price}$/h`}
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
