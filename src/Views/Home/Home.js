import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { MenuItem, Divider } from "@material-ui/core";
import { useSidebar } from "../../Provider/SidebarProvider";
import { useTranslation } from "react-i18next";

const Home = (props) => {
  const { t } = useTranslation();
  const { pathname } = props.location;
  const { setSidebarContent, setSidebar } = useSidebar();
  useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div style={{ margin: 20 }}>
        <MenuItem>{t("home.messages")}</MenuItem>
        <MenuItem>{t("home.myCalendar")}</MenuItem>
        <MenuItem>{t("home.nextBookings")}</MenuItem>
        <MenuItem>{t("home.myServiceHistory")}</MenuItem>
        <MenuItem
          component={Link}
          to="/profile"
          selected={pathname === "/profile"}
        >
          {t("home.myProfile")}
        </MenuItem>
        <MenuItem>{t("home.paymentMethods")}</MenuItem>
        <MenuItem>
          <Divider
            style={{
              border: "0.5px solid #949494",
              width: "84%",
            }}
          />
        </MenuItem>
        <MenuItem>{t("home.feedback")}</MenuItem>
        <MenuItem>{t("home.faq")}</MenuItem>
        <MenuItem>{t("home.support")}</MenuItem>
      </div>
    );
  }, [setSidebarContent, setSidebar, t, pathname]);
  return <div>HOME</div>;
};

export default withRouter(Home);
