import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CircularProgress from '@material-ui/core/CircularProgress';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import LaunchIcon from '@material-ui/icons/Launch';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 300
  },
  media: {
    height: 0,
    paddingTop: '50.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const Home = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Card className={classes.root}>
        <div className={'card-header'}>
          <Tooltip title="Tushar Balar" placement="top-start" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow>
              <Avatar aria-label="name" className={classes.avatar}>
                  TB
              </Avatar>
          </Tooltip>
          <div className={'card-title'}>
            <Typography variant="subtitle1" >
              Frontend Developer
            </Typography>
            <Typography variant="caption">
            <span color="primary">Live Now</span> - <span>12.5$/h</span>
            </Typography>
          </div>
          <IconButton aria-label="settings">
              <LaunchIcon />
            </IconButton>
        </div>
        <CardMedia
          className={classes.media}
          image="https://cdn.jpegmini.com/user/images/slider_puffin_jpegmini_mobile.jpg"
          title="Paella dish"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            This impressive paella is a perfect party dish and a fun meal to cook together with your
            guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>
        <CardActions disableSpacing className={'card-ratings'}>
            <Typography variant="caption" color="textSecondary" component="p">
                <span>Simpathy</span>
                <span>
                  <StarBorderRoundedIcon />
                  <StarBorderRoundedIcon />
                  <StarBorderRoundedIcon />
                  <StarBorderRoundedIcon />
                  <StarBorderRoundedIcon />
                </span>
            </Typography>
            <Typography variant="caption" color="textSecondary" component="p" className={'text-right'}>
                <span>Service Quality</span>
                <span>
                  <StarBorderRoundedIcon />
                  <StarBorderRoundedIcon />
                  <StarBorderRoundedIcon />
                  <StarBorderRoundedIcon />
                  <StarBorderRoundedIcon />
                </span>
            </Typography>
        </CardActions>
      </Card>
    </React.Fragment>
  );
};

export default Home;