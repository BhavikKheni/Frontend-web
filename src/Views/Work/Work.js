import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { Grid, Divider } from "@material-ui/core";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import TypographyComponent from "../../Components/Typography/Typography";
import ButtonComponent from "../../Components/Forms/Button";
import StartWork from "./StartWork";
import AddBookingSpace from "./AddBookingSpace";
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
import { onIsLoggedIn } from "../../Services/Auth.service";
import './Work.css';
import WorkSidebar from "./WorkSidebar";
import AddBookingSpaceBar from "../../Components/Booking/AddBookingSpaceSidebar/AddBookingSpacebarSide";
import moment from "moment";
const newService = new Service();
const useSession = () => React.useContext(SessionContext);

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
  let [services, setServices] = useState([]);
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
  const [getDeletedImageArry, setDeletedImageArray] = useState([]);
  let { isLoggedIn } = useSession();

  const [activeLoader, setActiveLoader] = useState(false);
  const [slots, setAllSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [addActiveClassName, setActiveClassName] = useState("");
  const [addClassInActiveName, setInActiveClassName] = useState("");

  useEffect(() => {
    var elmnt = document.getElementsByClassName("start_work");
    if (elmnt[0]) {
      elmnt[0].scrollIntoView();
    }
  }, []);

  const searchServiceLibrary = useCallback(async () => {
    setIsJobLoading(true);
    const res = await search("/service/list/user", {
      user_id: user.id_user,
      limit: limit,
      offset: 0,
    }).catch((err) => {
      setIsJobLoading(false);
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
  }, []);

  useEffect(() => {
    searchServiceLibrary();
  }, [user.id_user, searchServiceLibrary]);
  useEffect(() => {
    async function fetchSlots() {
      const params = {
        from_date: moment().startOf("week").format("YYYY-MM-DD"),
        to_date: moment().endOf("week").format("YYYY-MM-DD"),
      };
      const response = await search("/slot/list", params).catch((err) => {
        console.log("error", err);
      });

      if (response) {
        setAvailableSlots(response["available_slots"]);

        let tempArray = [];
        response["available_slots"].forEach((slot) => {
          tempArray.push({
            groupId: "availableForMeeting",
            start: moment(slot.startDate).format("YYYY-MM-DDTHH:mm:ss"),
            end: moment(slot.endDate).format("YYYY-MM-DDTHH:mm:ss"),
            display: "background",
            // constraint: 'availableForMeeting',
          });
        });
        response["booked_slots"].forEach((slot) => {
          tempArray.push({
            id: slot.slot_id,
            start: moment(slot.startDate).format("YYYY-MM-DDTHH:mm:ss"),
            end: moment(slot.endDate).format("YYYY-MM-DDTHH:mm:ss"),
            title: slot.service_title,
            description: "Booked",
            booked_by: slot.booked_by,
            color: "#4F4F4F",
            resize: false,
            overlap: false,
          });
        });
        setAllSlots([...tempArray]);
      }
    }
    fetchSlots();
  }, []);

  const onMore = async (path, offset, criteria = {}) => {
    setUpcomingLoading(true);
    let res = await search(path, {
      limit: limit,
      offset: offset,
      user_id: user.id_user,
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
    setSidebar(true);
    setSidebarContent(<WorkSidebar editRecord={editRecord} user={user} />);
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

  // Manage the deleted_images array
  function makeImage(arr, formData) {
    let deletedImageArr = getDeletedImageArry;
    arr.forEach((imageObj, index) => {
      if (imageObj instanceof File) {
        if (deletedImageArr[0]) {
          formData.append(deletedImageArr[0], imageObj);
          deletedImageArr.shift();
          setDeletedImageArray(deletedImageArr);
        } else {
          formData.append("image_" + index + 1, imageObj);
        }
      }
    });
    return formData;
  }

  const onDelete = async () => {
    const res = await newService.add("/service/delete", {
      id_service: formik.values.id_service,
    });
    if (res.status === 200) {
    } else {
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
    onSubmit: (values, { setSubmitting }) => {
      onSave(values, setSubmitting);
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required(t("validation.serviceTitle")),
      category: Yup.string().required(t("validation.Category")),
      subcategory: Yup.string().required(t("validation.SubCategory")),
    }),
  });

  const onEditService = async (record, formData, setSubmitting) => {
    let updateRecord = Object.keys(record).reduce((diff, key) => {
      if (record[key] === copyRecord[key]) return diff;
      return {
        ...diff,
        [key]: record[key],
      };
    }, {});

    formData = makeImage(fileList, formData);

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

    for (let i = 0; i < getDeletedImageArry.length; i++) {
      formData.append(`deleted_images[${i}]`, getDeletedImageArry[i]);
    }

    const res = await newService
      .upload("/service/update", formData)
      .catch((err) => {
        setTypeRes(err);
        setOpenSnackbar(true);
        setSubmitting(false);
      });
    if (res) {
      const targetIndex = services.findIndex(
        (l) => l.id_service === formik.values.id_service
      );
      services[targetIndex] = formik.values;
      setServices((d) => [...d]);
      setTypeRes(res);
      setSubmitting(false);
      setOpenSnackbar(true);
    }
  };

  const onSave = async (record, setSubmitting) => {
    let formData = new FormData();

    if (record.id_service) {
      if (record) {
        const isEdit = isEquivalent(copyRecord, record);
        if (!isEdit) {
          onEditService(record, formData, setSubmitting);
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
    setActiveLoader(true);
    add("/service/active", d)
      .then((res) => {
        setActiveLoader(false);
        searchServiceLibrary();
      })
      .catch((err) => {});
  };

  const handleOnDeleteImage = (file, index) => {
    let a = getDeletedImageArry;
    if (file.image_reference) {
      a.push(file.image_reference);
      setDeletedImageArray(a);
    }

    fileList.splice(index, 1);
    setFileList([...fileList]);
  };

  const onAddBookingCalendar = (data) => {
    console.log("Data", data);

    // availableSlots.forEach((slot) => {
    //   const startDate = moment(slot.startDate).format("YYYY-MM-DDTHH:mm:ss");
    //   const endDate = moment(slot.endDate).format("YYYY-MM-DDTHH:mm:ss");
    // });
    setAllSlots((d) => [...(d || []), data]);
  };

  const onCreateService = () => {
    if (user.email_verified) {
      setServiceVisible(true);
      formik.resetForm({});
      setFileList([]);
      var elmnt = document.getElementsByClassName("create-service");
      if (elmnt[0]) {
        elmnt[0].scrollIntoView();
      }
    } else {
      setOpenSnackbar(true);
      setTypeRes({
        message: "Please verify your email",
        type: "error",
      });
    }
  };

  const onIsActive = () => {
    const newArray = services.sort((a, b) => b.active - a.active);
    setServices((services) => [...newArray]);
    setActiveRecord((services) => [...newArray]);
    setActiveClassName("is_active_service");
  };

  const onIsInActive = () => {
    const newArray = services.sort((a, b) => a.active - b.active);
    setServices((services) => [...newArray]);
    setInActiveRecord((services) => [...newArray]);
    setInActiveClassName("is_in_active_service");
  };

  return (
    <React.Fragment>
      {isLoggedIn && (
        <div className="work_page">
          <TypographyComponent variant="h2" title="Service name" className="start_work_title" />
          <StartWork />
          <section className="my_work_services">
            <h2>My service library <span>({services.length} Services)</span></h2>
            {/* <TypographyComponent
              title={`My service library (${services.length})`}
            /> */}
            {isJobLoading ? (
              <Spinner />
            ) : (
              <React.Fragment>
                <div className="my_work_services_filter">
                  <div>
                    <ButtonComponent
                      title={"Active"}
                      type="button"
                      className={clsx("active_service_button", addActiveClassName)}
                      onClick={() => {
                        onIsActive("isActive");
                      }}
                    />

                    <ButtonComponent
                      title="Inactive"
                      className={clsx("inactive_service_button", addClassInActiveName)}
                      type="button"
                      onClick={() => {
                        onIsInActive();
                      }}
                    />
                  </div>
                  <div>
                    <ButtonComponent
                      title="Create service"
                      className="create_new_service_button"
                      type="button"
                      onClick={() => {
                        onCreateService();
                      }}
                    />
                  </div>
                </div>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <Divider
                      style={{
                        border: "0.5px solid #9E9E9E",
                      }}
                    />
                  </Grid>
                </Grid>
                <div className="my_work_service_library">
                  {services && !services.length ? (
                    <span>{t("service.notFoundService")}</span>
                  ) : (
                    services.map((service, index) => {
                      return (
                        <div className="my_service" key={index}>
                          <ButtonComponent
                            title={service.active ? "Activate" : "Deactivate"}
                            className={clsx(
                              { "deactivate_service_button": !service.active },
                              "activate_service_button"
                            )}
                            onClick={(e) => {
                              onActivateDactivate(service);
                            }}
                            loader={activeLoader}
                          />

                          <ButtonComponent
                            title="Edit"
                            className="edit_service_button"
                            onClick={() => {
                              onEdit(service);
                              setEditRecord(service);
                            }}
                          />
                          <TypographyComponent title={service.price} className="work_service_price" />
                          <TypographyComponent title={service.title} className="work_service_title" />
                          <div className="work_service_review">
                            <TypographyComponent title="Service quality" className="work_service_review_name" />
                            <TypographyComponent title="5" />
                            <StarBorderIcon />
                          </div>
                          <div className="work_service_review">
                            <TypographyComponent title="Sympathy" className="work_service_review_name"/>
                            <TypographyComponent title="4.5" />
                            <StarBorderIcon />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
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
            )}
          </section>

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
                                        handleOnDeleteImage(file, i);
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
          {formik.values.id_service && (
            <section className="add-booking-space">
              <AddBookingSpace tempArray={slots} />
            </section>
          )}
          {formik.values.id_service && (
            <div className="booking_time">
              <AddBookingSpaceBar
                onAddBookingCalendar={(data) => onAddBookingCalendar(data)}
                user={user}
                selectedService={editRecord}
              />
            </div>
          )}
        </div>
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
    </React.Fragment>
  );
};

export default Work;
