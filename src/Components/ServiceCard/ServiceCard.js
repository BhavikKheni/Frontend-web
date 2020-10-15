import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import LaunchIcon from "@material-ui/icons/Launch";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import PhoneIcon from "@material-ui/icons/Phone";
import StarRateRounded from "@material-ui/icons/StarRateRounded";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import Slider from "react-animated-slider";
import TypographyComponent from "../Typography/Typography";
import Pic from "../../image 2.png";
import "react-animated-slider/build/horizontal.css";
import "./ServiceCard.css";
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 455,
    width: "100%",
    margin: 15,
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
    description,
    price,
    onPhone,
    onCalendar,
    onJobTitle
  } = props;
  return (
    <Card className={classes.root}>
      <Slider>
        <div
          style={{
            background: ` URL('${Pic}') no-repeat  center  center `,
          }}
        >
          <div className="card-slider-item">
            <div>
              <div className="service">
                <TypographyComponent
                  title="Service quality"
                  className="service-quality"
                />
                <TypographyComponent title="4.5" style={{ marginLeft: 5 }} />
                <StarRateRounded style={{ marginLeft: 5 }} />
              </div>
              <div className="service">
                <TypographyComponent title="Simpathy" />
                <TypographyComponent title="4.5" style={{ marginLeft: 5 }} />
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
        </div>
      </Slider>
      <CardActions disableSpacing className={"card_ratings"}>
        <div className="card-actions">
          <div className="card-actions-title" onClick={onJobTitle}>
            <span>{title}</span>
            <ArrowForwardIosIcon style={{ marginLeft: 5 }} />
          </div>
          <div>
            <span>Provider name</span>
          </div>
        </div>
        <div className="card-actions" style={{ marginTop: 5 }}>
          <span>Live now</span>
          <span>{price}/h</span>
        </div>
      </CardActions>
    </Card>
  );
};

export default ServiceCardComponent;
