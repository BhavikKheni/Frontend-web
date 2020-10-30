import React from "react";
import Grid from "@material-ui/core/Grid";
import Rating from "@material-ui/lab/Rating";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "react-i18next";
import TypographyComponent from "../../../../Components/Typography/Typography";
import { themes } from "../../../../themes";

const OfferedServices = (props) => {
  const {
    userData,
    setSelectedService,
    setSelectedReview,
    setAverages,
  } = props;
  const { t } = useTranslation();
  return (
    <React.Fragment>
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
            style={{
              height: "100%",
              maxHeight: 514,
              overflowY: "auto",
            }}
          >
            {userData.services_created &&
              userData.services_created.map((o, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    onClick={() => {
                      setSelectedService(o);
                      const { reviews_list } = o.reviews || [];
                      const { averages } = o.reviews || {};
                      setSelectedReview(reviews_list);
                      setAverages(averages);
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
                          value={
                            o.reviews.averages &&
                            o.reviews.averages.average_service_quality_rating
                          }
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
                        <TypographyComponent variant="h4" title="Simpathy" />
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
                    </Grid>
                  </div>
                );
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
    </React.Fragment>
  );
};

export default OfferedServices;
