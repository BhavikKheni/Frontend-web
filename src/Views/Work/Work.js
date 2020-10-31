import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { Grid, Divider } from "@material-ui/core";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import TypographyComponent from "../../Components/Typography/Typography";
import ButtonComponent from "../../Components/Forms/Button";
import StartWork from "./StartWork";
import AddBookinSpace from "./AddBookingSpace";
import { search } from "../../Services/Auth.service";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MuiFormControl from "@material-ui/core/FormControl";
import Hidden from "@material-ui/core/Hidden";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import SelectComponent from "../../Components/Forms/Select";
import InputComponent from "../../Components/Forms/Input";
import SnackBarComponent from "../../Components/SnackBar/SnackBar";
import { themes } from "../../themes";
import Spinner from "../../Components/Spinner/Spinner";
import { SessionContext } from "../../Provider/Provider";
import { get, add } from "../../Services/Auth.service";
import Service from "../../Services/index";
import { useSidebar } from "../../Provider/SidebarProvider";
import SignIn from "../Auth/SignIn/SignIn";
import SignUp from "../Auth/SignUp/SignUp";
import ForgotPassword from "../Auth/ForgotPassword/ForgotPassword";
import { onIsLoggedIn } from "../../Services/Auth.service";
import "./StartWork.css";
import WorkSidebar from "./WorkSidebar";
const newService = new Service();
const useSession = () => React.useContext(SessionContext);

const booked_slots = [
  {
    id: 1,
    startDate: "2020-10-27T01:10:00",
    endDate: "2020-10-27T11:00:00",
    title: "Test event",
    booked_by: 1,
    color: "red",
    resize: false,
  },
];
const available_slots = [
  {
    startDate: "2020-10-27T12:10:00",
    endDate: "2020-10-27T11:00:00",
    color: "green",
    editable: true,
    title: "Available slot",
  },
  {
    id: 2,
    startDate: "2020-10-27T07:00:00",
    endDate: "2020-10-27T11:00:00",
    title: "Test event",
    booked_by: 159,
    color: "blue",
    editable: false,
  },
];
var tempArray = [];

available_slots.forEach((val) => {
  tempArray.push({
    start: val.startDate,
    color: val.color,
    editable: val.editable,
    id: val.id,
    title: val.title,
  });
});
booked_slots.forEach((val) => {
  tempArray.push({
    start: val.startDate,
    color: val.color,
    editable: val.editable,
    id: val.id,
    title: val.title,
  });
});
const limit = 10;
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

