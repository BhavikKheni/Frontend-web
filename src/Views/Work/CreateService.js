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
import SnackBarComponent from "../../Components/SnackBar/SnackBar";
import { themes } from "../../themes";
import { SessionContext } from "../../Provider/Provider";
import { get } from "../../Services/Auth.service";
import Service from "../../Services/index";
import { useSidebar } from "../../Provider/SidebarProvider";

import "./CreateSerive.css";
const newService = new Service();
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
  const { service = {} } =
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

  const { editRecord } = props;

  useEffect(() => {
    async function fetchCategory() {
      const res = await get("/categories/listcategories");
      if (res) {
        setCategories(res);
        if (service.id_service) {
          const sub = res.filter((f) => f.id === service.category);
          if (sub[0]) {
            setSubCategories(sub[0].sub_categories);
          }
        }
      }
    }
    fetchCategory();
  }, [service.id_service]);

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

  function makeImage(arr, formData, record) {
    arr.forEach((imageObj, index) => {
      formData.append("image_" + [index + 1], imageObj);
    });
    return formData;
  }

  const onSave = async (record, setSubmitting) => {
    let formData = new FormData();

    if (record.id_service) {
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
          formData.append("id_service", record.id_service);
          formData.append("id_user", user.id_user);
          const res = await newService.upload("/service/update", formData);
          if (res.status === 200) {
          } else {
          }
        }
      }
    } else {
      if (record) {
        formData = makeImage(fileList, formData, record);
        formData.append("id_user", user.id_user);
        formData.append("title", record.title);
        formData.append("category", record.category);
        formData.append("subcategory", record.subcategory);
        formData.append("description", record.description);
        formData.append("price", record.price);
        console.log("save..", formData);
        const res = await newService.upload("/service/add", formData);
        if (res.status === 200) {
          setTypeRes(res);
          setOpen(true);
        } else {
          setTypeRes(res);
          setSubmitting(false);
          setOpen(true);
        }
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
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
    onSubmit: (values, { setSubmitting }) => {
      onSave(values, setSubmitting);
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required(t("validation.serviceTitle")),
      category: Yup.string().required(t("validation.Category")),
      subcategory: Yup.string().required(t("validation.SubCategory")),
    }),
  });

  useEffect(() => {
    if (editRecord.id_service) {
      console.log(editRecord)
      const newRecord = {
        id_service: editRecord.id_service,
        category: editRecord.category,
        subcategory: editRecord.subcategory,
        price: editRecord.price,
        title: editRecord.title,
        description: editRecord.description,
        image_1: editRecord.image_1,
        image_2: editRecord.image_2,
        image_3: editRecord.image_3,
        image_4: editRecord.image_4,
      };

      setCopyRecord({ ...newRecord });
      formik.setFieldValue("id_service", editRecord.id_service);
      formik.setFieldValue("category", editRecord.category);
      formik.setFieldValue("price", editRecord.price);

      const sub =
        category &&
        category.filter((f) => Number(f.id) === Number(editRecord.category));
      setSubCategories(sub[0].sub_categories);
      formik.setFieldValue("subcategory", sub[0].sub_categories[0].id_category);
      formik.setFieldValue("title", editRecord.title);
      formik.setFieldValue("description", editRecord.description);
      setFileList([...editRecord.images]);
      var elmnt = document.getElementsByClassName("create-service");
      if (elmnt[0]) {
        elmnt[0].scrollIntoView();
      }
    }
  }, [editRecord]);

  const handleUploadClick = (event) => {
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

  const makeImageUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    } else {
      return file.image;
    }
  };

  return (
    <section className="create-service">
      <div className={classes.content}>
        {isJobLoading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        ) : (
          <React.Fragment>
            <Grid container spacing={3}>
              <Grid item xs={12} md={10}>
                <TypographyComponent
                  title={t("service.create-service.createService")}
                  variant="h3"
                  style={{
                    color: themes.default.colors.darkGray,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={10}>
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
              </Grid>
            </Grid>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={10}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                          <FormControl
                            variant="outlined"
                            className={classes1.formControl}
                            error={formik.errors.title ? true : false}
                          >
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
                        <Grid item xs={12} md={12}>
                          <TypographyComponent title="Describe the service of your dream as specific and simple you can so others can find you easily." />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Hidden smDown>
                      <Grid item xs={12} md={1}></Grid>
                    </Hidden>
                    <Grid item xs={12} md={5}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
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
                                formik.setFieldValue(
                                  "category",
                                  e.target.value
                                );
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
                        <Grid item xs={12} md={12}>
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
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={10}>
                  <TypographyComponent
                    variant="h2"
                    title="Description"
                    style={{
                      color: themes.default.colors.darkGray,
                      fontWeight: "500",
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={10}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={11}>
                      <InputComponent
                        type="text"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        multiline
                        rows={10}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder="Please briefly describe your service...
                In which situation can i use this service?
                What can I expect from this service?
                What are the key information?"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={10}>
                  <TypographyComponent
                    variant="h2"
                    title="Price setting"
                    style={{
                      color: themes.default.colors.darkGray,
                      fontWeight: 500,
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={10}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
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
                          styles={{
                            maxHeight: 38,
                            height: "100%",
                            maxWidth: 91,
                          }}
                          className="service-price"
                        />
                      </div>
                    </Grid>
                    <Hidden smDown>
                      <Grid item xs={12} md={1}></Grid>
                    </Hidden>
                    <Grid item xs={12} md={5}>
                      <TypographyComponent title="Uppon your price will be sett the conditions of a payment service provider and the comission of Owera. All employees of Owera thank you for using our service and enabling our workplaces. Enjoy this winn winn situation because this is our philosophy to achiefe." />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={10}>
                  <TypographyComponent
                    variant="h2"
                    title="Pictures"
                    style={{
                      color: themes.default.colors.darkGray,
                      fontWeight: "bold",
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={10}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={11}>
                      <Grid container spacing={3}>
                        {fileList &&
                          fileList.map((file, i) => (
                            <Grid item xs={12} md={3} key={i}>
                              <div className="image-item">
                                <img
                                  alt="Profile"
                                  src={file && makeImageUrl(file)}
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
                                onChange={(event) => handleUploadClick(event)}
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
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={10}>
                  {formik.values.id_service && (
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
                  )}
                  <ButtonComponent
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={formik.isSubmitting}
                    title={
                      formik.values.id_service
                        ? "Save changes"
                        : "Create service"
                    }
                  />
                </Grid>
              </Grid>
            </form>
          </React.Fragment>
        )}
        <SnackBarComponent
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          message={setRes.message}
          type={setRes.type && setRes.type.toLowerCase()}
        />
      </div>
    </section>
  );
};
export default CreateService;
