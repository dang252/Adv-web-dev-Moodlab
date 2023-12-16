import { useEffect, useState } from "react";
import { Card, Checkbox } from "antd";

import { EventAddArg, formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { FaRegCalendar } from "react-icons/fa6";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// import { INITIAL_EVENTS, createEventId } from "../utils/event";
import { createEventId } from "../utils/event";

const renderEventContent = (eventInfo: any) => {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
};

const renderSidebarEvent = (event: any) => {
  return (
    <p key={event.id}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
        :
      </b>
      <i className="ml-3">{event.title}</i>
    </p>
  );
};

const DndCalendar = () => {
  const [weekendsVisible, setWeekendsVisible] = useState<boolean>(false);
  const [currentEvents, setCurrentEvents] = useState<any>([]);

  const username = useSelector<RootState, string>((state) => {
    return state.users.username;
  });

  const handleSaveCalender = (username: string, data: any[]) => {
    const Calender = {
      username: username,
      events: data,
    };

    console.log(Calender);
    // localStorage.setItem("calender", JSON.stringify(Calender));
  };

  useEffect(() => {
    if (username !== "") {
      const calenderStr = localStorage.getItem("calender");

      if (calenderStr !== null) {
        const Calender = JSON.parse(calenderStr);

        setCurrentEvents(Calender.events);
      }
    }
  }, [username]);

  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible);
  };

  const handleDateSelect = (selectInfo: any) => {
    const title = prompt("Enter a new title for your event:");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventClick = (clickInfo: any) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  const handleEvents = (events: any) => {
    setCurrentEvents(events);
  };

  const handleAddEvent = (e: EventAddArg) => {
    const newEvent = e.event;

    const data = currentEvents;
    data.push(newEvent);

    handleSaveCalender(username, data);
  };

  return (
    <div className="w-[100%] md:w-[90%] mx-auto flex flex-col gap-10">
      <div className="flex items-center gap-5">
        <p className="text-2xl font-black">Manage All Your Events</p>
        <FaRegCalendar size={25} />
      </div>
      <div className="flex flex-wrap xl:flex-nowrap gap-20 xl:gap-5 justify-center sm:justify-start xl:justify-between">
        <div className="flex flex-col gap-5">
          <Card title="Instructions">
            <div className="flex flex-col gap-5">
              <p>
                1. Select dates and you will be prompted to create a new event
              </p>
              <p>2. Drag, drop, and resize events</p>
              <p>3. Click an event to delete it</p>
            </div>
          </Card>

          <div>
            <Checkbox checked={weekendsVisible} onChange={handleWeekendsToggle}>
              Toggle Weekends
            </Checkbox>
          </div>

          <div className="demo-app-sidebar-section">
            <Card title={`All Events (${currentEvents.length})`}>
              <div className="flex flex-col gap-5 max-h-[100px] overflow-y-auto">
                {currentEvents.map(renderSidebarEvent)}
              </div>
            </Card>
          </div>
        </div>

        <div className="min-w-[400px] md:min-w-[500px]">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "today",
              center: "title",
              right: "prev,next",
            }}
            themeSystem="bootstrap"
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={weekendsVisible}
            // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            eventAdd={function (e) {
              handleAddEvent(e);
            }}
            //   eventChange={function () {}}
            //   eventRemove={function () {}}
          />
        </div>
      </div>
    </div>
  );
};

export default DndCalendar;
