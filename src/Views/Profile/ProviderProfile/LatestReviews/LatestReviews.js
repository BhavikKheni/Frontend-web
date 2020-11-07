import React from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { themes } from "../../../../themes";
import TypographyComponent from "../../../../Components/Typography/Typography";

const LatestReviews = (props) => {
  const { t } = useTranslation();
  const { selectedReviews } = props;
  return (
    <section className="latest-reviews">
      <TypographyComponent
        variant="h4"
        title={t("providerProfile.latestReview")}
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Divider
            style={{
              border: "0.5px solid #9E9E9E",
            }}
          />
        </Grid>
      </Grid>

      <div className="latest_reviews_inner">
      {selectedReviews && selectedReviews.length === 0 ? (
            <span>{t('providerProfile.notFoundReviews')}</span>
          ) : (
            selectedReviews && selectedReviews.map((review, index) => (
              <div
                key={index}
                className="provider_profile_review_item"
              >
                <div className="provider_profile_review_content">
                  <img
                    alt="Avtar"
                    src={review.reviewer_image}
                  />
                  <div>
                    <TypographyComponent
                      title={review.title}
                      variant="h6"
                    />
                    <TypographyComponent title={review.content} />
                  </div>
                </div>
                
                <div className="provider_profile_review_time">
                    <TypographyComponent
                      title={moment(review.updated_at).format("MMMM Do YYYY")}
                      variant="span"
                    />
                  </div>
              </div>
            ))
          )}
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

export default LatestReviews;
