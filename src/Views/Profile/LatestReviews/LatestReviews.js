import React from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { themes } from "../../../themes";
import TypographyComponent from "../../../Components/Typography/Typography";

const LatestReviews = (props) => {
  const { t } = useTranslation();
  const { selectedReviews } = props;
  return (
    <React.Fragment>
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
          {selectedReviews.length === 0 ? (
            <span>{t('providerProfile.notFoundReviews')}</span>
          ) : (
            selectedReviews.map((review, index) => (
              <div
                key={index}
                className="provider-profile-review provider-profile-review-box"
              >
                <img
                  alt="review"
                  src={review.reviewer_image}
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
                      title={moment(review.updated_at).format("MMMM Do YYYY")}
                      variant="h6"
                      style={{
                        fontWeight: 300,
                        fontStyle: "italic",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
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

export default LatestReviews;
