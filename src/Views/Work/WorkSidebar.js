import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { useTranslation } from "react-i18next";

const WorkSidebar = (props) => {
  const { t } = useTranslation();

  return (
    <div style={{ margin: 20 }}>
      <MenuItem
        onClick={() => {
          var elmnt = document.getElementsByClassName("start_work");
          if (elmnt[0]) {
            elmnt[0].scrollIntoView();
          }
        }}
      >
        {t("service.create-service.startWork")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          var elmnt = document.getElementsByClassName("my_work_services");
          if (elmnt[0]) {
            elmnt[0].scrollIntoView();
          }
        }}
      >
        {t("service.create-service.myServiceLibrary")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          var elmnt = document.getElementsByClassName("add_booking_space");
          if (elmnt[0]) {
            elmnt[0].scrollIntoView();
          }
        }}
      >
        {t("service.create-service.addBookingSpace")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          var elmnt = document.getElementsByClassName("create_service");
          if (elmnt[0]) {
            elmnt[0].scrollIntoView();
          }
        }}
      >
        {t("service.create-service.createSpace")}
      </MenuItem>
    </div>
  );
};

export default WorkSidebar;