const Work = (props) => {
  const [services, setServices] = useState([]);
  const { t } = useTranslation();
  const classes = useStyles();
  const classes1 = useStyles1();
  let { user } = useSession();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [setRes, setTypeRes] = React.useState("");
  const [category, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const { setSidebarContent, setSidebar } = useSidebar();
  const [fileList, setFileList] = useState([]);
  const [isImageSize, isSetImageSize] = useState(false);
  let [copyRecord, setCopyRecord] = useState();
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [isUpcomingMoreData, setUpcomingMoreData] = useState(true);
  const [upcomingoffset, setUpcomingOffset] = useState(0);
  const [isUpcomingLoading, setUpcomingLoading] = useState(false);
  const [activeRecord, setActiveRecord] = useState([]);
  const [inActiveRecord, setInActiveRecord] = useState([]);
  const [serviceVisible, setServiceVisible] = useState(false);
  const [editRecord, setEditRecord] = useState({});
  let { isLoggedIn, doLogin } = useSession();
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openForgotPassword, setForgotPasswordDialog] = useState(false);

  const LoggedIn = useCallback(
    (user) => {
      onIsLoggedIn(true).then((res) => {
        if (res) {
          doLogin(res);
        }
      });
    },
    [doLogin]
  );
  const openSignInDialog = () => {
    setOpenSignIn(true);
  };

  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };

  const openSignUpDialog = () => {
    setOpenSignUp(true);
  };

  const handleCloseSignUp = () => {
    setOpenSignUp(false);
  };

  const openForgotPasswordDialog = () => {
    setForgotPasswordDialog(true);
  };

  const closeForgotPasswordDialog = () => {
    setForgotPasswordDialog(false);
  };
  useEffect(() => {
    var elmnt = document.getElementsByClassName("start-work");
    if (elmnt[0]) {
      elmnt[0].scrollIntoView();
    }
  }, []);

  useEffect(() => {
    async function searchServiceLibrary() {
      setIsJobLoading(true);
      const res = await search("/service/list/user", {
        user_id: user.id_user,
        limit: limit,
        offset: 0,
      }).catch((err) => {
        setIsJobLoading(false);
        console.log(err);
      });
      if (res) {
        const { data, stopped_at, type } = res || {};
        if (type === "ERROR" || (data && data.length === 0)) {
          setIsJobLoading(false);
          setUpcomingMoreData(false);
          return;
        }
        setUpcomingOffset(stopped_at);
        setServices(data || []);
        setIsJobLoading(false);
      }
    }
    searchServiceLibrary();
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
      setServices((services) => [...(services || []), ...(data || [])]);
      setUpcomingLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setOpenSignIn(true);
    } else {
      setSidebar(true);
      setSidebarContent(<WorkSidebar editRecord={editRecord} user={user} />);
    }
  }, [isLoggedIn, setSidebarContent, setSidebar, t, editRecord, user]);

  useEffect(() => {
    async function fetchCategory() {
      const res = await get("/categories/listcategories");
      if (res) {
        setCategories(res);
      }
    }
    fetchCategory();
  }, []);

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

  function makeImage(arr, formData) {
    arr.forEach((imageObj, index) => {
      formData.append("image_" + [index + 1], imageObj);
    });
    return formData;
  }

  const onDelete = async () => {
    const res = await newService.delete("/service/delete", {
      id_service: formik.values.id_service,
      token: copyRecord.token,
    });
    if (res.status === 200) {
    } else {
    }
  };

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

          formData = makeImage(fileList, formData);

          // if (updateRecord.image_1 instanceof File) {
          //   formData.append("image_1", updateRecord.image_1);
          // }
          // if (updateRecord.image_2 instanceof File) {
          //   formData.append("image_2", updateRecord.image_2);
          // }
          // if (updateRecord.image_3 instanceof File) {
          //   formData.append("image_3", updateRecord.image_3);
          // }
          // if (updateRecord.image_4 instanceof File) {
          //   formData.append("image_4", updateRecord.image_4);
          // }
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
          const res = await newService
            .upload("/service/update", formData)
            .catch((err) => {
              setTypeRes(err);
              setOpenSnackbar(true);
              setSubmitting(false);
            });
          if (res) {
            setTypeRes(res);
            setSubmitting(false);
            setOpenSnackbar(true);
          }
        }
      }
    } else {
      if (record) {
        formData = makeImage(fileList, formData);
        formData.append("id_user", user.id_user);
        formData.append("title", record.title);
        formData.append("category", record.category);
        formData.append("subcategory", record.subcategory);
        formData.append("description", record.description);
        formData.append("price", record.price);
        console.log("save..", formData);
        const res = await newService
          .upload("/service/add", formData)
          .catch((err) => {
            setSubmitting(false);
            setTypeRes(res);
            setSubmitting(false);
            setOpenSnackbar(true);
          });
        if (res && res.type === "SUCCESS") {
          setTypeRes(res);
          setOpenSnackbar(true);
        } else {
          setTypeRes(res);
          setSubmitting(false);
          setOpenSnackbar(true);
        }
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
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
  const onEdit = (response) => {
    setServiceVisible(true);
    const newRecord = {
      id_service: response.id_service,
      token: response.token,
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
    formik.setValues({
      title: response.title,
      description: response.description,
      category: response.category,
      price: response.price,
      image_1: response.image_1,
      image_2: response.image_2,
      image_3: response.image_3,
      image_4: response.image_4,
    });
    formik.setFieldValue("id_service", response.id_service);
    const sub =
      category &&
      category.filter((f) => Number(f.id) === Number(response.category));
    if (sub[0] && sub[0].sub_categories) {
      setSubCategories(sub[0].sub_categories);
    }
    formik.setFieldValue("subcategory", sub[0].sub_categories[0].id_category);
    setFileList([...response.images]);
    var elmnt = document.getElementsByClassName("create-service");
    if (elmnt[0]) {
      elmnt[0].scrollIntoView();
    }
  };

  const makeImageUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    } else {
      return file.image;
    }
  };

  const onActivateDactivate = (service) => {
    const d = {
      id_service: service.id_service,
      id_user: user.id_user,
      active: service.active ? false : true,
    };
    add("/service/active", d).then((res) => {
      console.log("res activate", res);
    });
  };

  return (
    <React.Fragment>
      {isLoggedIn && (
        <React.Fragment>
          <section className="start-work">
            <StartWork />
          </section>
          <section className="my-service-lib">
            <TypographyComponent
              title={`My service library (${services.length})`}
            />
            {isJobLoading ? (
              <Spinner />
            ) : (
              <React.Fragment>
                <div className="my-service-wrapper">
                  <div>
                    <ButtonComponent
                      title={"Active"}
                      type="button"
                      className="active-button"
                      onClick={() => {
                        const newArray = services.sort(
                          (a, b) => b.active - a.active
                        );
                        setServices((b) => [...(b || []), ...(newArray || [])]);
                        setActiveRecord((s) => [
                          ...(s || []),
                          ...(newArray || []),
                        ]);
                      }}
                    />

                    <ButtonComponent
                      title="Inactive"
                      className="inActive-button"
                      type="button"
                      onClick={() => {
                        const newArray = services.sort(
                          (a, b) => a.active - b.active
                        );
                        setServices((services) => [...newArray]);
                        setInActiveRecord((services) => [...newArray]);
                      }}
                    />
                  </div>
                  <div>
                    <ButtonComponent
                      title="Create service"
                      className="create-button"
                      type="button"
                      onClick={() => {
                        setServiceVisible(true);
                        formik.resetForm({});
                      }}
                    />
                  </div>
                </div>
                <Divider className="divider" />
                {services && !services.length ? (
                  <span>{t("service.notFoundService")}</span>
                ) : (
                  services.map((service, index) => {
                    return (
                      <Grid container spacing={3} key={index}>
                        <Grid item xs={12} md={3}>
                          <ButtonComponent
                            title={service.active ? "Activate" : "Deactivate"}
                            className={clsx(
                              { "deactivate-button": !service.active },
                              "active-button"
                            )}
                            onClick={(e) => {
                              onActivateDactivate(service);
                            }}
                          />

                          <ButtonComponent
                            title="Edit"
                            className="edit-button"
                            onClick={() => {
                              onEdit(service);
                              setEditRecord(service);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <TypographyComponent title={service.price} />
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <TypographyComponent title={service.title} />
                        </Grid>
                        <Hidden smDown>
                          <Grid item xs={12} md={1}></Grid>
                        </Hidden>
                        <Grid item xs={12} md={1}>
                          <TypographyComponent title="Service quality" />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <div className="service-quality">
                            <TypographyComponent title="5" />
                            <StarBorderIcon />
                          </div>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TypographyComponent title="Sympathy" />
                          <div className="simpathy">
                            <TypographyComponent title="4.5" />
                            <StarBorderIcon />
                          </div>
                        </Grid>
                      </Grid>
                    );
                  })
                )}
                {isUpcomingMoreData && services && services.length > 0 && (
                  <div>
                    {isUpcomingLoading ? (
                      <Spinner />
                    ) : (
                      <div
                        className="load-more"
                        onClick={() =>
                          onMore("/service/list/user", upcomingoffset, {})
                        }
                      ></div>
                    )}
                  </div>
                )}
                <Divider className="divider" />
              </React.Fragment>
            )}
          </section>
          {formik.values.id_service && (
            <section className="add-booking-space">
              <AddBookinSpace tempArray={tempArray} />
            </section>
          )}
          {serviceVisible && (
            <section className="create-service">
              <div className={classes.content}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={10}>
                    <TypographyComponent
                      title={
                        formik.values.id_service
                          ? t("service.create-service.editService")
                          : t("service.create-service.createService")
                      }
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
                                  handleBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.title}
                                  error={
                                    formik.errors.title && formik.touched.title
                                      ? true
                                      : false
                                  }
                                  helperText={
                                    formik.errors.title &&
                                    formik.touched.title &&
                                    `${formik.errors.title}`
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
                                error={
                                  formik.errors.category &&
                                  formik.touched.category
                                    ? true
                                    : false
                                }
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
                                    if (sub[0]) {
                                      formik.setFieldValue(
                                        "subcategory",
                                        sub[0].sub_categories[0].id_category
                                      );
                                    }
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
                                error={
                                  formik.errors.subcategory &&
                                  formik.touched.subcategory
                                    ? true
                                    : false
                                }
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
                                    onChange={(event) =>
                                      handleUploadClick(event)
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
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={10}>
                      {formik.values.id_service && (
                        <ButtonComponent
                          title="Delete service"
                          onClick={() => {
                            onDelete();
                          }}
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
              </div>
            </section>
          )}
        </React.Fragment>
      )}
      <SnackBarComponent
        open={openSnackbar}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={setRes.message}
        type={setRes.type && setRes.type.toLowerCase()}
      />
      <SignIn
        onClose={handleCloseSignIn}
        openSignIn={openSignIn}
        openSignUpDialog={openSignUpDialog}
        openForgotPasswordDialog={openForgotPasswordDialog}
        handleCloseSignIn={handleCloseSignIn}
        setLogin={LoggedIn}
      />
      <SignUp
        handleCloseSignUp={handleCloseSignUp}
        openSignUp={openSignUp}
        openSignInDialog={openSignInDialog}
      />
      <ForgotPassword
        closeForgotPasswordDialog={closeForgotPasswordDialog}
        openForgotPassword={openForgotPassword}
        openSignInDialog={openSignInDialog}
      />
    </React.Fragment>
  );
};

export default Work;
