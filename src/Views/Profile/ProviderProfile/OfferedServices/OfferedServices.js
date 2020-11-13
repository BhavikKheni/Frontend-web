import React from "react";
import Grid from "@material-ui/core/Grid";
import Rating from "@material-ui/lab/Rating";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "react-i18next";
import TypographyComponent from "../../../../Components/Typography/Typography";

const OfferedServices = (props) => {

  const {
    userData,
    setSelectedService,
    setSelectedReview,
    setAverages,
  } = props;

  const { t } = useTranslation();

  return (
    <section className="offered-services">
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TypographyComponent
            variant="h4"
            title={t("providerProfile.offeredService")}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Divider
            style={{
              border: "0.5px solid #9E9E9E",
            }}
          />
        </Grid>
      </Grid>

      <div className="offered_services_inner">
        {userData.services_created &&
          userData.services_created.map((o, i) => {
            return (
              <div
                key={i}
                onClick={() => {
                  setSelectedService(o);
                  const { reviews_list } = o.reviews || [];
                  const { averages } = o.reviews || {};
                  setSelectedReview(reviews_list);
                  setAverages(averages);
                  var elementCalendar = document.getElementsByClassName('service-details');
                  if (elementCalendar[0]) {
                    elementCalendar[0].scrollIntoView();
                  }
                }}
                className="offered_services_item"
              >
                  <TypographyComponent
                    variant="h2"
                    title={`${o.price} CHF/h`}
                  />
                  <TypographyComponent variant="h5" title={o.title} />
                  <div className="offered_services_review">
                    <TypographyComponent
                      variant="h6"
                      title={"Service Quality"}
                    />
                    <Rating
                      name="Quality"
                      value={
                        o.reviews.averages &&
                        o.reviews.averages.average_service_quality_rating
                      }
                      size="small"
                      disabled
                    />
                  </div>
                  <div className="offered_services_review">
                    <TypographyComponent variant="h6" title="Simpathy" />
                    <Rating
                      name="simpathy"
                      value={
                        o.reviews.averages &&
                        o.reviews.averages.average_sympathy_rating
                      }
                      size="small"
                      disabled
                    />
                  </div>
              </div>
            );
          })}
        </div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Divider
            style={{
              border: "0.5px solid #9E9E9E",
            }}
          />
        </Grid>
      </Grid>
    </section>
  );
};

export default OfferedServices;
