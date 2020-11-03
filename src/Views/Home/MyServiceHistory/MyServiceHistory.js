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
      status: ["NEXT"],
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
        records.map((r, index) => (
          <Grid container spacing={3} key={index}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <TypographyComponent className={classes.heading}>
                  Accordion 1
                </TypographyComponent>
              </AccordionSummary>
              <AccordionDetails>
                <TypographyComponent>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </TypographyComponent>
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
