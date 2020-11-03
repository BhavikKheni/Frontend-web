import React from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@material-ui/core";
import CalendarComponent from "../../../Components/Calendar/Calendar";
import TypographyComponent from "../../../Components/Typography/Typography";

const MyCalendar = (props) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TypographyComponent
            title={t("home.myCalendar.title")}
            variant="h3"
          />
        </Grid>
      </Grid>
      <CalendarComponent />
    </React.Fragment>
  );
};
export default MyCalendar;
