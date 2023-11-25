import { useState } from "react";

import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Card, Checkbox } from "antd";

import { INITIAL_EVENTS, createEventId } from "../utils/event";

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

  return (
    <div className="w-[100%] flex flex-wrap gap-10 justify-around">
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
          initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          //   eventAdd={function () {}}
          //   eventChange={function () {}}
          //   eventRemove={function () {}}
        />
      </div>
    </div>
  );
};

export default DndCalendar;
