import './App.css';
import Stations from "./stations/Stations"
import React, { useState } from 'react';
import { AppBar } from '@mui/material';

const App = () => {

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
    })
  } else {
    alert("Sorry, your browser does not support HTML5 geolocation.");
  }

  var renderStations = () => {
    if (latitude != null && longitude != null) {
      return <Stations latitude={latitude} longitude={longitude}></Stations>;
    }
  }

  return (
    <div>
      <header>
        <AppBar className='App-header' position="static" color="default" variant="elevation">
          <img className='bar-logo' src='/icon.png'></img>
          <span>City Navigator</span>
        </AppBar>
      </header>
      <main>
        {renderStations()}
      </main>
      <footer><a href="https://www.flaticon.com/free-icons/" title="icons">Icons created by Google - Flaticon</a></footer>
    </div>
  );
}
  



export default App;
