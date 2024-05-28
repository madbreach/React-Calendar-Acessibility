import React, { useState, useEffect } from 'react';
import '../HomePage.css'; // Import your CSS file
import { Link } from 'react-router-dom';
import '../html.css'; // Import your CSS file
import { IoPerson } from "react-icons/io5";
import { FaRegCalendarCheck } from "react-icons/fa6";


const HomePage = ({ events }) => {
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(localStorage.getItem('name') || 'Peggy');
  const [backgroundImage, setBackgroundImage] = useState(localStorage.getItem('backgroundImage') || "../public/placeholder.jpeg");
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [viewOrientation, setViewOrientation] = useState(localStorage.getItem('viewOrientation') || 'portrait');
  const [showPopup1, setShowPopup1] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [theme, setTheme] = useState('fish');
  const [selectedTheme, setSelectedTheme] = useState(''); 
  const [avatar, setAvatar] = useState('avatars/sheep.svg');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  // Function to handle avatar change
  const handleAvatarChange = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    // Save selected avatar to local storage
    localStorage.setItem('selectedAvatar', avatarUrl);
  };

  // Check local storage on component mount
  useEffect(() => {
    const storedAvatar = localStorage.getItem('selectedAvatar');
    if (storedAvatar) {
      setSelectedAvatar(storedAvatar);
    }
  }, []);

  const handleThemeChange = (themeUrl) => {
    setSelectedTheme(themeUrl);
    // Save selected theme to local storage
    localStorage.setItem('selectedTheme', themeUrl);
  };

  // Check local storage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('selectedTheme');
    if (storedTheme) {
      setSelectedTheme(storedTheme);
    }
  }, []);

  const getStarredEvents = () => {
    const storedEvents = localStorage.getItem('events');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    return events.filter(event => event.starred);
  };

  const starredEvents = getStarredEvents();

  useEffect(() => {
    console.log("List of all event titles:");
    events.forEach((event, index) => {
      console.log(`Event ${index + 1}: ${event.title}`);
    });
  }, [events]);

  useEffect(() => {
    localStorage.setItem('viewOrientation', viewOrientation);
  }, [viewOrientation]);

  useEffect(() => {
    localStorage.setItem('name', newName);
    localStorage.setItem('backgroundImage', backgroundImage);
  }, [newName, backgroundImage]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000); // Update time of day every minute

    return () => clearInterval(intervalId);
  }, []);

  

  function getTimeOfDay() {
    const hours = new Date().getHours();
    if (hours < 12) return "morning";
    else if (hours >= 12 && hours < 18) return "afternoon";
    else return "evening";
  }

  const getCurrentDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString(undefined, options);
  };

  const getTodayEvents = () => {
    const storedEvents = localStorage.getItem('events');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    const currentDate = new Date();
    return events.filter(event => {
      const eventStartDate = new Date(event.start);
      return (
        eventStartDate.getDate() === currentDate.getDate() &&
        eventStartDate.getMonth() === currentDate.getMonth() &&
        eventStartDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const todayEvents = getTodayEvents();

  const getNextUpcomingEvents = (count) => {
    const storedEvents = localStorage.getItem('events');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    const currentDate = new Date();
    const sortedEvents = events.slice().sort((a, b) => new Date(a.start) - new Date(b.start));
    return sortedEvents
      .filter((event) => new Date(event.start) >= currentDate)
      .slice(0, count);
  };

  const todayDate = getCurrentDate();
  
  const upcomingEvents = getNextUpcomingEvents();

  const handleEditName = () => {
    setEditingName(true);
  };

  const handleSaveName = () => {
    setEditingName(false);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBackgroundImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const Greetings = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "morning";
    else if (hours >= 12 && hours <= 17) return "afternoon";
    else return "evening";
  };

  const togglePopup1 = () => {
    setShowPopup1(!showPopup1);
  };

  const togglePopup2 = () => {
    setShowPopup2(!showPopup2);
  };

  

  


  return (
    <div className={viewOrientation === 'portrait' ? 'portrait-mode' : 'landscape-mode'}>
      <div className="container">
        <div className="left-content">
          <div className="greet">
            <h1>
              <span>Good {Greetings()}, </span>
              {editingName ? (
                <input type="text" value={newName} onChange={handleNameChange} />
              ) : (
                newName
              )}
            </h1> 
          </div>
          <div className="main-cont">

          
          <img className="today-sticker" src="sticky.svg" alt="today sticky note" />
          <div class="today-sticker-1">{(() => {
    const today = new Date();
    const month = today.toLocaleString('en-US', { month: 'long' });
    const day = today.getDate();
    return <p><span class="todayyy">today<br /></span>{month} <br />{day}</p>;
  })()}</div>

            <div className="today-cont">
              <div className="today-event-cont">
                {todayEvents.length > 0 ? (
                  todayEvents.map(event => (
                    <div key={event.id}>
                      <p className="t1">
                        {event.starred ? <img className="star" src="star.svg" alt="" /> : <img className="blank" src="blank.svg" alt="" />}
                        <span className="et"><strong>{event.title}</strong></span>     
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="no-events">No events :(</p>
                )}
              </div>
            </div>
            <div className="later-cont">
              <div className="later-event-cont">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.id}>
                      <p className="e1">
                        <span>
                          {event.starred ? <img className="blank" src="star.svg" alt="" /> : <img className="blank" src="blank.svg" alt="" />}
                        </span>
                        <span className="s1">{new Date(event.start).toLocaleString('en-US', { month: 'numeric', day: 'numeric'})}</span>
                        <strong>{event.title}</strong>             
                      </p>
                    </div>
                  ))
                ) : (
                  <p class="no-events-1">No upcoming events.</p>
                )}
              </div>
            </div>
          </div> {/* End of main content */}
        </div>
        <div className="sidebar">
        <img
        src={selectedAvatar || "avatars/sheep.svg"} // Display the selected avatar if available, otherwise display a default avatar
        alt="Profile Picture"
        className="profile-picture-img"
      />
          
          <div className={"decal-side-" + selectedTheme}></div>
        </div>
        <div className="footer">
          <div className="cal-line"></div>
          <button className="add-event-button" onClick={() => window.location.href="/feed"}><span class="icon-person"><FaRegCalendarCheck />
</span>SEE CALENDAR</button>
          <button className="add-event-button prof-link" onClick={togglePopup1}><span class="icon-person"><IoPerson /></span>EDIT PROFILE</button>
          
          {showPopup1 && (
            <div className="popup">
              <div className="popup-content ho">
                <span className="close" onClick={togglePopup1}>&times;</span>
                <div class="pop-in">
                <div className="name-button">
                  {editingName ? (
                    <div className="name-button">
                      <input type="text" value={newName} onChange={handleNameChange} />
                      <button class="change-name-button" onClick={handleSaveName}>Save Name</button>
                    </div>
                  ) : (
                    <div className="name-button">
                      <button class="change-name-button" onClick={handleEditName}>Edit Name</button>
                      <div class="display-current-name">{newName}</div>
                    </div>
                  )}
                  
                </div>
                <div class="theme-section">
                <div className="theme-selector">
                  <img
                    className={selectedTheme === 'flowers' ? 'selected-theme' : 'theme-button'}
                    onClick={() => handleThemeChange('flowers')}
                    src="sunflower.svg"
                    alt="Flowers"
                  />
                  <img
                    className={selectedTheme === 'fish' ? 'selected-theme' : 'theme-button'}
                    onClick={() => handleThemeChange('fish')}
                    src="fishy-icon.svg"
                    alt="fish"
                  />
                  <img
                    className={selectedTheme === 'space' ? 'selected-theme' : 'theme-button'}
                    onClick={() => handleThemeChange('space')}
                    src="star.svg"
                    alt="space"
                  />
                  </div>
                </div>
                <div class="av-section">
                <h1 class="head-text">Profile Picture</h1>
                <img
  className={selectedAvatar === '/avatars/horse.svg' ? 'selected-avatar' : 'avatar-button'}
  onClick={() => handleAvatarChange('/avatars/horse.svg')}
  src="/avatars/horse.svg"
  alt="horse"
  height="100px"
  width="100px"
/>
<img
  className={selectedAvatar === '/avatars/elephant.svg' ? 'selected-avatar' : 'avatar-button'}
  onClick={() => handleAvatarChange('/avatars/elephant.svg')}
  src="/avatars/elephant.svg"
  alt="elephant"
  height="100px"
  width="100px"
/>
<img
  className={selectedAvatar === '/avatars/dog2.svg' ? 'selected-avatar' : 'avatar-button'}
  onClick={() => handleAvatarChange('/avatars/dog2.svg')}
  src="/avatars/dog2.svg"
  alt="dog2"
  height="100px"
  width="100px"
/>
<img
  className={selectedAvatar === '/avatars/chicken.svg' ? 'selected-avatar' : 'avatar-button'}
  onClick={() => handleAvatarChange('/avatars/chicken.svg')}
  src="/avatars/chicken.svg"
  alt="chicken"
  height="100px"
  width="100px"
/>
<img
  className={selectedAvatar === '/avatars/sheep.svg' ? 'selected-avatar' : 'avatar-button'}
  onClick={() => handleAvatarChange('/avatars/sheep.svg')}
  src="/avatars/sheep.svg"
  alt="sheep"
  height="100px"
  width="100px"
/>
<img
  className={selectedAvatar === '/avatars/bird.svg' ? 'selected-avatar' : 'avatar-button'}
  onClick={() => handleAvatarChange('/avatars/bird.svg')}
  src="/avatars/bird.svg"
  alt="bird"
  height="100px"
  width="100px"
/>
<img
  className={selectedAvatar === '/avatars/flamingo.svg' ? 'selected-avatar' : 'avatar-button'}
  onClick={() => handleAvatarChange('/avatars/flamingo.svg')}
  src="/avatars/flamingo.svg"
  alt="flamingo"
  height="100px"
  width="100px"
/>
<img
  className={selectedAvatar === '/avatars/chick.svg' ? 'selected-avatar' : 'avatar-button'}
  onClick={() => handleAvatarChange('/avatars/chick.svg')}
  src="/avatars/chick.svg"
  alt="chick"
  height="100px"
  width="100px"
/>
<img
  className={selectedAvatar === '/avatars/zebra.svg' ? 'selected-avatar' : 'avatar-button'}
  onClick={() => handleAvatarChange('/avatars/zebra.svg')}
  src="/avatars/zebra.svg"
  alt="zebra"
  height="100px"
  width="100px"
/>
<img
  className={selectedAvatar === '/avatars/monkey.svg' ? 'selected-avatar' : 'avatar-button'}
  onClick={() => handleAvatarChange('/avatars/monkey.svg')}
  src="/avatars/monkey.svg"
  alt="monkey"
  height="100px"
  width="100px"
/>
<img
  className={selectedAvatar === '/avatars/gator.svg' ? 'selected-avatar' : 'avatar-button'}
  onClick={() => handleAvatarChange('/avatars/gator.svg')}
  src="/avatars/gator.svg"
  alt="gator"
  height="100px"
  width="100px"
/>
<img
  className={selectedAvatar === '/avatars/fox.svg' ? 'selected-avatar' : 'avatar-button'}
  onClick={() => handleAvatarChange('/avatars/fox.svg')}
  src="/avatars/fox.svg"
  alt="fox"
  height="100px"
  width="100px"
/></div></div>

              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default HomePage;
