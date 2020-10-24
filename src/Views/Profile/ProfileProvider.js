import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Rating from "@material-ui/lab/Rating";
import CheckIcon from "@material-ui/icons/Check";
import Divider from "@material-ui/core/Divider";
import ChevronLeftOutlined from "@material-ui/icons/ChevronLeftOutlined";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import PhoneIcon from "@material-ui/icons/Phone";
import MenuItem from "@material-ui/core/MenuItem";
import { SessionContext } from "../../Provider/Provider";
import { get } from "../../Services/Auth.service";
import ButtonComponent from "../../Components/Forms/Button";
import TypographyComponent from "../../Components/Typography/Typography";
import ProfilePic from "../../images/profile-image.png";
import { themes } from "../../themes";
import { useSidebar } from "../../Provider/SidebarProvider";
import { useTranslation } from "react-i18next";
import StarRateRounded from "@material-ui/icons/StarRateRounded";
import moment from "moment";
import "./ProviderProfile.css";
const useSession = () => React.useContext(SessionContext);

const ProfileProvider = (props) => {
  const { setSidebarContent, setSidebar } = useSidebar();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const { state } = props && props.location;
  let { pathname } = props.location;
  const { history } = props;
  const [selectedJob, setSelectedJob] = useState({});
  const [selectedReviews, setSelectedReview] = useState([]);
  let [userData, setUserData] = useState({
    full_name: "",
    country: "",
    timezone: "",
    languages: [],
    level: [],
    jobs_assigned: [],
    reviews: [],
  });

  const onPhone = () => {};
  const onCalendar = () => {};
  React.useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div style={{ margin: 20 }}>
        <MenuItem
          onClick={() => {
            history.goBack();
          }}
        >
          <ChevronLeftOutlined />
          Go back
        </MenuItem>
        <MenuItem
          component={Link}
          to="/profile-provider"
          selected={pathname === "/profile-provider"}
        >
          Provider Profile
        </MenuItem>
        <MenuItem>Offered services</MenuItem>
        <MenuItem>Service details</MenuItem>
        <MenuItem>Book service</MenuItem>
      </div>
    );
  }, [setSidebarContent, setSidebar, history, pathname]);

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
            <Grid item xs={12} md={2} xl={2}>
              <img alt="profile" src={ProfilePic} className="profile-image" />
            </Grid>
            <Grid item xs={12} md={2} xl={2}>
              <TypographyComponent
                variant="h3"
                title={userData && userData.full_name}
                style={{
                  fontWeight: "bold",
                  color: themes.default.colors.darkGray,
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <Grid style={{ display: "flex", marginTop: 10 }}>
                    <TypographyComponent
                      variant="h6"
                      title={userData.country}
                      style={{ marginLeft: 5 }}
                    />
                  </Grid>
                  <Grid className="profile-languages">
                    {userData.languages &&
                      userData.languages.map((language, i) => (
                        <span key={i}>{language}</span>
                      ))}
                  </Grid>
                </div>
                <div>
                  <Grid style={{ display: "flex", marginTop: 10 }}>
                    <TypographyComponent
                      variant="h6"
                      title={"10:03"}
                      style={{ marginLeft: 5 }}
                    />
                  </Grid>
                  <Grid className="profile-languages">
                    {userData.level &&
                      userData.level.map((level, i) => (
                        <span key={i}>{level}</span>
                      ))}
                  </Grid>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={8} xl={8}>
              <TypographyComponent variant="h4" title="Employer Verfication" />
              <Grid style={{ display: "flex", marginTop: 10 }}>
                <CheckIcon />
                <TypographyComponent
                  variant="h4"
                  title="Member since September 2009"
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <TypographyComponent
                variant="h4"
                title={t("providerProfile.offeredService")}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Divider
                style={{
                  border: "0.5px solid #9E9E9E",
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <div
                style={{ height: "100%", maxHeight: 514, overflowY: "auto" }}
              >
                {userData.jobs_assigned &&
                  userData.jobs_assigned.map((o, i) => {
                    o.reviews.map((r) => {
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          onClick={() => {
                            setSelectedJob(o);
                            setSelectedReview(o.reviews);
                          }}
                        >
                          <Grid item xs={12} md={2}>
                            <TypographyComponent
                              variant="h2"
                              style={{
                                color: themes.default.colors.darkGray,
                                fontWeight: 500,
                              }}
                              title={`${o.price}$/h`}
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <TypographyComponent variant="h4" title={o.title} />
                          </Grid>
                          <Grid item xs={12} md={4}></Grid>
                          <Grid item xs={12} md={3}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <TypographyComponent
                                variant="h4"
                                title={"Service Quality"}
                              />
                              <Rating
                                name="Quality"
                                value={r.serviceQuality}
                                size="small"
                                disabled
                              />
                            </div>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <TypographyComponent
                                variant="h4"
                                title="Simpathy"
                              />
                              <Rating
                                name="simpathy"
                                value={r.simpathy}
                                size="small"
                                disabled
                              />
                            </div>
                          </Grid>
                        </div>
                      );
                    });
                  })}
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Divider
                style={{
                  border: "0.5px solid #9E9E9E",
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <TypographyComponent
                variant="h4"
                title={t("providerProfile.serviceDetails")}
                style={{ marginTop: 20 }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={2}>
              <TypographyComponent
                variant="h4"
                title={t("providerProfile.serviceTitle")}
                style={{ fontWeight: "normal" }}
              />
              <div style={{ display: "flex", marginTop: 10 }}>
                <div onClick={onPhone} className="phoneIcon">
                  <PhoneIcon style={{ color: "#fff" }} />
                </div>
                <div onClick={onCalendar} className="calendarIcon">
                  <CalendarTodayIcon style={{ color: "#fff" }} />
                </div>
              </div>
              <TypographyComponent
                title={selectedJob.price && `${selectedJob.price}$/h`}
                style={{ marginTop: 10 }}
              />
              <div style={{ marginTop: 10 }}>
                <TypographyComponent
                  title={t("providerProfile.serviceQuality")}
                  variant="h4"
                />
                <Rating
                  name="service-quality"
                  value={selectedJob.service_quality_rating}
                  size="small"
                  disabled
                />
              </div>
              <div style={{ marginTop: 10 }}>
                <TypographyComponent
                  title={t("providerProfile.simpathy")}
                  variant="h4"
                />
                <Rating
                  name="simpathy"
                  value={selectedJob.sympathy_rating}
                  size="small"
                  disabled
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <TypographyComponent title={selectedJob.description} />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TypographyComponent
                variant="h4"
                title={t("providerProfile.latestReview")}
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
              <Divider
                style={{
                  border: "0.5px solid #9E9E9E",
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {selectedReviews &&
                selectedReviews.map((review, index) => (
                  <div
                    key={index}
                    className="provider-profile-review provider-profile-review-box"
                  >
                    <img
                      alt="review"
                      style={{ height: 70, width: 70, marginRight: 10 }}
                    />
                    <div>
                      <TypographyComponent
                        title={review.title}
                        variant="h6"
                        style={{
                          color: themes.default.colors.matterhorn,
                          fontWeight: 500,
                          textAlign: "left",
                        }}
                      />
                      <TypographyComponent title={review.content} />
                      <div className="time">
                        <TypographyComponent
                          title={moment(review.updated_at).format(
                            "MMMM Do YYYY"
                          )}
                          variant="h6"
                          style={{
                            fontWeight: 300,
                            fontStyle: "italic",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Divider
                style={{
                  border: "0.5px solid #9E9E9E",
                }}
              />
            </Grid>
          </Grid>
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
                  title={selectedJob.service_quality_rating}
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
                  title={selectedJob.title}
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
                  title={selectedJob.sympathy_rating}
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
                  title={selectedJob.price && `${selectedJob.price}$/h`}
                  style={{
                    marginLeft: 5,
                    color: themes.default.colors.darkGray,
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </React.Fragment>
      )}
    </div>
  );
};
export default withRouter(ProfileProvider);
