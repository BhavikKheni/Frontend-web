import React, { useState, useEffect } from "react";
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

const NextBooking = (props) => {
  const { t } = useTranslation();
  const { user } = props;
  const [records, setRecords] = useState([]);
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

  const goToMeeting = () => {
    const { history } = props;
    history.push("/work");
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TypographyComponent
            title={t("home.nextBooking.title")}
            variant="h3"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Divider
            style={{
              border: "0.5px solid #9E9E9E",
            }}
          />
        </Grid>
      </Grid>
      {isLoading ? (
        <Spinner />
      ) : records && !records.length ? (
        <span>{t("home.nextBooking.notFoundRecord")}</span>
      ) : (
        records.map((r, index) => (
          <Grid container spacing={3} key={index}>
            <Grid item xs={12} md={3}>
              <ButtonComponent
                title="Go to meeting"
                onClick={() => goToMeeting()}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <TypographyComponent title="11/03/2020" />
            </Grid>
            <Grid item xs={12} md={1}>
              <TypographyComponent
                title={moment(r.from_time).format("HH:mm")}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <TypographyComponent title={moment(r.to_time).format("HH:mm")} />
            </Grid>
            <Grid item xs={12} md={1}>
              <TypographyComponent title={r.title} />
            </Grid>
            <Grid item xs={12} md={3}>
              <MoreVertIcon
                aria-describedby={id}
                variant="contained"
                color="primary"
                onClick={(event) => handleClick(event, r)}
                style={{ cursor: "pointer" }}
              />
            </Grid>
          </Grid>
        ))
      )}
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
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <CloseIcon onClick={handleClose} />
        <div>
          <TypographyComponent
            title="Cancel Booking"
            style={{ cursor: "pointer" }}
          />
        </div>
      </Popover>
    </React.Fragment>
  );
};

export default withRouter(NextBooking);
