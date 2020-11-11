import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { Grid, Divider } from "@material-ui/core";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import TypographyComponent from "../../Components/Typography/Typography";
import ButtonComponent from "../../Components/Forms/Button";
import StartWork from "./StartWork/StartWork";
import AddBookingSlotCalendar from "./AddBookingSlotCalendar/AddBookingSlotCalendar";
import { search } from "../../Services/Auth.service";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiFormControl from "@material-ui/core/FormControl";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import SelectComponent from "../../Components/Forms/Select";
import InputComponent from "../../Components/Forms/Input";
import SnackBarComponent from "../../Components/SnackBar/SnackBar";
import Spinner from "../../Components/Spinner/Spinner";
import { SessionContext } from "../../Provider/Provider";
import { get, add } from "../../Services/Auth.service";
import Service from "../../Services/index";
import { useSidebar } from "../../Provider/SidebarProvider";
import "./Work.css";
import WorkSidebar from "./WorkSidebar";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";
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
  const [addActiveClassName, setActiveClassName] = useState("");
  const [addClassInActiveName, setInActiveClassName] = useState("");
  const [conformDeleteDialogOpen, setConformDeleteDialogOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [totalServices, setTotalServices] = useState(0);

  useEffect(() => {
    scrollToSection("start_work");
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
      setTotalServices()
      setUpcomingOffset(stopped_at);
      setServices(data || []);
      setIsJobLoading(false);
    }
  }, [user.id_user]);

  useEffect(() => {
    searchServiceLibrary();
  }, [user.id_user, searchServiceLibrary]);

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
    setDeleteLoader(true);
    const res = await newService
      .add("/service/delete", {
        id_service: formik.values.id_service,
      })
      .catch((err) => {
        setOpenSnackbar(true);
        setRes({
          message: err,
          type: "error",
        });
        setDeleteLoader(false);
      });
    if (res.type === "SUCCESS") {
      const targetIndex = services.findIndex(
        (l) => l.id === formik.values.id_service
      );
      services.splice(targetIndex, 1);
      setServices((d) => [...d]);
      setServiceVisible(false);
      formik.setFieldValue("id_service", null);
      setConformDeleteDialogOpen(false);
      setDeleteLoader(false);
    } else {
      setOpenSnackbar(true);
      setRes({
        message: res.message,
        type: res.type,
      });
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
    setSaveLoader(true);
    const res = await newService
      .upload("/service/update", formData)
      .catch((err) => {
        setTypeRes(err);
        setOpenSnackbar(true);
        setSubmitting(false);
      });
    if (res && res.type === "SUCCESS") {
      const targetIndex = services.findIndex(
        (l) => l.id_service === formik.values.id_service
      );
      services[targetIndex] = formik.values;
      setServices((d) => [...d]);
      setSaveLoader(false);
      setTypeRes({
        message: res.message,
        type: "success",
      });
      setSubmitting(false);
      setOpenSnackbar(true);
    } else {
      setSaveLoader(false);
      setTypeRes({
        message: res.message,
        type: "error",
      });
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
            setSaveLoader(false);
            setSubmitting(false);
            setTypeRes(res);
            setSubmitting(false);
            setOpenSnackbar(true);
          });
        if (res && res.type === "SUCCESS") {
          setSaveLoader(false);
          setTypeRes({
            message: res.message,
            type: "success",
          });
          setOpenSnackbar(true);
        } else {
          setSaveLoader(false);
          setTypeRes({
            message: res.message,
            type: "error",
          });
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
    scrollToSection("create_service");
  };

  const scrollToSection = (sectionName) => {
    var elementCalendar = document.getElementsByClassName(sectionName);
    if (elementCalendar[0]) {
      elementCalendar[0].scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
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
        const targetIndex = services.findIndex(
          (l) => l.id_service === service.id_service
        );
        services[targetIndex] = {
          ...service,
          active: service.active ? false : true,
        };
        setServices((d) => [...d]);
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

  const onCreateService = () => {
    if (user.email_verified) {
      setServiceVisible(true);
      formik.resetForm({});
      setFileList([]);
      scrollToSection("create_service");
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
      <div className="work_page">
        <section className="start_work">
          <StartWork />
        </section>
        <section className="my_work_services">
          <h2>
            My service library <span>({totalServices} Services)</span>
          </h2>
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
                    className={clsx(
                      "active_service_button",
                      addActiveClassName
                    )}
                    onClick={() => {
                      onIsActive("isActive");
                    }}
                  />

                  <ButtonComponent
                    title="Inactive"
                    className={clsx(
                      "inactive_service_button",
                      addClassInActiveName
                    )}
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
                  <span className="no_records_found">
                    {t("service.notFoundService")}
                  </span>
                ) : (
                  services.map((service, index) => {
                    return (
                      <div className="my_service" key={index}>
                        <ButtonComponent
                          title={service.active ? "Activate" : "Deactivate"}
                          className={clsx(
                            { deactivate_service_button: !service.active },
                            "activate_service_button"
                          )}
                          onClick={(e) => {
                            onActivateDactivate(service);
                          }}
                          startIcon={activeLoader && <Spinner />}
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
                        <TypographyComponent
                          title={service.price}
                          className="work_service_price"
                        />
                        <TypographyComponent
                          title={service.title}
                          className="work_service_title"
                        />
                        <div className="work_service_review">
                          <TypographyComponent
                            title="Service quality"
                            className="work_service_review_name"
                          />
                          <TypographyComponent title="5" />
                          <StarBorderIcon />
                        </div>
                        <div className="work_service_review">
                          <TypographyComponent
                            title="Sympathy"
                            className="work_service_review_name"
                          />
                          <TypographyComponent title="4.5" />
                          <StarBorderIcon />
                        </div>
                      </div>
                    );
                  })
                )}
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
            </React.Fragment>
          )}
        </section>

        {serviceVisible && (
          <section className="create_service">
            <TypographyComponent
              title={
                formik.values.id_service
                  ? t("service.create-service.editService")
                  : t("service.create-service.createService")
              }
              variant="h2"
            />
            <form
              onSubmit={formik.handleSubmit}
              className="create_service_form"
            >
              <div className="create_service_form_location">
                <TypographyComponent
                  title={t("service.create-service.nameAllocation")}
                  variant="h6"
                />
                <div className="create_service_form_location_left">
                  <FormControl
                    variant="outlined"
                    className={"form_row"}
                    error={formik.errors.title ? true : false}
                  >
                    <InputComponent
                      label="Sevice name"
                      type="text"
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
                  <div className="form_row">
                    <TypographyComponent title="Describe the service of your dream as specific and simple you can so others can find you easily." />
                  </div>
                </div>

                <div className="create_service_form_location_right">
                  <FormControl
                    variant="outlined"
                    className={"form_row"}
                    error={
                      formik.errors.category && formik.touched.category
                        ? true
                        : false
                    }
                  >
                    <SelectComponent
                      name="category"
                      label="Category"
                      value={formik.values.category}
                      native
                      onChange={(e) => {
                        formik.setFieldValue("category", e.target.value);
                        const sub =
                          category &&
                          category.filter(
                            (f) => Number(f.id) === Number(e.target.value)
                          );
                        setSubCategories(sub[0].sub_categories);
                        if (sub[0] && sub[0].sub_categories.length > 0) {
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
                          <option
                            key={Number(m.id)}
                            value={Number(m.id)}
                            className={classes.formControl}
                          >
                            {m.name}
                          </option>
                        ))}
                    </SelectComponent>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className={"form_row"}
                    error={
                      formik.errors.subcategory && formik.touched.subcategory
                        ? true
                        : false
                    }
                  >
                    <SelectComponent
                      name="subcategory"
                      label="Sub-Category"
                      value={formik.values.subcategory}
                      native
                      onChange={formik.handleChange}
                    >
                      {subCategories &&
                        subCategories.map((m, i) => (
                          <option
                            key={Number(m.id_category)}
                            value={Number(m.id_category)}
                          >
                            {m.category_name}
                          </option>
                        ))}
                    </SelectComponent>
                  </FormControl>
                </div>
              </div>

              <TypographyComponent variant="h6" title="Description" />

              <div className="create_service_form_description">
                <FormControl variant="outlined" className={"form_row"}>
                  <InputComponent
                    type="text"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    multiline
                    rows={10}
                    fullWidth
                    fullHeight
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="Please briefly describe your service... 
                    In which situation can i use this service? 
                    What can I expect from this service? 
                    What are the key information?"
                  />
                </FormControl>
              </div>

              <TypographyComponent variant="h6" title="Price setting" />

              <div className="create_service_form_price_setting">
                <div className="create_service_form_price">
                  <TypographyComponent variant="h6" title="My hourly price" />
                  <InputComponent
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    placeholder="00.00£"
                  />
                </div>
                <TypographyComponent title="Uppon your price will be sett the conditions of a payment service provider and the comission of Owera. All employees of Owera thank you for using our service and enabling our workplaces. Enjoy this winn winn situation because this is our philosophy to achiefe." />
              </div>

              <TypographyComponent variant="h6" title="Pictures" />

              <div className="create_service_form_img">
                {fileList &&
                  fileList.map((file, i) => (
                    <div className="create_service_form_img_item" key={i}>
                      <img alt="Profile" src={file && makeImageUrl(file)} />
                      <div
                        className="create_service_form_img_delete"
                        onClick={() => {
                          handleOnDeleteImage(file, i);
                        }}
                      >
                        <label>Delete picture</label>
                        <DeleteIcon />
                      </div>
                    </div>
                  ))}
                {fileList.length >= 4 ? null : (
                  <div className="create_service_form_img_item">
                    <input
                      type="file"
                      name={`image_${fileList.length + 1}`}
                      id={`image_${fileList.length + 1}`}
                      style={{ display: "none" }}
                      onChange={(event) => handleUploadClick(event)}
                    />
                    <div
                      className="create_service_form_img_add_item"
                      onClick={() => {
                        document
                          .getElementById(`image_${fileList.length + 1}`)
                          .click();
                      }}
                    >
                      <label htmlFor="file">Upload image</label>
                      <AddIcon />
                    </div>
                  </div>
                )}
              </div>

              <div className="create_service_form_cta_row">
                {formik.values.id_service && (
                  <ButtonComponent
                    title="Delete service"
                    onClick={() => {
                      setConformDeleteDialogOpen(true);
                    }}
                    variant="outlined"
                    className="create_service_form_delete_cta"
                  />
                )}
                <ButtonComponent
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={saveLoader && <Spinner />}
                  loader={saveLoader}
                  disabled={formik.isSubmitting}
                  title={
                    formik.values.id_service ? "Save changes" : "Create service"
                  }
                  className="create_service_form_save_cta"
                />
              </div>
            </form>
          </section>
        )}
        <AddBookingSlotCalendar
          id_service={formik.values.id_service}
          editRecord={editRecord}
        />
      </div>

      {formik.values.id_service && (
        <ConfirmDialog
          open={conformDeleteDialogOpen}
          onClose={() => setConformDeleteDialogOpen(false)}
          onConfirm={() => onDelete()}
          onCancel={() => setConformDeleteDialogOpen(false)}
          loader={deleteLoader}
        />
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
