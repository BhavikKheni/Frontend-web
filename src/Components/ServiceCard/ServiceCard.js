import React from "react";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import { Typography } from "@material-ui/core/";
import CardActions from "@material-ui/core/CardActions";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import PhoneIcon from "@material-ui/icons/Phone";
import StarRateRounded from "@material-ui/icons/StarRateRounded";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import Slider from "react-animated-slider";
import TooltipComponent from "../Tooltip/Tooltip";
import TypographyComponent from "../Typography/Typography";
import { themes } from "../../themes";
import DefaultServiceImage from "../../images/defaultServiceImage.png";
import "react-animated-slider/build/horizontal.css";
import "./ServiceCard.css";
const useStyles = makeStyles((theme) => ({
  root: {
    
  },
  media: {
    height: 0,
    paddingTop: "60.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const ServiceCardComponent = (props) => {
  const classes = useStyles();
  const {
    title,
    images,
    providerName,
    service_quality_rating,
    sympathy_rating,
    price,
    onPhone,
    onCalendar,
    onServiceTitle,
    onProviderName,
    service_provider_live_now,
  } = props;

  const imageRender = () => {
    return (
      <div className="card-slider-item">
        <div>
          <div className="service">
            <div className="service_text">
              <TypographyComponent
                title="Service quality"
                className="service-quality"
              />
            </div>
            <div className="service_review">
              <TypographyComponent
                title={service_quality_rating}
              />
              <StarBorderIcon
                className="card_start_review"
              />
            </div>
          </div>
          <div className="service">
            <div className="service_text">
              <TypographyComponent title="Simpathy" />
            </div>
            <div className="service_review">
              <TypographyComponent
                // title={sympathy_rating}
                title="4.5"
              />
              <StarBorderIcon
                className="card_start_review"
              />
            </div>
          </div>
        </div>
        <div className="card-buttons">
        {service_provider_live_now ? (
          <React.Fragment>
            <div className="phoneIconCard" onClick={onPhone}>
              <PhoneIcon/>
            </div>
            <div className="calendarIconCard" onClick={onCalendar}>
              <CalendarTodayIcon/>
            </div>
          </React.Fragment>
        ):(
          <div className="calendar_book_service" onClick={onCalendar}>
            <CalendarTodayIcon/>
            <TypographyComponent
                title="Book Service"
            />
          </div>
        )}
        </div>
      </div>
    );
  };
  return (
    <Card className={clsx(classes.root, 'job_card')}>
      <div className="job_card_inner">
        <Slider>
          {images.length > 0 ? (
            images.map((image, i) => (
              <div
                key={i}
                style={{
                  background: ` URL('${image.image}') no-repeat  center  center `,
                }}
              >
                {imageRender()}
              </div>
            ))
          ) : (
            <div
            style={{
              background: ` URL('${DefaultServiceImage}') no-repeat  center  center `,
            }}
            className="previousButton nextButton"
          >
            {imageRender()}
          </div>
          )}
        </Slider>
        <CardActions disableSpacing className={"card_ratings"}>
          <div className="card-actions">
            <div className="card-actions-title" onClick={onServiceTitle}>
              <TooltipComponent title={title}>
                <Typography
                className="card_title"
                >
                  {title}
                </Typography>
              </TooltipComponent>
            </div>
            <div style={{ cursor: "pointer" }} onClick={onProviderName}>
              <TooltipComponent title={providerName || ""}>
                <Typography
                  className="card_description"
                >
                  {/* {providerName} */}
                  {'Provider name'}
                </Typography>
              </TooltipComponent>
            </div>
          </div>
          <div className="card-status">
          <span
            className={clsx(service_provider_live_now ? "live-now" : "offline")}
          >
            {service_provider_live_now === true ? "Live now" : "offline"}
          </span>
            <span className="price">{`${price}$/h`}</span>
          </div>
        </CardActions>
      </div>
    </Card>
  );
};

export default ServiceCardComponent;
