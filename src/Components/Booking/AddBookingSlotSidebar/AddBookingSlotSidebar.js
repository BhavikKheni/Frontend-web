import React, { useState, useImperativeHandle, forwardRef } from "react";
import moment from "moment";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import InputComponent from "../../Forms/Input";
import ButtonComponent from "../../Forms/Button";
import Sppiner from "../../Spinner/Spinner";
import { add } from "../../../Services/Auth.service";
import Service from "../../../Services/index";
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog'
import SnackBarComponent from "../../SnackBar/SnackBar";
const newService = new Service();

const AddBookingSlotSideBar = forwardRef((props, ref) => {
  const [getFromTime, setFromTime] = useState("");
  const [getToTime, setToTime] = useState("");
  const [getFromDate, setFromDate] = useState("");
  const [getToDate, setToDate] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [response, setResponse] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [slot_id, setSlot_id] = useState(null);
  const { id_service } = props;
  const [conformDeleteDialogOpen, setConformDeleteDialogOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const onChangeFromTime = (e) => {
    setFromTime(e.target.value);
  };

  const onChangeToTime = (e) => {
    setToTime(e.target.value);
  };

  // This function will call from parent component
  useImperativeHandle(ref, () => ({
    setSeletedSlotDetails(selectedSlotDetails) {
      setDateTimeFieldValue(selectedSlotDetails);
    },
  }));

  const setDateTimeFieldValue = (slotInfo) => {
    setFromDate(slotInfo.start);
    setToDate(slotInfo.end);
    setFromTime(moment(slotInfo.start).format("HH:mm"));
    setToTime(moment(slotInfo.end).format("HH:mm"));
    if (slotInfo.extendedProps && slotInfo.extendedProps.slot_id) {
      setSlot_id(slotInfo.extendedProps.slot_id);
    } else {
      setSlot_id(null);
    }
  };

  const getTitle = () => {
    return slot_id ? (<h4>Edit Booking Space</h4>) : (<h4>Add Booking Space</h4>);
  }

  const onSaveSlot = () => {
    const startDate = moment(getFromDate).format("YYYY-MM-DD");
    const endDate = moment(getToDate).format("YYYY-MM-DD");
    let bookingData = {
      from_datetime: moment(`${startDate} ${getFromTime}`).toISOString(),
      to_datetime: moment(`${endDate} ${getToTime}`).toISOString(),
    };

    setLoading(true);
    setDisabled(true);

    if (slot_id) {
      bookingData["id_slot"] = slot_id;
      onUpdate(bookingData);
    } else {
      bookingData["id_service"] = id_service;
      onSave(bookingData);
    }
  };

  const onSave = (record) => {
    add("/slot/add", record).then((result) => {
      handleResponse(result);
    }).catch((error) => {
      handleError(error);
    });
  };

  const onUpdate = (record) => {
    add("/slot/update", record).then((result) => {
      handleResponse(result);
    }).catch((error) => {
      handleError(error);
    });
  }

  const handleResponse = (result) => {
    if (result.type === "SUCCESS") {
      setLoading(false);
      setResponse(result);
      setOpenSnackBar(true);
      setDisabled(false);
      props.onAddBookingCalendar();
    }
  }

  const handleError = (error) => {
    setDisabled(false);
    setLoading(false);
    setResponse(error);
    setOpenSnackBar(true);
  }

  const onDelete = async () => {
    setDeleteLoader(true);
    const res = await newService
      .add("/slot/delete", {
        id_slot:slot_id,
      })
      .catch((err) => {
        setOpenSnackBar(true);
        setResponse({
          message: 'TypeError: Failed to fetch',
          type: "error",
        });
        setDeleteLoader(false);
      });
    if (res && res.type === "SUCCESS") {
      setConformDeleteDialogOpen(false);
      setDeleteLoader(false);
      props.onAddBookingCalendar()
    } else if(res && res.type === "ERROR"){
      setOpenSnackBar(true);
      setResponse({
        message: res.message,
        type: res.type,
      });
    }
  };

  return (
    <React.Fragment>
      <div className="booking_title">
        {getTitle()}
      </div>
      <div className="booking_row booking_time_interval">
        <span className="booking_time_label">From:</span>
        <InputComponent
          placeholder="00:00"
          type="time"
          value={getFromTime}
          onChange={(e) => {
            onChangeFromTime(e);
          }}
          className="booking_time_interval_input"
        />
        <span>To</span>
        <InputComponent
          placeholder="00:00"
          type="time"
          value={getToTime}
          onChange={(e) => {
            onChangeToTime(e);
          }}
          className="booking_time_interval_input"
        />
      </div>
      {getFromDate ? (
        <React.Fragment>
          <div className="booking_row booking_date">
            <span className="booking_time_label">From Date:</span>
            <span>
              {moment(getFromDate).format("MM-DD-YYYY")}
            </span>
          </div>
          <div className="booking_row booking_date">
            <span className="booking_time_label">To Date:</span>
            <span>
              {moment(getToDate).format("MM-DD-YYYY")}
            </span>
          </div>
        </React.Fragment>
      ) : null}
      <div className="confirm_booking_row">
        <ButtonComponent
          title={slot_id ? "Update": "Add"}
          type="button"
          endIcon={!isLoading && <AddIcon />}
          startIcon={isLoading && <Sppiner />}
          loader={isLoading}
          onClick={() => {
            onSaveSlot();
          }}
          disabled={isDisabled}
          className={"confirm_cta"}
        />
      </div>
      {slot_id && 
      <div className="confirm_booking_row">
        <ButtonComponent
          title={slot_id && "Delete"}
          type="button"
          endIcon={!isLoading && <DeleteIcon />}
          startIcon={isLoading && <Sppiner />}
          loader={isLoading}
          onClick={() => {
            setConformDeleteDialogOpen(true)
          }}
          disabled={isDisabled}
          className={"confirm_cta"}
        />
        </div>
        }
        <ConfirmDialog
          open={conformDeleteDialogOpen}
          onClose={() => setConformDeleteDialogOpen(false)}
          onConfirm={() => onDelete()}
          onCancel={() => setConformDeleteDialogOpen(false)}
          loader={deleteLoader}
        />
      <SnackBarComponent
        open={openSnackBar}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={response.message}
        type={response.type && response.type.toLowerCase()}
      />
    </React.Fragment>
  );
});

export default AddBookingSlotSideBar;
