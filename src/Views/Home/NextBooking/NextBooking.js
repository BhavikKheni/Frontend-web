import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Popover from "@material-ui/core/Popover";
import CloseIcon from "@material-ui/icons/Close";
import Spinner from "../../../Components/Spinner/Spinner";
import ButtonComponent from "../../../Components/Forms/Button";
import TypographyComponent from "../../../Components/Typography/Typography";
import { search } from "../../../Services/Auth.service";
import moment from "moment";

let limit = 10;
const path = "/service/bookings/list";

const useStyles = makeStyles((theme) => ({

  root: {
    width: "100%",
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },

  next_booking_wrapper : {
    maxHeight: '230px',
    overflow: 'auto',
    marginTop: '24px',
    marginBottom: '24px',
    direction: 'rtl',
  },
  
  next_booking_item : {
    display: 'flex',
    alignItems: 'center',
    direction: 'ltr',

    '& + $next_booking_item' : {
      marginTop: '25px'
    },
  

    '& button' : {
      fontSize: '12px',
      lineHeight: '18px',
      letterSpacing: '0.02em',
      fontWeight: 'normal',
      color: '#FFFFFF',
      textTransform: 'inherit',
      height: '25px',
      maxWidth: '112px',
      width:'100%',
      borderRadius: '5px',
      margin: '0 13px 0 0',
    },

    '& p' : {
      fontFamily: 'Rubik',
      lineHeight: '30px',
      letterSpacing: '0.02em',
      color: '#303030',
      minWidth: '85px',
      textAlign: 'center',
      margin: '0 3px',

      '&:last-of-type' : {
        textAlign: 'left',
        maxWidth: '60%',
        width: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },
    },

    '& svg' : {
      marginLeft: 'auto',
    }, 
  },
}));

const NextBooking = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = props;
  const [records, setRecords] = useState([]);
  // const [records, setRecords] = useState([
  //   {
  //     to_time: "05 October 2011 14:48",
  //     from_time: "05 October 2011 14:48",
  //     title: "Create app",
  //   },
  //   {
  //     to_time: "05 October 2011 14:48",
  //     from_time: "05 October 2011 14:48",
  //     title: "Create app",
  //   },
  //   {
  //     to_time: "05 October 2011 14:48",
  //     from_time: "05 October 2011 14:48",
  //     title: "Create app",
  //   },
  // ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpcomingMoreData, setUpcomingMoreData] = useState(true);
  const [isUpcomingLoading, setUpcomingLoading] = useState(false);
  const [upcomingoffset, setUpcomingOffset] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event, record) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    function fetchNextBooking() {
      const params = {
        limit: limit,
        offset: 0,
        role: "CLIENT",
        id_user: user.id_user,
        status: "NEXT",
      };
      setIsLoading(true);
      search(path, params)
        .then((res) => {
          const { data, stopped_at, type } = res || {};
          if (type === "ERROR" || (data && data.length === 0)) {
            setIsLoading(false);
            setUpcomingMoreData(false);
            return;
          }
          setUpcomingOffset(stopped_at);
          setRecords(res.data || []);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
    fetchNextBooking();
  }, [user.id_user]);

  const onMore = async (path, offset, criteria = {}) => {
    setUpcomingLoading(true);
    let res = await search(path, {
      limit: limit,
      offset: offset,
      ...criteria,
    });
    if (res) {
      const { data, stopped_at, type } = res || {};
      if (type === "ERROR" || data.length === 0) {
        setUpcomingMoreData(false);
        return;
      }
      setUpcomingOffset(stopped_at);
      setRecords((services) => [...(services || []), ...(data || [])]);
      setUpcomingLoading(false);
    }
  };

  const goToMeeting = (element) => {
    const { history } = props;
    history.push("/call-page", {
      booking_id: "79615AEGHJ",
    });
  };

  return (
    <React.Fragment>
      <TypographyComponent
        title={t("home.nextBooking.title")}
        variant="h2"
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
      <div className={classes.next_booking_wrapper} >
        {isLoading ? (
          <Spinner />
        ) : records && !records.length ? (
          <span className="no_records_found">{t("home.nextBooking.notFoundRecord")}</span>
        ) : (
          records.map((r, index) => (
              
              <div className={classes.next_booking_item} key={index}>
                <ButtonComponent
                  title="Go to meeting"
                  onClick={() => goToMeeting()}
                />
                <TypographyComponent title="11/03/2020" />
                <TypographyComponent
                  title={moment(r.from_time).format("HH:mm")}
                />
                <TypographyComponent title={moment(r.to_time).format("HH:mm")} />
                <TypographyComponent title={r.title} />
                <MoreVertIcon
                  aria-describedby={id}
                  variant="contained"
                  color="primary"
                  onClick={(event) => handleClick(event, r)}
                  style={{ cursor: "pointer" }}
                />
              </div>

            // </div>
          ))
        )}
      </div>
      
      {isUpcomingMoreData && records && records.length > 0 && (
        <div>
          {isUpcomingLoading ? (
            <Spinner />
          ) : (
            <div
              className="load-more"
              onClick={() => onMore(path, upcomingoffset, {})}
            ></div>
          )}
        </div>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Divider
            style={{
              border: "0.5px solid #9E9E9E",
            }}
          />
        </Grid>
      </Grid>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className='more_info_popover'
      >
        <CloseIcon onClick={handleClose} className="more_info_popover_close" />
        <TypographyComponent
          title="Cancel Booking"
        />
      </Popover>
    </React.Fragment>
  );
};

export default withRouter(NextBooking);
