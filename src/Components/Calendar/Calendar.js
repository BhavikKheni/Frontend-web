import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import $ from "jquery";
import "date-fns";
import "./Calendar.css";

const CalendarComponent = (props) => {

  useEffect(() => {
    $('.fc-prev-button').on('click', x => {
      console.dir(x);
      props.onDateChange();
    });
  //   $('.fc-button-prev span').click(function(){
  //     alert('prev is clicked, do something');
  //  });
  }, []);

  const { INITIAL_EVENTS, renderEventContent, selectable=false } = props;

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
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: "today prevYear,prev,title,next,nextYear",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
        center: "",
      }}
      dayHeaderFormat={{
        day: "numeric",
        weekday: "short",
        month: "long",
      }}
      titleFormat={{
        month: "long",
        year: "numeric",
      }}
      initialView="timeGridWeek"
      formatDate={{
        month: "long",
        year: "numeric",
        day: "numeric",
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
      eventChange = {() => {
        console.log("eee")
      }}
    />
  );
};
export default CalendarComponent;
