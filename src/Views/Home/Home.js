import React, { useEffect } from "react";
import clsx from "clsx";
import { withRouter, Link } from "react-router-dom";
import { MenuItem, Divider } from "@material-ui/core";
import { useSidebar } from "../../Provider/SidebarProvider";
import { useTranslation } from "react-i18next";
import { SessionContext } from "../../Provider/Provider";
import CalendarComponent from "./MyCalendar/MyCalendar";
import MyServiceHistory from "./MyServiceHistory/MyServiceHistory";
import NextBooking from "./NextBooking/NextBooking";
import NextBookingProvider from "./NextBooking/NextBookingProvider";
import PaymentMethod from "./PaymentMethod/PaymentMethod";
import AddBookingSidebar from "../../Components/Booking/AddBookingSidebar/AddBookingSidebar";
import Styles from "./home.module.css";

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
              to="/messages"
              selected={pathname === "/messages"}
            >
              {t("home.messages")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                var elmnt = document.getElementsByClassName("calendar");
                if (elmnt[0]) {
                  elmnt[0].scrollIntoView();
                }
              }}
            >
              {t("home.myCalendar.title")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                var elmnt = document.getElementsByClassName("next-booking");
                if (elmnt[0]) {
                  elmnt[0].scrollIntoView();
                }
              }}
            >
              {t("home.nextBookings")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                var elmnt = document.getElementsByClassName("service-history");
                if (elmnt[0]) {
                  elmnt[0].scrollIntoView();
                }
              }}
            >
              {t("home.myServiceHistory")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/profile"
              selected={pathname === "/profile"}
            >
              {t("home.myProfile")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                var elmnt = document.getElementsByClassName("payment-method");
                if (elmnt[0]) {
                  elmnt[0].scrollIntoView();
                }
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
    var elmnt = document.getElementsByClassName("next-booking");
    if (elmnt[0]) {
      elmnt[0].scrollIntoView();
    }
  }, []);

  return (
    <div className={clsx(Styles.home_page)}>
      <section className="next-booking">
        <NextBookingProvider user={user} />
      </section>
      <section className="next-booking" style={{marginTop: '60px'}}>
        <NextBooking user={user} />
      </section>
      <section className={clsx(Styles.service_history)}>
        <MyServiceHistory user={user} />
      </section>
      <section className="payment-method">
        <PaymentMethod />
      </section>
      <section className="calendar">
        <CalendarComponent />
      </section>
    </div>
  );
};

export default withRouter(Home);
