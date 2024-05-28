import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import { Link } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import '../feed-style.css'; // Import your CSS file
import { FaPlus } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { TiArrowBack } from "react-icons/ti";
import { useHistory } from 'react-router-dom';




const Feed = () => {

  const [showPopup2, setShowPopup2] = useState(false);
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : [];
  });


  const calendarRef = useRef(null); // Create a ref to access the FullCalendar instance
  const [showPastEvents, setShowPastEvents] = useState(false); // State to toggle visibility of past events

  const togglePastEvents = () => {
    setShowPastEvents(!showPastEvents);
  };

  const filterEvents = (events) => {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    if (!showPastEvents) {
      return events.filter(event => new Date(event.start) >= now);
    }
    return events;
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.refetchEvents(); // Refetch events to apply filter
    }
  }, [showPastEvents]); // Call useEffect whenever showPastEvents changes

  const scrollToNextEvent = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const { date } = calendarApi.getCurrentData();
      const events = calendarApi.getEvents();
      const now = new Date();
      const nextEvent = events.find(event => new Date(event.start) >= now);
      if (nextEvent) {
        calendarApi.scrollToTime(nextEvent.start);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

 
  

  const [editableEventId, setEditableEventId] = useState(null);
  const [editedEventData, setEditedEventData] = useState({
    title: '',
    date: '',
    details: ''
  });

  const handleEditEvent = (eventId) => {
    setEditableEventId(eventId);
    const eventToEdit = events.find(event => event.id === eventId);
    setEditedEventData({
      title: eventToEdit.title,
      date: eventToEdit.start.substr(0, 10), // Extract the date part of the start date
      details: eventToEdit.extendedProps.details // Assign details from extendedProps
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Limit title to 35 characters
    if (name === 'title' && value.length > 30) {
      return; // Do not update state if exceeding limit
    }
    setEditedEventData({ ...editedEventData, [name]: value });
  };

  const handleSaveEdit = () => {
    const updatedEvents = events.map(event => {
      if (event.id === editableEventId) {
        // Calculate new start and end dates based on the edited date
        const [year, month, day] = editedEventData.date.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);
        
        // Update the event with the new start and end dates
        return {
          ...event,
          title: editedEventData.title,
          start: eventDate.toISOString(),
          end: eventDate.toISOString(),
          extendedProps: {
            details: editedEventData.details,
          },
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    setEditableEventId(null);
    setEditedEventData({ title: '', date: '', details: '' });
  };

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    details: '',
  });

  const handleAddEvent = () => {
    const { title, date, details } = newEvent;

    if (title && date) {
      const [year, month, day] = date.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day);

      const formattedEvent = {
        id: `event${events.length + 1}`,
        title,
        start: eventDate.toISOString(),
        end: eventDate.toISOString(),
        extendedProps: {
          details,
        },
      };
      const updatedEvents = [...events, formattedEvent];
      setEvents(updatedEvents);
      setNewEvent({ title: '', date: '', details: '' });
    } else {
      alert('Please fill in both title and date fields.');
    }
  };
  const togglePopup2 = () => {
    setShowPopup2(!showPopup2);
  };

  const handleDeleteEvent = (eventToDelete) => {
    const userConfirmation = window.confirm("Are you sure you want to delete this event?");
    if (userConfirmation) {
      const updatedEvents = events.filter((event) => event.id !== eventToDelete.event.id);
      setEvents(updatedEvents);
    }
  };

  const togglePin = (eventId) => {
    const starredEventsCount = events.filter(event => event.starred).length;
    
    if (starredEventsCount < 20 || events.find(event => event.id === eventId).starred) {
      const updatedEvents = events.map(event => {
        if (event.id === eventId) {
          const toggledEvent = { ...event, starred: !event.starred };
          return toggledEvent;
        }
        return event;
      });
  
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    } else {
      alert("Only 3 starred events allowed.");
    }
  };

  useEffect(() => {
    const now = new Date();
    const updatedEvents = events.map(event => {
      if (new Date(event.start) < now && event.starred) {
        return { ...event, starred: false };
      }
      return event;
    });
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  }, []);
  
  const handleTitleChange = (e) => {
    const { value } = e.target;
    // Limit title to 35 characters
    if (value.length <= 30) {
      setNewEvent({ ...newEvent, title: value });
    }
  };
  const goToHomePage = () => {
    window.location.href = "/";
  };

  const goBack = () => {
    window.history.back();
  };
  return (
      
    <div class="back">
      

      
          {showPopup2 && (
            <div className="popup">
              <div className="popup-content">
                <span className="close" onClick={togglePopup2}>&times;</span>
                <div class="pop-in yel">
                <div>
        <label class="t">Title:</label>
        <input type="text" name="title" value={newEvent.title} onChange={handleTitleChange} /> 
      </div>
      <div>
        <label class="d">Date:</label>
        <input type="date" name="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
      </div>
      <div>
        <label class="s">Notes:</label>
        <input type="text" name="details" value={newEvent.details} onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })} />
      </div>
      <div class="a-section">
      <button class="add-event-button2 " onClick={handleAddEvent}>ADD EVENT</button>
      </div>
      </div>
      
          
              </div>
            </div>
          )}
      
      
      <div class="calendar-cont">
      <img className="events-sticker" src="events-sticky.svg" alt="today sticky note" />
      <div class="add-section">
        <button className="add-event-button-x" onClick={togglePopup2}><FaPlus class="plus" />   
<span class="aa">ADD EVENT</span></button>
      </div>
      <FullCalendar
      ref={calendarRef}
        plugins={[listPlugin]}
        initialView="listYear"
        events={filterEvents(events)}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: '',
        }}
        eventContent={(arg) => (
          <>
            
            <div class="o"style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div class="oo">
            
            {arg.event.extendedProps.starred ? (
              <FaStar class="ddd" onClick={() => togglePin(arg.event.id)} />
          ) : (
              <FaRegStar class="ddd" onClick={() => togglePin(arg.event.id)} />
          )}
            
                {editableEventId === arg.event.id ? (
                  <>
                    <input
                      type="text"
                      value={editedEventData.title}
                      onChange={handleInputChange}
                      name="title"
                    />
                    <input
                      type="date"
                      value={editedEventData.date}
                      onChange={handleInputChange}
                      name="date"
                    />
                    <input
                      type="text"
                      value={editedEventData.details}
                      onChange={handleInputChange}
                      name="details"
                    />
                  </>
                ) : (
                  <b>{arg.event.title} <br></br>
                  <span class="staff-note">   {arg.event.extendedProps.details}</span></b>
                )}
                
              </div>
              <div>

                {editableEventId === arg.event.id ? (
                  <button class="s-button" onClick={handleSaveEdit}>SAVE</button>
                ) : (
                  <button class="e-button" onClick={() => handleEditEvent(arg.event.id)}>EDIT</button>
                )}
                <button class="d-button" onClick={() => handleDeleteEvent(arg)}>X</button>

              </div>
            </div>
          </>
        )}
        eventDidMount={(arg) => {
          const timeEl = arg.el.querySelector('.fc-list-event-time');
          if (timeEl) {
            timeEl.style.display = 'none';
          }
        }}
        eventsSet={scrollToNextEvent}
      />
      
      </div>
      <div class="past-event-section">
      <button class="past-button" onClick={togglePastEvents}>
      
      <button className="house-button" onClick={() => window.location.href="/"}>
      <TiArrowBack className="back-arrow"/><span class="home-text">HOME</span></button>
        {showPastEvents ? "Hide Past Events" : "Show Past Events"}</button>

      </div>
      
    </div>
  );
};

export default Feed;

