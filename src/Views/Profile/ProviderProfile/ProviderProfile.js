import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { LOCALSTORAGE_DATA } from "../../../utils";
import { get } from "../../../Services/Auth.service";
import TypographyComponent from "../../../Components/Typography/Typography";
import { useSidebar } from "../../../Provider/SidebarProvider";
import ProfileProviderSidebar from "./ProviderProfileSidebar";
import OfferedServices from "./OfferedServices/OfferedServices";
import ServiceDetails from "./ServiceDetails/ServiceDetails";
import LatestReviews from "./LatestReviews/LatestReviews";
import ProviderDetails from "./ProviderDetails/ProviderDetails";
import BookServiceCalendar from "./BookServiceCalendar/BookServiceCalendar";
import "./ProviderProfile.css";

const ProfileProvider = (props) => {
  const { setSidebarContent, setSidebar } = useSidebar();
  const [isLoading, setLoading] = useState(false);
  const { state = {} } = props.location && props.location;
  let { pathname } = props.location;
  const { service = {}, type, loginUser } = state;
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

  // For the languages
  useEffect(() => {
    getLanguages();
  }, []);

  // For the service details
  useEffect(() => {
    if (service && service.id_service) {
      getServiceDetails();
    } else {
      props.history.push("/");
    }
  }, [service.id_service, type, props.history, service]);

  // For the profile details
  useEffect(() => {
    getProfileDetails();
  }, [state]);

  // Get the service details
  const getServiceDetails = async () => {
    const res = await get(`/service/${service.id_service}`).catch((error) => {
      console.log(error);
    });
    if (res) {
      setSelectedService({ ...res });
      const { reviews_list = [] } = res.reviews || [];
      setSelectedReview(reviews_list);
      if (type === "job-details") {
        scrollToSection("service-details");
      } else if (type === "calendar-view") {
        scrollToSection("book-service");
      }
    }
  };

  // Get the languages
  const getLanguages = async () => {
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
  };

  // Get the profile details
  const getProfileDetails = async () => {
    setLoading(true);
    if (state && state.userId) {
      await get(`/profile/${state.userId}`)
        .then((res) => {
          setLoading(false);
          setUserData({ ...res.data });
          if (type === "job-details") {
            scrollToSection("service-details");
          } else if (type === "calendar-view") {
            scrollToSection("book-service");
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };

  // This function help us to scroll a page to specific section
  const scrollToSection = (sectionName) => {
    var elementCalendar = document.getElementsByClassName(sectionName);
    if (elementCalendar[0]) {
      elementCalendar[0].scrollIntoView();
    }
  };

  const showLoader = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <CircularProgress />
      </div>
    );
  };

  return (
    <div className="profile_page_wrapper provider_profile_wrapper">
      <TypographyComponent title="Provider profile" variant="h4" />
      {isLoading ? (
        showLoader()
      ) : (
        <React.Fragment>
          <ProviderDetails userData={userData} allLanguages={allLanguages} />
          <OfferedServices
            userData={userData}
            setSelectedService={setSelectedService}
            setSelectedReview={setSelectedReview}
            setAverages={setAverages}
          />
          <ServiceDetails
            averages={averages}
            selectedService={selectedService}
          />
          <LatestReviews selectedReviews={selectedReviews} />
          <BookServiceCalendar
            averageRatingInfo={averages}
            selectedServiceDetails={selectedService}
            userData={userData}
            loginUser={loginUser}
          />
        </React.Fragment>
      )}
    </div>
  );
};
export default withRouter(ProfileProvider);
