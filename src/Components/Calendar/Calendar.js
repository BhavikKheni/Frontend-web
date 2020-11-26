import React, { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {HEADER_TOOLBAR, TITLE_FORMAT, FORMAT_DATE, VIEWS} from './CalendarConst';

import $ from "jquery";
import "date-fns";
import "./Calendar.css";


const CalendarComponent = (props) => {

  const calendarRef = useRef();

  const { INITIAL_EVENTS, renderEventContent, selectable=false, onDateChanged} = props;

  useEffect(() => {
    onDateRangeChanged();
    handleDateChangeOnClick();
  }, []);

  const handleDateChangeOnClick = () => {
    $('.fc-prev-button').on('click', x => {
      setTimeout(() => {
        onDateRangeChanged();
      }, 200);
    });
    $('.fc-next-button').on('click', x => {
      setTimeout(() => {
        onDateRangeChanged();
      }, 200);
    });
  }

  // Refresh the calendar when date range changed
  const onDateRangeChanged = () => {
    let calendar = calendarRef.current.getApi();
    const dates = {
      from_datetime: calendar.view.activeStart,
      to_datetime: calendar.view.activeEnd
    };
    onDateChanged(dates);
  }

  const onSelectSlot = (event) => {
    if(props.onSelectBookingSlot){
      props.onSelectBookingSlot(event);
    }
  }

  const validRange = (nowDate) => {
    return {
      start: nowDate,
    }
  }

  const onSelectDate = (info) => {
    // alert('selected ' + info.startStr + ' to ' + info.endStr);
    props.onSelectDate(info);
  }

  const onEventClick = (info) => {
    console.log("AAA: ", info)
    if (!info.event.extendedProps.isBooked) {
      onSelectSlot(info.event);
    }
  }

  return (
    <FullCalendar
      ref={calendarRef} 
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={HEADER_TOOLBAR}
      titleFormat={TITLE_FORMAT}
      initialView="timeGridWeek"
      formatDate={FORMAT_DATE}
      views={VIEWS}
      editable={true}
      eventConstraint={"businessHours"}
      selectable={selectable}
      eventContent={renderEventContent}
      events={INITIAL_EVENTS}
      eventClick= {(info) => onEventClick(info)}
      select= {(info) => onSelectDate(info)}
      validRange={(nowDate) => validRange(nowDate)}
    />
  );
};
export default CalendarComponent;
