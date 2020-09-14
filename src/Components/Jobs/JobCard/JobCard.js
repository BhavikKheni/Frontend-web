import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import LaunchIcon from "@material-ui/icons/Launch";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import TooltipComponent from "../../../Components/Tooltip/Tooltip";
import RatingComponent from "../../Rating/Rating";
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 300,
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

const JobCardComponent = (props) => {
  const classes = useStyles();
  const { title, image, header, description, price } = props;
  return (
    <Card className={classes.root}>
      <div className={"card_header"}>
        <TooltipComponent title="Tushar Balar">
          <Avatar aria-label="name" className={classes.avatar}>
            TB
          </Avatar>
        </TooltipComponent>
        <div className={"card_title"}>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="caption">
            <span color="primary">Live Now</span> - <span>{price}$/h</span>
          </Typography>
        </div>
        <TooltipComponent title="Open in new tab">
          <IconButton aria-label="settings">
            <LaunchIcon />
          </IconButton>
        </TooltipComponent>
      </div>
      <CardMedia
        className={classes.media}
        image="https://cdn.jpegmini.com/user/images/slider_puffin_jpegmini_mobile.jpg"
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing className={"card_ratings"}>
        <Typography variant="caption" color="textSecondary" component="p">
          <span>Simpathy</span>
          <span>
            <RatingComponent
              name="Simpathy"
              precision={0.5}
              defaultValue={3.5}
              readOnly
              emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
          </span>
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          component="p"
          align="right"
        >
          <span>Service Quality</span>
          <span>
            <RatingComponent
              name="Quality"
              defaultValue={2.5}
              precision={0.5}
              readOnly
              emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
          </span>
        </Typography>
      </CardActions>
    </Card>
  );
};

export default JobCardComponent;
