import React from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import AddIcon from "@material-ui/icons/Add";
import TypographyComponent from "../../../Components/Typography/Typography";
const PaymentMethod = (props) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TypographyComponent
            title={t("home.paymentMethod.title")}
            variant="h3"
          />
        </Grid>
      </Grid>

      <Card>
        <CardHeader title="Visa" />
        <CardContent>
          <div>
            <TypographyComponent title="Name of card" />
            <TypographyComponent title="Expired on" />
          </div>
          <div>
            <TypographyComponent title="xxxx xxxx xxxx 9843" />
            <TypographyComponent title="00/00" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div>
            <AddIcon />
          </div>
          <div>
            <TypographyComponent title="Add payment method" />
          </div>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default PaymentMethod;
