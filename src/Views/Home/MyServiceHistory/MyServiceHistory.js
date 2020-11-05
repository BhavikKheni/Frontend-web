import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { search } from "../../../Services/Auth.service";
import Spinner from "../../../Components/Spinner/Spinner";
import TypographyComponent from "../../../Components/Typography/Typography";
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
  details: {
    flexDirection: "column",
  },
}));

const MyServiceHistory = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { user } = props;
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpcomingMoreData, setUpcomingMoreData] = useState(true);
  const [isUpcomingLoading, setUpcomingLoading] = useState(false);
  const [upcomingoffset, setUpcomingOffset] = useState(0);

  const fetchNextBooking = useCallback(async () => {
    const params = {
      limit: limit,
      offset: 0,
      id_user: user.id_user,
      status: "FINISHED",
      role: "CLIENT",
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
  }, [user.id_user]);

  useEffect(() => {
    fetchNextBooking();
  }, [fetchNextBooking]);

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

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TypographyComponent
            title={t("home.serviceHistory.title")}
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
        <span>{t("home.serviceHistory.notFoundRecord")}</span>
      ) : (
        records.map((record, index) => (
          <Grid container spacing={3} key={index}>
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <span></span>
                <span>{moment(record.from_time).format("HH:mm")}</span>
                <span>{moment(record.to_time).format("HH:mm")}</span>
                <span>{record.title}</span>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <div>
                  <TypographyComponent title="Provider name" />
                </div>
                <div>
                  <TypographyComponent title={record.provider_name} />
                </div>
                <div>
                  <TypographyComponent title="Total price" />
                  <TypographyComponent title={`${record.price}/£`} />
                  <div>
                    <TypographyComponent title="Status" />
                    <TypographyComponent title={record.status} />
                  </div>
                </div>
                <div>
                  <TypographyComponent title="Transaction id" />
                  <TypographyComponent title="ipi_1HSRfRCYjANOKpKjodn7KML5" />
                </div>
                <div>
                  <TypographyComponent title="Order id" />
                  <TypographyComponent title="ipi_1HSRfRCYjANOKpKjodn7KML5" />
                </div>
              </AccordionDetails>
            </Accordion>
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
    </React.Fragment>
  );
};

export default MyServiceHistory;
