import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import { Formik } from "formik";
import MuiFormControl from "@material-ui/core/FormControl";
import Hidden from "@material-ui/core/Hidden";
import TypographyComponent from "../../Components/Typography/Typography";
import SelectComponent from "../../Components/Forms/Select";
import ButtonComponent from "../../Components/Forms/Button";
import InputComponent from "../../Components/Forms/Input";
import SnackbarComponent from "../../Components/SnackBar/SnackBar";
import { themes } from "../../themes";
import { SessionContext } from "../../Provider/Provider";
import { get } from "../../Services/Auth.service";
import Service from "../../Services/index";
import * as Yup from "yup";
import { useSidebar } from "../../Provider/SidebarProvider";
import "./CreateSerive.css";
const service = new Service();
const useSession = () => React.useContext(SessionContext);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));
const useStyles1 = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
const FormControl = withStyles((theme) => ({
  root: {
    width: "100%",
  },
}))(MuiFormControl);

const CreateService = (props) => {
  const classes = useStyles();
  const classes1 = useStyles1();
  let { user } = useSession();
  const [open, setOpen] = React.useState(false);
  const [setRes, setTypeRes] = React.useState("");
  const { job = {} } = props;
  const [category, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const { setSidebarContent, setSidebar } = useSidebar();

  useEffect(() => {
    setSidebar(false);
    setSidebarContent(<div></div>);
  }, [setSidebarContent, setSidebar]);

  useEffect(() => {
    async function fetchCategory() {
      const res = await get("/categories/listcategories");
      if (res) {
        setCategories(res);
        if (job.id_job) {
          const sub = res.filter((f) => f.id === job.category);
          if (sub[0]) {
            setSubCategories(sub[0].sub_categories);
          }
        }
      }
    }
    fetchCategory();
  }, [job.id_job]);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (record) => {
    let formData = new FormData();
    if (record.image_1 instanceof File) {
      formData.append("image_1", record.image_1);
    }
    if (record.image_2 instanceof File) {
      formData.append("image_2", record.image_2);
    }
    if (record.image_3 instanceof File) {
      formData.append("image_3", record.image_3);
    }
    if (record.image_4 instanceof File) {
      formData.append("image_4", record.image_4);
    }
    formData.append("id_user", user.id_user);
    formData.append("title", record.title);
    formData.append("category", record.category);
    formData.append("subcategory", record.subcategory);
    formData.append("description", record.description);
    formData.append("price", record.price);

    const res = await service.upload("/job/add", formData);
    if (res.status === 200) {
      setTypeRes(res);
      setOpen(true);
      const { history } = props;
      history.push("/jobs/active-service");
    } else {
      setOpen(true);
      setTypeRes(res);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div>
        <Grid
          container
          spacing={3}
          alignItems="center"
          style={{ marginTop: 20 }}
        >
          <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
            <TypographyComponent
              title="Create a service"
              variant="h3"
              style={{
                color: themes.default.colors.darkGray,
              }}
            />
          </Grid>
        </Grid>
        <Formik
          initialValues={{
            image_1: null,
            image_2: null,
            image_3: null,
            image_4: null,
            skills: "",
            category: "",
            subcategory: "",
            title: "",
            languages: [],
            price: "",
            description: "",
          }}
          onSubmit={async (values) => onSubmit(values)}
          validationSchema={Yup.object().shape({
            title: Yup.string().required("Title is required"),
            category: Yup.string().required("Category is required"),
            subcategory: Yup.string().required("Sub-Category is required"),
          })}
        >
          {({
            values,
            errors,
            setFieldValue,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={handleSubmit}
              noValidate
              autoComplete="off"
              style={{ marginTop: 20 }}
            >
              <TypographyComponent
                title="Name and allocation"
                variant="h2"
                style={{
                  color: themes.default.colors.darkGray,
                  fontWeight: 500,
                  marginBottom: 10,
                }}
              />
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                      <FormControl>
                        <InputComponent
                          label="Sevice name"
                          type="text"
                          placeholder="Service name"
                          name="title"
                          autoFocus
                          value={values.title}
                          onChange={handleChange}
                          error={errors.title ? true : false}
                          helperText={errors.title && `${errors.title}`}
                          styles={{ maxHeight: 80, height: "100%" }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Hidden smDown>
                  <Grid item md={1}></Grid>
                </Hidden>
                <Grid item xs={12} md={5}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                      <FormControl
                        variant="outlined"
                        className={classes1.formControl}
                        error={errors.category ? true : false}
                      >
                        <SelectComponent
                          name="category"
                          label="Category"
                          value={values.category}
                          onChange={(e) => {
                            setFieldValue("category", e.target.value);
                            const sub =
                              category &&
                              category.filter(
                                (f) => Number(f.id) === e.target.value
                              );
                            setSubCategories(sub[0].sub_categories);

                            setFieldValue(
                              "subcategory",
                              sub[0].sub_categories[0].id_category
                            );
                          }}
                          error={errors.category ? true : false}
                        >
                          {category &&
                            category.map((m, i) => (
                              <MenuItem
                                key={Number(m.id)}
                                value={Number(m.id)}
                                className={classes.formControl}
                              >
                                {m.name}
                              </MenuItem>
                            ))}
                        </SelectComponent>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                        error={errors.subcategory ? true : false}
                      >
                        <SelectComponent
                          name="subcategory"
                          label="Sub-Category"
                          value={values.subcategory}
                          onChange={handleChange}
                        >
                          {subCategories &&
                            subCategories.map((m, i) => (
                              <MenuItem
                                key={Number(m.id_category)}
                                value={Number(m.id_category)}
                              >
                                {m.category_name}
                              </MenuItem>
                            ))}
                        </SelectComponent>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Hidden smDown>
                  <Grid item md={1}></Grid>
                </Hidden>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={11}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                      <FormControl>
                        <TypographyComponent
                          variant="h2"
                          title="Description"
                          style={{
                            color: themes.default.colors.darkGray,
                            fontWeight: "500",
                          }}
                        />
                        <InputComponent
                          type="text"
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                          multiline
                          rows={10}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Hidden smDown>
                  <Grid item md={1}></Grid>
                </Hidden>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={11}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                      <FormControl>
                        <TypographyComponent
                          variant="h2"
                          title="Price setting"
                          style={{
                            color: themes.default.colors.darkGray,
                            fontWeight: 500,
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Hidden smDown>
                  <Grid item md={1}></Grid>
                </Hidden>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <div className="service-rate-item">
                    <TypographyComponent
                      variant="h2"
                      title="My hourly price"
                      style={{
                        color: themes.default.colors.darkGray,
                      }}
                    />
                    <InputComponent
                      name="price"
                      value={values.price}
                      onChange={handleChange}
                      styles={{ maxHeight: 38, height: "100%", maxWidth: 91 }}
                      className="service-price"
                    />
                  </div>
                  <div className="service-rate-item mt">
                    <TypographyComponent
                      variant="h2"
                      title="Total price"
                      style={{
                        color: themes.default.colors.darkGray,
                      }}
                    />
                    <TypographyComponent
                      variant="h2"
                      title="00.00£"
                      style={{
                        color: themes.default.colors.darkGray,
                      }}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={5}>
                  <div className="service-rate-item">
                    <TypographyComponent
                      variant="h2"
                      title="Payment service provider"
                      style={{
                        color: themes.default.colors.darkGray,
                      }}
                    />
                    <TypographyComponent
                      variant="h2"
                      title="00.0%"
                      style={{
                        color: themes.default.colors.gray,
                      }}
                    />
                  </div>
                  <div className="service-rate-item cost">
                    <TypographyComponent
                      variant="h2"
                      title="Owera organisation costs"
                      style={{
                        color: themes.default.colors.darkGray,
                      }}
                    />
                    <TypographyComponent
                      variant="h2"
                      title="00.0%"
                      style={{
                        color: themes.default.colors.gray,
                      }}
                    />
                  </div>
                </Grid>
                <Hidden smDown>
                  <Grid item md={1}></Grid>
                </Hidden>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={11}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                      <FormControl>
                        <TypographyComponent
                          variant="h2"
                          title="Pictures"
                          style={{
                            color: themes.default.colors.darkGray,
                            fontWeight: "bold",
                          }}
                        />
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Hidden smDown>
                  <Grid item md={1}></Grid>
                </Hidden>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={11}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                      <FormControl>
                        <div>
                          <ButtonComponent
                            title="Delete service"
                            onClick={() => {}}
                            variant="outlined"
                            style={{
                              backgroundColor: "#fff",
                              border: "1px solid #FF0000",
                              color: "#FF0000",
                            }}
                          />
                          <ButtonComponent
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isSubmitting}
                            title="Save changes"
                          />
                        </div>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Hidden smDown>
                  <Grid item md={1}></Grid>
                </Hidden>
              </Grid>
            </form>
          )}
        </Formik>
      </div>

      <SnackbarComponent
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={setRes.message}
        type={setRes.type && setRes.type.toLowerCase()}
      ></SnackbarComponent>
    </div>
  );
};

export default CreateService;
