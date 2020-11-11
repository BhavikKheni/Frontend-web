import React, { useState, useEffect, useCallback } from "react";
import downArrowImage from '../../../images/select_arrow.svg';
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
import TooltipComponent from '../../../Components/Tooltip/Tooltip'
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

  previous_service_wrapper: {
    maxHeight: '457px',
    overflow: 'auto',
    overflowX: 'hidden',
    margin: '15px 0',
    direction: 'rtl',
  },

  previous_service : {
    marginTop: '10px',
    direction: 'ltr',

    '& previous_service_title': {
      display: 'flex',
      flexDirection: 'row-reverse',
      padding: '0',
    },
  },

  previous_service_title: {
    display: 'flex',
    flexFlow: 'row-reverse',
    padding: '0',
    minHeight: 'inherit',

    '&.Mui-expanded' : {
      minHeight : 'inherit'
    },

    '& .MuiAccordionSummary-content' : {
      margin: '0',
    },

    '& .MuiIconButton-root' : {
      padding: '0px 20px',

      '& .MuiIconButton-label': {
        backgroundImage: `url('${downArrowImage}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        width: '20px',
        height: '10px',    

        '& svg' : {
          display: 'none',
        },
      },
    },

    '& p' : {
      fontFamily: 'Rubik',
      fontSize: '13px',
      lineHeight: '24px',
      letterSpacing: '-0.015em',
      color: '#303030',
      minWidth: '90px',
      textAlign: 'center',
      margin: '0 5px',
    },

    '& .Mui-expanded' : {
      '& p': {
        fontSize: '14px',
        fontWeight: '500',
      }
    }
  },

  previous_service_content: {
    display: 'flex',
    alignItems: 'flex-start', 
    paddingLeft: '65px',

    '& p' : {
      fontFamily: 'Rubik',
      fontSize: '12px',
      lineHeight: '24px',
      letterSpacing: '0.02em',
      color: '#303030',
    }
  },

  previous_service_info_title : {
    maxWidth: '280px',
    width: '100%',
  },

  previous_service_info_value : {
    '& p' : {
      fontWeight: '500',
    }
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
      <TypographyComponent
        title={t("home.serviceHistory.title")}
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
      <div className={classes.previous_service_wrapper}>
        {isLoading ? (
          <Spinner />
        ) : records && !records.length ? (
          <span className="no_records_found">{t("home.serviceHistory.notFoundRecord")}</span>
        ) : (
          records.map((record, index) => (
            <div className={classes.previous_service} key={index}>
              <Accordion 
                key={index}
                style={{
                  boxShadow:"none"
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className={classes.previous_service_title}
                >
                  <p>00/00/2020</p>
                  <p>{moment(record.from_time).format("HH:mm")}</p>
                  <p>{moment(record.to_time).format("HH:mm")}</p>
                  <TooltipComponent title={record.title} placement="bottom">
                  <p>{record.title}</p>
                  </TooltipComponent>
                </AccordionSummary>
                <AccordionDetails className={classes.previous_service_content}>
                  <div className={classes.previous_service_info_title}>
                    <TypographyComponent title="Provider name" />
                    <TypographyComponent title="Total price" />
                    <TypographyComponent title="Status" />
                    <TypographyComponent title="Transaction id" />
                    <TypographyComponent title="Order id" />
                  </div>
                  <div className={classes.previous_service_info_value}>
                    <TypographyComponent title={record.provider_name} />
                    <TypographyComponent title={`${record.price}/£`} />
                    <TypographyComponent title={record.status} />
                    <TypographyComponent title="ipi_1HSRfRCYjANOKpKjodn7KML5" />
                    <TypographyComponent title="ipi_1HSRfRCYjANOKpKjodn7KML5" />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
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
              style={{
                marginBottom: "15px",
              }}
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
