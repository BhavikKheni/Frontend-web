import React from "react";
import Grid from "@material-ui/core/Grid";
import Rating from "@material-ui/lab/Rating";
import { useTranslation } from "react-i18next";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import PhoneIcon from "@material-ui/icons/Phone";
import TypographyComponent from "../../../Components/Typography/Typography";

const ServicesDetails = (props) => {
  const { t } = useTranslation();
  const { averages, selectedService } = props;

  const onPhone = () => {};

  const onCalendar = () => {};

  return (
    <React.Fragment>
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
            title={selectedService.price && `${selectedService.price}$/h`}
            style={{ marginTop: 10 }}
          />
          <div style={{ marginTop: 10 }}>
            <TypographyComponent
              title={t("providerProfile.serviceQuality")}
              variant="h4"
            />
            <Rating
              name="service-quality"
              value={averages && averages.average_service_quality_rating}
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
              value={averages && averages.average_sympathy_rating}
              size="small"
              disabled
            />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <TypographyComponent title={selectedService.description} />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <div>
          {selectedService.images &&
            selectedService.images.map((image, index) => (
              <div key={index}>
                <img alt="service" src={image}></img>
              </div>
            ))}
        </div>
      </Grid>
    </React.Fragment>
  );
};

export default ServicesDetails;
