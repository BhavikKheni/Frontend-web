import React from "react";
import Grid from "@material-ui/core/Grid";
import Rating from "@material-ui/lab/Rating";
import { useTranslation } from "react-i18next";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import PhoneIcon from "@material-ui/icons/Phone";
import TypographyComponent from "../../../../Components/Typography/Typography";

const ServicesDetails = (props) => {
  const { t } = useTranslation();
  const { averages, selectedService } = props;

  const onPhone = () => {};

  const onCalendar = () => {};

  return (
    <React.Fragment>
      <TypographyComponent
        variant="h4"
        title={t("providerProfile.serviceDetails")}
      />
      <TypographyComponent
        variant="h4"
        title={t("providerProfile.serviceTitle")}
        style={{ fontWeight: "normal" }}
      />
      <div className="service_inner">
        <div className="service_left">
          <div className="about_meeting">
            <div onClick={onCalendar} className="calendarIcon">
              <CalendarTodayIcon/>
            </div>
            <div onClick={onPhone} className="phoneIcon">
              <PhoneIcon/>
            </div>
          </div>
          {/* <TypographyComponent
            title={selectedService.price && `${selectedService.price}$/h`}
          /> */}
          <TypographyComponent
            variant="h6"
            title={'0.00$/h'}
          />
          <div className="about_service">
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
          <div className="about_service">
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
        </div>
        <Grid item xs={12} md={6}>
          <TypographyComponent title={selectedService.description} />
        </Grid>
        <div>
          {selectedService.images &&
            selectedService.images.map((image, index) => (
              <div key={index}>
                <img alt="service" src={image.image}></img>
              </div>
            ))}
        </div>
        <div className="service_right">
          {/* <TypographyComponent title={selectedService.description} /> */}
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.t ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.t ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.t ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.t ut labore.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
        </div>
      </div>
      <div className="service_images_wrapper">
        {selectedService.images &&
          selectedService.images.map((image, index) => (
            <div key={index} className="service_image">
              <img alt="service" src={image.image}></img>
            </div>
          ))}
      </div>
    </React.Fragment>
  );
};

export default ServicesDetails;
