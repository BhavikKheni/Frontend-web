import React from "react";
import Card from "@material-ui/core/Card";
import { Typography } from "@material-ui/core/";
import CardActions from "@material-ui/core/CardActions";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import PhoneIcon from "@material-ui/icons/Phone";
import StarRateRounded from "@material-ui/icons/StarRateRounded";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import Slider from "react-animated-slider";
import TooltipComponent from "../Tooltip/Tooltip";
import TypographyComponent from "../Typography/Typography";
import { themes } from "../../themes";
import DefaultServiceImage from "../../Images/defaultServiceImage.png";
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
    onJobTitle,
    onProviderName,
  } = props;
  const imageRender = () => {
    return (
      <div className="card-slider-item">
        <div>
          <div className="service">
            <TypographyComponent
              title="Service quality"
              className="service-quality"
            />
            <TypographyComponent
              title={service_quality_rating}
              style={{ marginLeft: 5 }}
            />
            <StarRateRounded style={{ marginLeft: 5 }} />
          </div>
          <div className="service">
            <TypographyComponent title="Simpathy" />
            <TypographyComponent
              title={sympathy_rating}
              style={{ marginLeft: 5 }}
            />
            <StarRateRounded style={{ marginLeft: 5 }} />
          </div>
        </div>
        <div className="card-buttons">
          <div className="phoneIconCard" onClick={onPhone}>
            <PhoneIcon style={{ color: "#fff" }} />
          </div>
          <div className="calendarIconCard" onClick={onCalendar}>
            <CalendarTodayIcon style={{ color: "#fff" }} />
          </div>
        </div>
      </div>
    );
  };
  return (
    <Card className={classes.root}>
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
          <div className="card-actions-title" onClick={onJobTitle}>
            <TooltipComponent title={title}>
              <Typography
                variant="h4"
                noWrap
                style={{
                  fontSize: 20,
                  color: themes.default.colors.white,
                  fontWeight: 500,
                  width: 115,
                }}
              >
                {title}
              </Typography>
            </TooltipComponent>
            <ArrowForwardIosIcon style={{ marginLeft: 5, marginTop: 10 }} />
          </div>
          <div style={{ cursor: "pointer" }} onClick={onProviderName}>
            <TooltipComponent title={providerName || ""}>
              <Typography
                variant="h6"
                style={{
                  fontWeight: "normal",
                  color: themes.default.colors.white,
                  width: 115,
                }}
                noWrap
              >
                {providerName}
              </Typography>
            </TooltipComponent>
          </div>
        </div>
        <div className="card-actions" style={{ marginTop: 5 }}>
          <span className="live-now"> Live now</span>
          <span className="price">{`${price}/h`}</span>
        </div>
      </CardActions>
    </Card>
  );
};

export default ServiceCardComponent;
