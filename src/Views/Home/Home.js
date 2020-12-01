import React, { useEffect } from "react";
import clsx from "clsx";
import { withRouter, Link } from "react-router-dom";
import { MenuItem, Divider } from "@material-ui/core";
import { useSidebar } from "../../Provider/SidebarProvider";
import { useTranslation } from "react-i18next";
import { SessionContext } from "../../Provider/Provider";
import BookedCalendarComponent from "./BookedCalendar/BookedCalendar";
import MyServiceHistory from "./MyServiceHistory/MyServiceHistory";
import PaymentMethod from "./PaymentMethod/PaymentMethod";
import Styles from "./home.module.css";
import HomeWrapper from "./HomeWrapper";
import { scrollToSection } from "../../utils";
import AddBookingSidebar from "../../Components/Booking/AddBookingSidebar/AddBookingSidebar";
import NewNextBooking from "./NextBooking/NewNextBooking";
const useSession = () => React.useContext(SessionContext);

const Home = (props) => {
  const { t } = useTranslation();
  const { pathname } = props.location;
  let { isLoggedIn, user } = useSession();

  const { setSidebarContent, setSidebar } = useSidebar();

  const onAddBooking = (data) => {
    console.log("Data", data);
  };

  useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div style={{ margin: 20 }}>
        {isLoggedIn && (
          <React.Fragment>
            <MenuItem
              component={Link}
              to="/home/messages"
              selected={pathname === "/home/messages"}
            >
              {t("home.messages")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/home/calendar"
              selected={pathname === "/home/calendar"}
              onClick={() => {
                scrollToSection("calendar");
              }}
            >
              {t("home.myCalendar.title")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/home/next-booking"
              selected={pathname === "/home/next-booking"}
              onClick={() => {
                scrollToSection("next_booking");
              }}
            >
              {t("home.nextBookings")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/home/service-history"
              selected={pathname === "/home/service-history"}
              onClick={() => {
                scrollToSection("service_history");
              }}
            >
              {t("home.myServiceHistory")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/home/profile"
              selected={pathname === "/home/profile"}
              onClick={() => {
                scrollToSection("profile_section");
              }}
            >
              {t("home.myProfile")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/home/payment-methods"
              selected={pathname === "/home/payment-methods"}
              onClick={() => {
                scrollToSection("payment_methods");
              }}
            >
              {t("home.paymentMethods")}
            </MenuItem>
            <MenuItem>
              <Divider
                style={{
                  border: "0.5px solid #949494",
                  width: "84%",
                }}
              />
            </MenuItem>
          </React.Fragment>
        )}
        <MenuItem>{t("home.feedback")}</MenuItem>
        <MenuItem>{t("home.faq")}</MenuItem>
        <MenuItem>{t("home.support")}</MenuItem>
        <div className="booking_time">
          <AddBookingSidebar
            onAddBooking={(data) => onAddBooking(data)}
            user={user}
            // selectedService={selectedService}
          />
        </div>
      </div>
    );
  }, [setSidebarContent, setSidebar, t, pathname, isLoggedIn, user]);

  useEffect(() => {
    if(pathname === "/home"){
      scrollToSection("main_content")
    }else if (pathname === "/home/payment-methods") {
      scrollToSection("payment_methods");
    } else if (pathname === "/home/next_booking") {
      scrollToSection("next_booking");
    } else if (pathname === "/home/calendar") {
      scrollToSection("calendar");
    } else if (pathname === "/home/service_history") {
      scrollToSection("service_history");
    } 
  }, [pathname]);

  return (
    <div className={clsx(Styles.home_page)}>
      <HomeWrapper> </HomeWrapper>
      <section className="next_booking">
        <NewNextBooking user={user}></NewNextBooking>
      </section>
      {/* <section className="next_booking">
        <NextBookingProvider user={user} />
      </section>
      <section className="next_booking" style={{ marginTop: "60px" }}>
        <NextBooking user={user} />
      </section> */}
      <section className={clsx(Styles.service_history, "service_history")}>
        <MyServiceHistory user={user} />
      </section>
      <section className="payment_methods">
        <PaymentMethod />
      </section>
      <section className="calendar">
        <BookedCalendarComponent />
      </section>
    </div>
  );
};

export default withRouter(Home);
