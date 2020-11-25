import React, { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import $ from "jquery";
import "date-fns";
import "./Calendar.css";

const CalendarComponent = (props) => {

  const calendarRef = useRef();

  const { INITIAL_EVENTS, renderEventContent, selectable=false, onDateChanged} = props;

  useEffect(() => {
    $('.fc-prev-button').on('click', x => {
      setTimeout(() => {
        onDateRangeChange();
      }, 200);
    });
    $('.fc-next-button').on('click', x => {
      setTimeout(() => {
        onDateRangeChange();
      }, 200);
    });
  }, []);

  const onDateRangeChange = () => {
    let calendar = calendarRef.current.getApi();
    const startDate = calendar.view.activeStart;
    const endDate = calendar.view.activeEnd;
    console.log("startDate and endDate: ", startDate, endDate);
    onDateChanged();
  }

  const onSelectSlot = (event) => {
    if(props.onSelectBookingSlot){
      props.onSelectBookingSlot(event);
    }
  }

  const onSelectDate = (event) => {
    props.onSelectDate(event);
  }

  return (
    <FullCalendar
      ref={calendarRef} 
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: "today prevYear,prev,title,next,nextYear",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
        center: "",
      }}
      titleFormat={{
        month: "long",
        year: "numeric",
      }}
      initialView="timeGridWeek"
      formatDate={{
        day: "numeric",
        month: "long",
        year: "numeric"
      }}
      views={{
        dayGrid: {
          dayHeaderFormat: {
            weekday: "long"
          }
        },
        week: {
          dayHeaderFormat: {
            day: "numeric",
            weekday: "short",
            month: "long",
          }
        },
        day: {
          dayHeaderFormat: {
            day: "numeric",
            weekday: "long",
            month: "long",
          }
        }
      }}
      // businessHours={true}
      editable={true}
      eventConstraint={"businessHours"} // disabled drag and drop in whole calendar
      // selectConstraint= {{
      //   start: moment().subtract(1, 'days'),
      //  end: moment().startOf('year').add(100, 'year')
      //  }}
      selectable={selectable}
      eventContent={renderEventContent}
      events={INITIAL_EVENTS}
      eventClick= {(info) => {
        if (!info.event.extendedProps.isBooked) {
          onSelectSlot(info.event);
        }
      }}
      select= {(info) => {
        // alert('selected ' + info.startStr + ' to ' + info.endStr);
        // onSelectDate(info);
        props.onSelectDate(info);
      }}
    />
  );
};
export default CalendarComponent;
