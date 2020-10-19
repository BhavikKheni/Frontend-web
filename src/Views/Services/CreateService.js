import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import MuiFormControl from "@material-ui/core/FormControl";
import Hidden from "@material-ui/core/Hidden";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import TypographyComponent from "../../Components/Typography/Typography";
import SelectComponent from "../../Components/Forms/Select";
import ButtonComponent from "../../Components/Forms/Button";
import InputComponent from "../../Components/Forms/Input";
import SnackbarComponent from "../../Components/SnackBar/SnackBar";
import { themes } from "../../themes";
import { SessionContext } from "../../Provider/Provider";
import { get } from "../../Services/Auth.service";
import Service from "../../Services/index";
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
  content: {
    padding: theme.spacing(2),
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
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
    },
  },
}))(MuiFormControl);

const CreateService = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const classes1 = useStyles1();
  let { user } = useSession();
  const [open, setOpen] = React.useState(false);
  const [setRes, setTypeRes] = React.useState("");
  const { job = {} } =
    props.location && props.location.state ? props.location.state : {};
  const [category, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const { setSidebarContent, setSidebar } = useSidebar();
  const [fileList, setFileList] = useState([]);
  const [isImageSize, isSetImageSize] = useState(false);
  let [copyRecord, setCopyRecord] = useState();
  const [isJobLoading, setIsJobLoading] = useState(false);

  useEffect(() => {
    setSidebar(true);
    setSidebarContent(
      <div style={{ margin: 20 }}>
        <MenuItem>{t("service.create-service.startWork")}</MenuItem>
        <MenuItem>{t("service.create-service.myServiceLibrary")}</MenuItem>
        <MenuItem>{t("service.create-service.addBookingSpace")}</MenuItem>
        <MenuItem>{t("service.create-service.createSpace")}</MenuItem>
      </div>
    );
  }, [setSidebarContent, setSidebar, t]);
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
    async function getJob() {
      if (!job.id_job) return;
      setIsJobLoading(true);
      const response = await get(`/job/${job.token}`);
      setIsJobLoading(false);
      if (response) {
        const newRecord = {
          id_job: response.id_job,
          category: response.category,
          subcategory: response.subcategory,
          price: response.price,
          title: response.title,
          description: response.description,
          image_1: response.image_1,
          image_2: response.image_2,
          image_3: response.image_3,
          image_4: response.image_4,
        };
        setCopyRecord({ ...newRecord });
        formik.setFieldValue("category", response.category);
        formik.setFieldValue("subcategory", response.subcategory);
        formik.setFieldValue("price", response.price);
        formik.setFieldValue("title", response.title);
        formik.setFieldValue("description", response.description);
        // formik.setFieldValue('image_1',response.image_1)
        // formik.setFieldValue('image_2',response.image_2)
        // formik.setFieldValue('image_3',response.image_3)
        // formik.setFieldValue('image_4',response.image_4)
      }
    }
    fetchCategory();
    getJob();
  }, [job.id_job]);

  function isEquivalent(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  }
  const onSave = async (record) => {
    if (record.id_job) {
      if (record) {
        const isEdit = isEquivalent(copyRecord, record);
        if (!isEdit) {
          let updateRecord = Object.keys(record).reduce((diff, key) => {
            if (record[key] === copyRecord[key]) return diff;
            return {
              ...diff,
              [key]: record[key],
            };
          }, {});
          let formData = new FormData();
          if (updateRecord.image_1 instanceof File) {
            formData.append("image_1", updateRecord.image_1);
          }
          if (updateRecord.image_2 instanceof File) {
            formData.append("image_2", updateRecord.image_2);
          }
          if (updateRecord.image_3 instanceof File) {
            formData.append("image_3", updateRecord.image_3);
          }
          if (updateRecord.image_4 instanceof File) {
            formData.append("image_4", updateRecord.image_4);
          }
          if (updateRecord.title) {
            formData.append("title", updateRecord.title);
          }
          if (updateRecord.category) {
            formData.append("category", updateRecord.category);
          }
          if (updateRecord.subcategory) {
            formData.append("subcategory", updateRecord.subcategory);
          }
          if (updateRecord.description) {
            formData.append("description", updateRecord.description);
          }
          if (updateRecord.price) {
            formData.append("price", updateRecord.price);
          }

          formData.append("id_job", record.id_job);
          formData.append("id_user", user.id_user);
          const res = await service.upload("/job/update", formData);
          if (res.status === 200) {
            props.onCancel();
          } else {
          }
        }
      }
    } else {
      if (record) {
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
          const { history } = props;
          history.push("/");
        } else {
        }
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      image_1: null,
      image_2: null,
      image_3: null,
      image_4: null,
      title: "",
      category: "",
      subcategory: "",
      price: "",
      description: "",
    },
    onSubmit: (values) => {
      onSave(values);
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required(t("validation.serviceTitle")),
      category: Yup.string().required(t("validation.Category")),
      subcategory: Yup.string().required(t("validation.SubCategory")),
    }),
  });
  const handleUploadClick = (event, setFieldValue) => {
    if (event.target.files[0]) {
      var FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 2) {
        isSetImageSize(true);
      } else {
        setFileList([...fileList, event.target.files[0]]);
        isSetImageSize(false);
      }
    }
  };
  return (
    <div className={classes.content}>
      {isJobLoading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <React.Fragment>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
              <TypographyComponent
                title={t("service.create-service.createService")}
                variant="h3"
                style={{
                  color: themes.default.colors.darkGray,
                }}
              />
            </Grid>
          </Grid>
          <form onSubmit={formik.handleSubmit}>
            <TypographyComponent
              title={t("service.create-service.nameAllocation")}
              variant="h2"
              style={{
                color: themes.default.colors.darkGray,
                fontWeight: 500,
                marginBottom: 10,
                marginTop: 20,
              }}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} xl={4}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <FormControl>
                      <InputComponent
                        label="Sevice name"
                        type="text"
                        placeholder="Service name"
                        name="title"
                        autoFocus
                        onChange={formik.handleChange}
                        value={formik.values.title}
                        error={formik.errors.title ? true : false}
                        helperText={
                          formik.errors.title && `${formik.errors.title}`
                        }
                        styles={{ maxHeight: 80, height: "100%" }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <FormControl>
                      <TypographyComponent
                        wrap="nowrap"
                        variant="h2"
                        title="Describe the service of your dream as specific and simple you can so others can find you easily."
                        style={{
                          color: themes.default.colors.gray,
                          fontStyle: "italic",
                          fontWeight: 300,
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Hidden smDown>
                <Grid item md={1} xl={1}></Grid>
              </Hidden>
              <Grid item xs={12} md={4} xl={4}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={9}>
                    <FormControl
                      variant="outlined"
                      className={classes1.formControl}
                      error={formik.errors.category ? true : false}
                    >
                      <SelectComponent
                        name="category"
                        label="Category"
                        value={formik.values.category}
                        onChange={(e) => {
                          formik.setFieldValue("category", e.target.value);
                          const sub =
                            category &&
                            category.filter(
                              (f) => Number(f.id) === e.target.value
                            );
                          setSubCategories(sub[0].sub_categories);

                          formik.setFieldValue(
                            "subcategory",
                            sub[0].sub_categories[0].id_category
                          );
                        }}
                        error={formik.errors.category ? true : false}
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

                  <Grid item xs={12} md={9}>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      error={formik.errors.subcategory ? true : false}
                    >
                      <SelectComponent
                        name="subcategory"
                        label="Sub-Category"
                        value={formik.values.subcategory}
                        onChange={formik.handleChange}
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
                <Grid item md={3} xl={3}></Grid>
              </Hidden>
            </Grid>
            <Grid container spacing={6}>
              <Grid item xs={12} md={8} xl={8}>
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
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    multiline
                    rows={10}
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    placeholder="Please briefly describe your service...
                    In which situation can i use this service?
                    What can I expect from this service?
                    What are the key information?"
                  />
                </FormControl>
              </Grid>
              <Hidden smDown>
                <Grid item md={3} xl={3}></Grid>
              </Hidden>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} xl={9}>
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
                <Grid item md={3} xl={3}></Grid>
              </Hidden>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4} xl={4}>
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
                    value={formik.values.price}
                    onChange={formik.handleChange}
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
              <Grid item xs={12} md={4} xl={4}>
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
                <Grid item md={3} xl={3}></Grid>
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
                      <Grid
                        container
                        spacing={3}
                        style={{
                          marginTop: 10,
                        }}
                      >
                        {fileList &&
                          fileList.map((file, i) => (
                            <Grid item xs={12} md={3} key={i}>
                              <div className="image-item">
                                <img
                                  alt="Profile"
                                  src={URL.createObjectURL(file)}
                                  className="image"
                                />
                                <div
                                  className="image-delete"
                                  onClick={() => {
                                    fileList.splice(i, 1);
                                    setFileList([...fileList]);
                                  }}
                                >
                                  <div>
                                    <label>Delete picture</label>
                                  </div>
                                  <div>
                                    <DeleteIcon />
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          ))}
                        {fileList.length >= 4 ? null : (
                          <Grid item xs={12} md={3}>
                            <div className="image-item">
                              <input
                                type="file"
                                name={`image_${fileList.length + 1}`}
                                id={`image_${fileList.length + 1}`}
                                style={{ display: "none" }}
                                onChange={(event) =>
                                  handleUploadClick(event, formik.setFieldValue)
                                }
                              />
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  color: "#fff",
                                  padding: "20px",
                                }}
                                onClick={() => {
                                  document
                                    .getElementById(
                                      `image_${fileList.length + 1}`
                                    )
                                    .click();
                                }}
                              >
                                <label htmlFor="file">Upload image</label>
                                <AddIcon />
                              </div>
                            </div>
                          </Grid>
                        )}
                      </Grid>
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
                          disabled={formik.isSubmitting}
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
        </React.Fragment>
      )}
    </div>
  );
};
export default CreateService;
